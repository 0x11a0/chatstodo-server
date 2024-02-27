# Anonymiser Service

### Overview

The anonymiser service receives messages from the Kafka topic, `chat-messages` that comes from different platforms. It will consume the message and go through layers of filter to redact or reanonymise the messages, before inserting into the chats database.

### Instructions

1. Initialise the environments

    ```bash
    pip install virtualenv
    virtualenv venv
    
    // for mac users
    source venv/bin/activate 

    // for window users
    cd venv/bin/
    activate.bat
    cd ../..

    pip install -r requirements.txt
    ```

2. Insert environment variables

    Insert your own environment variables that is connected to a Kakfa cluster.

    ```bash
    cp .env.example .env
    ```

3. Run the service

    ```bash
    python main.py
    ```
