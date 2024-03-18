from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from datetime import datetime, timedelta, timezone


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
            print("Ping successful: Mongo database is available")
            self.db = self.client[self.db_name]
            print("Connected to MongoDB")
        except ConnectionFailure:
            print("Failed to connect to MongoDB")
            raise

    # Connect to MongoDB, use the "chatsToDo" database and the "Messages" collection
    def insert_message(self, document, collection_name="Messages"):
        collection = self.db[collection_name]
        return collection.insert_one(document).inserted_id

    def close_connection(self):
        self.client.close()
        print("Connection to MongoDB closed")

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
            "timestamp": {"$gte": twenty_four_hours_ago.isoformat()}
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
            "timestamp": {"$gte": twenty_four_hours_ago.isoformat()}
        })

        return result.deleted_count
