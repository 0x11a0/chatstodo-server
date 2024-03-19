# Authentication Service

## Overview

Authentication Service is used to exchange a user's email for its UUID within ChatsTodo, facilitating OAuth flows and secure access.

## Endpoints

Base URL : `http://authentication:8080`

### GET /auth/api/v1/health

Checks the health of the authentication service.

- Parameters: None

- Response: `200 OK`

  ```json
  {
    "message": "Service is running"
  }
  ```

- Error Responses: `424 Failed Dependency` if the database connection is down or unresponsive. The service will return:

  ```json
  {
    "error": "Service temporarily unavailable"
  }
  ```

---

### POST /auth/api/v1/oauth/google/callback

Initiates an OAuth flow and includes the email to get the signed JWT.

- Parameters:
  | Name | Required | Type | Description |
  | ------: | :------: | :----: | ----------------------------------------------------- |
  | `email` | required | string | The user's email from the oauth will be provided here |

- Response: `200 OK`
  ```json
  {
    "token": "token eY"
  }
  ```
- Error Responses:
  - `400 Bad Request` for invalid JSON request or invalid email format:
    ```json
    {
      "error": "Invalid JSON request"
    }
    ```
    or
    ```json
    {
      "error": "Invalid email format"
    }
    ```
  - `500 Internal Server Error` for errors related to starting a transaction, creating a user, or signing a token:
    ```json
    {
      "error": "Transaction start error"
    }
    ```
    or
    ```json
    {
      "error": "Error creating user"
    }
    ```
    or
    ```json
    {
      "error": "Error signing token"
    }
    ```
    or
    ```json
    {
      "error": "Transaction commit error"
    }
    ```
    or
    ```json
    {
      "error": "Database error"
    }
    ```

---

### POST /auth/api/v1/bot/request-code

Generate a code for the user to enter into web client. This links their platform id to their ChatsTodo id.

- Parameters:
  | Name | Required | Type | Description |
  | ------: | :------: | :----: | ----------------------------------------------------- |
  | `userId` | required | string | The user's ID of the platform |
  | `platform` | required | string | The platform where the user is requesting from |

- Response: `200 OK`

  ```json
  {
    "verification_code": "<code>"
  }
  ```

- Error Responses: WIP

## Setup and Configuration

To set up the Authentication Service, ensure that the necessary environment variables are defined in your `.env` file, including `USER_POSTGRESQL_URL` for your PostgreSQL connection string and `JWT_SECRET_KEY` for JWT signing.

The service relies on Go modules for dependency management. Run `go mod tidy` to fetch the required packages.

Start the service by running `go run main.go` from the command line within the project directory.
