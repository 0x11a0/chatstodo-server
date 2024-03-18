import json
import os
import re
from os.path import dirname
from time import sleep
from dotenv import load_dotenv

from confluent_kafka import Consumer, KafkaError, KafkaException

from db.mongodb import MongoDBHandler
import re


def load_email_mapping(file_path):
    if os.path.exists(file_path):
        with open(file_path, 'r') as file:
            try:
                return json.load(file)
            except json.JSONDecodeError:
                return {}
    else:
        return {}


def save_email_mapping(email_mapping, file_path):
    with open(file_path, 'w') as file:  # Open the file in write mode
        json.dump(email_mapping, file, indent=4)
    print(f"Data written to {file_path}:", email_mapping)


def enforce_string(message):
    if isinstance(message, dict):
        return {k: enforce_string(v) for k, v in message.items()}
    elif isinstance(message, list):
        return [enforce_string(item) for item in message]
    else:
        return str(message)


def main():
    print("Starting anonymiser")

    dotenv_path = os.path.join(dirname(dirname(dirname(__file__))), '.env')
    if os.path.exists(dotenv_path):
        load_dotenv(dotenv_path)

    topic = 'chat-messages'
    UPSTASH_KAFKA_SERVER = os.getenv("UPSTASH_KAFKA_SERVER")
    UPSTASH_KAFKA_USERNAME = os.getenv('UPSTASH_KAFKA_USERNAME')
    UPSTASH_KAFKA_PASSWORD = os.getenv('UPSTASH_KAFKA_PASSWORD')
    MONGODB_URL = os.getenv('MONGODB_URL')

    chats_db = MongoDBHandler(db_url=MONGODB_URL)

    conf = {
        'bootstrap.servers': UPSTASH_KAFKA_SERVER,
        'sasl.mechanisms': 'SCRAM-SHA-256',
        'security.protocol': 'SASL_SSL',
        'sasl.username': UPSTASH_KAFKA_USERNAME,
        'sasl.password': UPSTASH_KAFKA_PASSWORD,
        'group.id': 'anonymiser-group',
        'auto.offset.reset': 'earliest'
    }

    consumer = Consumer(**conf)
    consumer.subscribe([topic])

    file_path = 'emails.json'

    email_mapping = load_email_mapping(file_path)
    email_counter = max([int(email.split('test')[1].split('@')[0])
                        for email in email_mapping.values()], default=0) + 1

    try:
        while True:
            msg = consumer.poll(timeout=1.0)
            if msg is None:
                continue
            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    # End of partition event
                    print('%% %s [%d] reached end at offset %d\n' %
                          (msg.topic(), msg.partition(), msg.offset()))
                elif msg.error():
                    raise KafkaException(msg.error())
            else:
                resp = msg.value().decode('utf-8')
                json_msg = json.loads(resp)
                json_msg = enforce_string(json_msg)

                msg = json_msg['message']

                pattern = r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+'
                matches = re.findall(pattern, msg)
                for match in matches:
                    anonymised_email = \
                        f'test{email_counter}@{match.split("@")[1]}'
                    email_mapping[match] = anonymised_email
                    email_counter += 1
                    msg = msg.replace(match, anonymised_email)

                json_msg['message'] = msg

                chats_db.insert_message(json_msg)
                print(email_mapping)
                save_email_mapping(email_mapping, file_path)

    finally:
        # Clean up on exit
        consumer.close()
        chats_db.close_connection()


if __name__ == "__main__":
    main()
