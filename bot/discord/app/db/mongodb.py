import logging
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

# Configure logging
logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class MongoDBHandler:
    def __init__(self, db_url, db_name="chatsToDo"):
        self.db_url = db_url
        self.db_name = db_name
        self.client = None
        self.db = None
        self.connect_to_db()

    def connect_to_db(self):
        try:
            self.client = MongoClient(self.db_url)
            # test connection
            self.client.admin.command('ping')
            logger.info("Ping successful: Mongo database is available")
            self.db = self.client[self.db_name]
            logger.info("Connected to MongoDB")
        except ConnectionFailure as e:
            logger.error("Failed to connect to MongoDB: %s", e)
            raise

    def insert_group(self, document, collection_name="Groups"):
        collection = self.db[collection_name]
        inserted_id = collection.insert_one(document).inserted_id
        logger.info("Inserted document with ID: %s", inserted_id)
        return inserted_id

    def close_connection(self):
        if self.client:
            self.client.close()
            logger.info("Connection to MongoDB closed")

    def get_groups_of_user(self, user_id, collection_name="Groups"):
        collection = self.db[collection_name]
        documents = collection.find({"user_id": user_id})
        return list(documents)

    def get_a_group(self, user_id, group_id, platform, collection_name="Groups"):
        collection = self.db[collection_name]
        document = collection.find_one(
            {"user_id": user_id, "group_id": group_id, "platform": platform})
        return document

    def delete_group_of_user(self, group_id, user_id, platform, collection_name="Groups"):
        collection = self.db[collection_name]
        result = collection.delete_one({
            "group_id": group_id,
            "user_id": user_id,
            "platform": platform
        })
        logger.info("Deleted count: %s", result.deleted_count)
        return result.deleted_count

    def update_group(self, group_id, user_id, group_name, collection_name="Groups"):
        collection = self.db[collection_name]
        result = collection.update_one({
            "group_id": group_id,
            "user_id": user_id
        }, {"$set": {"group_name": group_name}})
        logger.info("Modified count: %s", result.modified_count)
        return result.modified_count
