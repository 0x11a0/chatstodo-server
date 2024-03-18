# Chatstodo Backend

### Overview

This repo contains three services.

### Services

- Anonymiser: Redact PII from chat messages and insert into DB
- Authentication: Authenticate users
- User Manager: Manages users' tasks, summary, and events, link their platforms, and calls ML

### How to run

1. Run Docker application locally

1. Start and build the Docker compose

    ```
    docker compose up -d --build
    ```

1. View logs

    ```
    docker compose logs
    ```

1. Stop

    ```
    docker compose down
    ```

```
docker network create chatstodo
```