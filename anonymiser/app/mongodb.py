from pymongo import MongoClient
from pymongo.errors import ConnectionFailure


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
