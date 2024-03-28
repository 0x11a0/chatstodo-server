import psycopg2
from psycopg2.extras import DictCursor


class PostgresHandler:
    def __init__(self, db_url):
        self.db_url = db_url
        self.connect_to_db()

    def connect_to_db(self):
        try:
            self.conn = psycopg2.connect(self.db_url)
            self.conn.autocommit = True
            if self.ping():
                print("Connected to PostgreSQL")
                self.initialise_tables()
            else:
                raise Exception("Ping to PostgreSQL failed")
        except Exception as e:
            print(f"Failed to connect to PostgreSQL: {e}")
            raise

    def ping(self):
        try:
            with self.conn.cursor() as cur:
                cur.execute('SELECT 1')
                if cur.fetchone():
                    print("Ping successful: PostgreSQL database is available")
                    return True
        except Exception as e:
            print(f"Ping failed: {e}")
            return False

    def initialise_tables(self):
        with self.conn.cursor() as cur:
            cur.execute("""
                CREATE TABLE IF NOT EXISTS token_vault (
                    id SERIAL PRIMARY KEY,
                    anonymised VARCHAR(255) NOT NULL,
                    original VARCHAR(255) NOT NULL UNIQUE,
                    token_type VARCHAR(50) NOT NULL,
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)

        print("Table initialised successfully.")

    def insert_token(self, anonymised, original, token_type):
        with self.conn.cursor() as cur:
            sql = "INSERT INTO token_vault (anonymised, original, token_type) VALUES (%s, %s, %s)"
            cur.execute(sql, (anonymised, original, token_type))

        print("Token inserted")

    def insert_tokens_mapping(self, email_mapping, token_type):
        with self.conn.cursor() as cur:
            for original, anonymised in email_mapping.items():
                sql = """
                    INSERT INTO token_vault (anonymised, original, token_type)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (original) DO NOTHING;
                """
                cur.execute(sql, (anonymised, original, token_type))

        print("Inserted mapping successfully.")

    def get_original_by_type_and_anonymised(self, anonymised, token_type):
        with self.conn.cursor(cursor_factory=DictCursor) as cur:
            cur.execute("""
                SELECT * FROM token_vault
                WHERE anonymised = %s AND token_type = %s
            """, (anonymised, token_type))
            result = cur.fetchone()
            return result['original'] if result else None

    def get_anonymised_by_type_and_original(self, original, token_type):
        with self.conn.cursor(cursor_factory=DictCursor) as cur:
            cur.execute("""
                SELECT * FROM token_vault
                WHERE original = %s AND token_type = %s
            """, (original, token_type))
            result = cur.fetchone()
            return result['anonymised'] if result else None

    def delete_token_by_type_and_anonymised(self, anonymised, token_type):
        with self.conn.cursor() as cur:
            cur.execute("""
                DELETE FROM token_vault
                WHERE anonymised = %s AND token_type = %s
            """, (anonymised, token_type))
            deleted_count = cur.rowcount

        print(f"{deleted_count} tokens deleted")
        return deleted_count

    def close_connection(self):
        if self.conn:
            self.conn.close()
            print("Connection to PostgreSQL closed")
