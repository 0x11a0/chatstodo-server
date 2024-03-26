import motor.motor_asyncio
import logging
from datetime import datetime, timedelta, timezone

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class MongoDBHandler:
    def __init__(self, db_url, db_name="chatsToDo"):
        self.client = motor.motor_asyncio.AsyncIOMotorClient(db_url)
        self.db = self.client[db_name]
        logger.info("Connected to MongoDB")

    async def insert_message(self, document, collection_name="Messages"):
        # Ensure 'timestamp' is correctly formatted as a datetime object
        document['timestamp'] = datetime.now(timezone.utc)
        collection = self.db[collection_name]
        result = await collection.insert_one(document)
        logger.info(f"Inserted document with ID: {result.inserted_id}")

    async def close_connection(self):
        self.client.close()
        logger.info("Connection to MongoDB closed")

    # To call, use the following code:
    # documents = mongo_handler.get_past_24hrs("<GROUP_ID>"), replace group id with your group id
    # returns a list of documents corresponding to the chat messages

    def get_past_24hrs(self, group_id, collection_name="Messages"):
        collection = self.db[collection_name]

        # Calculate the timestamp 24 hours ago
        # Can change timedelta accordingly to the time period you want to delete
        twenty_four_hours_ago = datetime.now(timezone.utc) - timedelta(days=1)

        # Find documents matching the group_id and having a timestamp within the past 24 hours
        documents = collection.find({
            "group_id": group_id,
            "timestamp": {"$gt": twenty_four_hours_ago}
        })

        return list(documents)

    # To call, use the following code:
    # deleted_count = mongo_handler.delete_past_24hrs("<GROUP_ID>"), replace group id with your group id
    # returns number of documents deleted

    def delete_past_24hrs(self, group_id, collection_name="Messages"):
        collection = self.db[collection_name]

        # Calculate the timestamp 24 hours ago
        # Can change timedelta accordingly to the time period you want to delete
        twenty_four_hours_ago = datetime.now(timezone.utc) - timedelta(days=1)

        # Delete documents matching the group_id and having a timestamp within the past 24 hours
        result = collection.delete_many({
            "group_id": group_id,
            "timestamp": {"$gt": twenty_four_hours_ago}
        })

        return result.deleted_count
