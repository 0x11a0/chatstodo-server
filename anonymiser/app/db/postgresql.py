import psycopg
from datetime import datetime, timedelta
from psycopg.rows import dict_row


class PostgresHandler:
    def __init__(self, db_conn_str):
        self.db_conn_str = db_conn_str
        self.connect_to_db()

    def connect_to_db(self):
        try:
            self.conn = psycopg.connect(self.db_conn_str, row_factory=dict_row)
            self.ping()
            print("Connected to PostgreSQL")
        except Exception as e:
            print(f"Failed to connect to PostgreSQL: {e}")
            raise

    def ping(self):
        try:
            # Attempt to open a cursor and execute a simple query
            with self.conn.cursor() as cur:
                cur.execute('SELECT 1')
                # If the query succeeds, the database is available
                if cur.fetchone():
                    print("Ping successful: PostgreSQL database is available")
                    return True
        except Exception as e:
            print(f"Ping failed: {e}")
            return

    def initialise_schema(self):
        with self.conn.cursor() as cur:
            cur.execute("CREATE SCHEMA IF NOT EXISTS chat")

            # create the mapping
            cur.execute("""
                CREATE TABLE IF NOT EXISTS chat.token_vault (
                    id SERIAL PRIMARY KEY,
                    anonymised VARCHAR(255) NOT NULL,
                    original VARCHAR(255) NOT NULL UNIQUE,
                    token_type VARCHAR(50) NOT NULL,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)

        print("Schema initialised successfully.")

    def insert_token(self, anonymised, original, token_type):
        with self.conn.cursor() as cur:
            sql = "INSERT INTO chat.token_vault (anonymised, original, token_type) VALUES (%s, %s, %s)"
            cur.execute(sql, (anonymised, original, token_type))
            print("Token inserted")

    def get_original_by_type_and_anonymised(self, anonymised, token_type):
        with self.conn.cursor() as cur:
            cur.execute("""
                SELECT * FROM chat.token_vault
                WHERE anonymised = %s AND token_type = %s
            """, (anonymised, token_type))
            return cur.fetchone()

    def delete_token_by_type_and_anonymised(self, anonymised, token_type):
        with self.conn.cursor() as cur:
            cur.execute("""
                DELETE FROM chat.token_vault
                WHERE anonymised = %s AND token_type = %s
            """, (anonymised, token_type))
            deleted_count = cur.rowcount
            print(f"{deleted_count} deleted")
            return deleted_count

    def close_connection(self):
        if self.conn:
            self.conn.close()
            print("Connection to PostgreSQL closed")
