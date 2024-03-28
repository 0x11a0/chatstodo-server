from datetime import datetime, timezone
import hashlib
import json
import os
import re
from os.path import dirname
import uuid
from dotenv import load_dotenv
import asyncio
import logging

from confluent_kafka import Consumer, KafkaError, KafkaException
from db.postgresql import PostgresHandler
from db.mongodb import MongoDBHandler

# Setup logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def extract_emails(text):
    pattern = r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+'
    return re.findall(pattern, text)


def enforce_string(message):
    if isinstance(message, dict):
        return {k: enforce_string(v) for k, v in message.items()}
    elif isinstance(message, list):
        return [enforce_string(item) for item in message]
    else:
        return str(message)


def generate_random_token():
    random_part = str(uuid.uuid4())
    time_part = datetime.now().strftime("%Y%m%d%H%M%S%f")
    raw_token = random_part + time_part
    return hashlib.sha256(raw_token.encode()).hexdigest()


def validate_environment_variables():
    required_vars = ["UPSTASH_KAFKA_SERVER", "UPSTASH_KAFKA_USERNAME",
                     "UPSTASH_KAFKA_PASSWORD", "MONGODB_URL", "CHAT_POSTGRESQL_URL"]
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    if missing_vars:
        logger.error("Missing environment variables: {0}".format(
            ", ".join(missing_vars)))
        raise EnvironmentError("Missing required environment variables.")


def handle_kafka_error(msg):
    if msg.error().code() == KafkaError._PARTITION_EOF:
        logger.info('End of partition reached {0} [{1}]'.format(
            msg.topic(), msg.partition()))
    else:
        logger.error('Kafka error: {0}'.format(msg.error()))
        raise KafkaException(msg.error())


async def process_message(msg, token_vault, chats_db):
    try:
        json_msg = json.loads(msg.value().decode('utf-8'))
        json_msg = enforce_string(json_msg)

        msg_text = json_msg['message']
        matches = extract_emails(msg_text)
        for match in matches:
            prev_anonymised = token_vault.get_anonymised_by_type_and_original(
                match, "email")
            if not prev_anonymised:
                random_token = generate_random_token()
                anonymised_email = f'test{random_token}@{match.split("@")[1]}'
                msg_text = msg_text.replace(match, anonymised_email)
                token_vault.insert_token(anonymised_email, match, "email")
            else:
                msg_text = msg_text.replace(match, prev_anonymised)

        json_msg['message'] = msg_text

        await chats_db.insert_message(json_msg)
    except Exception as e:
        logger.error(f"Failed to process message: {e}")


async def consume_and_process(consumer, token_vault, chats_db):
    while True:
        msg = consumer.poll(timeout=1.0)
        if msg is None:
            continue
        if msg.error():
            handle_kafka_error(msg.error())
        else:
            await process_message(msg, token_vault, chats_db)


async def main():
    logger.info("Starting anonymiser...")

    dotenv_path = os.path.join(dirname(__file__), '.env')
    load_dotenv(dotenv_path)
    validate_environment_variables()

    topic = 'chat-messages'
    conf = {
        'bootstrap.servers': os.getenv("UPSTASH_KAFKA_SERVER"),
        'sasl.mechanisms': 'SCRAM-SHA-256',
        'security.protocol': 'SASL_SSL',
        'sasl.username': os.getenv('UPSTASH_KAFKA_USERNAME'),
        'sasl.password': os.getenv('UPSTASH_KAFKA_PASSWORD'),
        'group.id': 'anonymiser-group',
        'auto.offset.reset': 'earliest'
    }

    chats_db = MongoDBHandler(db_url=os.getenv('MONGODB_URL'))
    token_vault = PostgresHandler(db_url=os.getenv('CHAT_POSTGRESQL_URL'))

    consumer = Consumer(**conf)
    consumer.subscribe([topic])

    try:
        await consume_and_process(consumer, token_vault, chats_db)
    except KeyboardInterrupt:
        logger.info("Shutting down by user request.")
    except Exception as e:
        logger.error(f"Unhandled exception: {e}")
    finally:
        await chats_db.close_connection()
        token_vault.close()
        consumer.close()


if __name__ == "__main__":
    asyncio.run(main())
