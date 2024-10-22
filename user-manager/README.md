# ChatsTodo - Server

## Overview

User Manager Service is an aggregator service that handles the retrieval and management of user data, including tasks, events, and summaries. It sits in the middle of Web Client, Bots and ML Serverless functions.

## Table of Contents

1. [Installation and Setup](#installation-and-setup)
1. [Interactions with other services](#interactions-with-other-services)
1. [API Usage](#api-usage)
1. [Directory Structure](#directory-structure)
1. [Testing](#testing)

## Installation and Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/lucasodra/chatstodo-server
   cd chatstodo-server/user-manager
   ```

1. **Install dependencies**:

   ```bash
   npm install
   ```

1. **Set up your environment**:

   Copy `env.example` to a new file named `.env`:

   ```bash
   cp env.example .env
   ```

   Ensure you update `.env` with the required environment variables.
   Ensure you have MongoDB installed and running locally.

1. **Start the server**:

   ```bash
   npm test
   ```

   By default, the server runs on `http://localhost:3000`.

### Set up gRPC

```
grpc_tools_node_protoc \
--js_out=import_style=commonjs,binary:./generated \
--grpc_out=grpc_js:./generated \
--proto_path=./protos \
./protos/chatstodo_ml_service.proto

```

## Interactions with other services

#### Bots

User Manager Service is in charge of linking the platforms where the bots reside to the user account. This allows us to make a connection to the platform and the groups that the user is tracking.

#### Web Client

#### ML Serverless functions

## API Usage General

**Base URL**: `http://user-manager:8081/users/api/v1`

1. **Health**

   - **Endpoint:** `/health`
   - **Method:** `GET`
   - **URL Parameters:** _None required_
   - **Body:** _None required_
   - **Expected Output:**

   ```json
   {
     "Service is healthy"
   }
   ```

### For Bots to use

1. **Get summary**

   - **Endpoint:** `/bot/all`
   - **Method:** `GET`
   - **Payload:** Insert JWT with credential id and platform in it
   - **Body:**: _None required_
   - **Expected Output:**

     ```json
     {
       "message": "Here are the summary..."
     }
     ```

1. **Get summary**

   - **Endpoint:** `/bot/refresh`
   - **Method:** `GET`
   - **Payload:** Insert JWT with credential id and platform in it
   - **Body:**: _None required_
   - **Expected Output:**

     ```json
     {
       "success": true,
       "message": "Updates were processed"
     }
     ```

     Or if there are no updates

     ```json
     {
       "success": true,
       "message": "No updates were necessary."
     }
     ```

   - **Error Responses:**

     - `500 Internal error` There is issue with the processing of messages:

       ```json
       {
         "error": "Error refreshing"
       }
       ```

#### Groups

1. **View all groups** (WIP)

   - **Endpoint:** `/groups`
   - **Method:** `GET`
   - **Payload:** Insert JWT with user id in it
   - **Body:** _None required_
   - **Expected Output:**

     ```json
     [
       {
         "platform": "Telegram",
         "groups": [

         ]
       },
       ...
     ]
     ```

### For Web Client

1. **Get summary**

   - **Endpoint:** `/summary`
   - **Method:** `POST`
   - **Payload:** Insert JWT with user id in it
   - **Body:** _None required_
   - **Expected Output:**

     ```json
     {
        "tasks": [...],
        "events": [...],
        "summaries": [...]
     }
     ```

1. **Get latest updates from chats**

   - **Endpoint:** `/refresh`
   - **Method:** `GET`
   - **Payload:** Insert JWT with user id in it
   - **Body:** _None required_
   - **Expected Output:**

     ```json
     {
       "success": true,
       "message": "Updates were processed"
     }
     ```

     Or if there are no updates

     ```json
     {
       "success": true,
       "message": "No updates were necessary."
     }
     ```

   - **Error Responses:**

     - `500 Internal error` There is issue with the processing of messages:

       ```json
       {
         "error": "Error refreshing"
       }
       ```

1. **Add platform**

   - **Endpoint:** `/platforms`
   - **Method:** `POST`
   - **Payload:** Insert JWT with user id in it
   - **Body:**

     ```json
     {
       "verificationCode": "<verification code>"
     }
     ```

   - **Expected Output:**

     Status code: 201

     ```json
     {
       "message": "Platform link added successfully."
     }
     ```

   - **Error Responses:**

     - `401 Unauthorized` if the JWT is invalid or null. The service will return:

       ```json
       {
         "error": "Unauthorized"
       }
       ```

     - `404 Not Found` if the vertification code does not exist. The service will return:

       ```json
       {
         "error": "Invalid verification code or may have expired. Please request again."
       }
       ```

     - `409 Conflict` if the user has already added the same user on the same platform. The service will return:

       ```json
       {
         "error": "Invalid verification code or may have expired. Please request again."
       }
       ```

     - `500 Internal Server Error` if

       1. the server cannot find the user id and platform in the redis.

       1. database transactions error

       The service will return:

       ```json
       {
         "error": "Verification details not found for user."
       }
       ```

1. **Remove platform**

   - **Endpoint:** `/platforms`
   - **Method:** `DELETE`
   - **Payload:** Insert JWT with user id in it
   - **Body:**

     ```json
     {
       "platformId": 1
     }
     ```

   - **Expected Output:**

     Status code: 204

   - **Error Responses:**

     - `401 Unauthorized` if the JWT is invalid or null. The service will return:

       ```json
       {
         "error": "Unauthorized"
       }
       ```

     - `403 Forbidden` if the user's platform id dont match. The service will return:

       ```json
       {
         "error": "You do not own this platform"
       }
       ```

     - `404 ` if the user's platform id dont match. The service will return:

       ```json
       {
         "error": "You do not own this platform"
       }
       ```

1. **Get all connected platforms**

   - **Endpoint:** `/platforms`
   - **Method:** `GET`
   - **Payload:** Insert JWT with user id in it
   - **Body:** _None required_
   - **Expected Output:**

     - `200 Success`
       ```json
          {
             "platforms": [
                 {
                     "id": 3,
                     "platformName": "Telegram",
                     "credentialId": "",
                     "createdAt": "",
                     "updatedAt": "",
                     "UserId": "<JWT USER ID>"
                 }
                ...
             ]
         }
       ```

   - **Error Responses:**

     - `401 Unauthorized` if the JWT is invalid or null. The service will return:

       ```json
       {
         "error": "Unauthorized"
       }
       ```

     - `500 Internal Server Error` if the server is facing error fetching. The service will return:

       ```json
       {
         "error": "Error fetching platforms."
       }
       ```

#### Group

1.  **View all groups**

    - **Endpoint:** `/groups`
    - **Method:** `GET`
    - **Payload:** Insert JWT with user id in it
    - **Body:** _None required_
    - **Expected Output:**

      Status code: 200

      ```json
      {
        "platforms": [
          {
            "platform": "Telegram",
            "groups": [
              {
                "_id": "", // object id
                "user_id": "",
                "group_id": "",
                "group_name": "Group 1",
                "platform": "Telegram",
                "created_at": "2024-03-21T09:35:08.778659+00:00"
              }
            ]
          }
        ]
      }
      ```

    - **Error Responses:**

      - `401 Unauthorized` if the JWT is invalid or null. The service will return:

        ```json
        {
          "error": "Unauthorized."
        }
        ```

      - `404 Not Found` if the users have no platform connected. The service will return:

        ```json
        {
          "error": "You do not own any platform."
        }
        ```

      - `500 Internal Server Error` if the server is facing error fetching. The service will return:

        ```json
        {
          "error": "Error fetching platforms."
        }
        ```

1.  **Delete a group**

    - **Endpoint:** `/groups`
    - **Method:** `DELETE`
    - **Payload:** Insert JWT with user id in it
    - **Body:**

      ```json
      {
        "groupId": "",
        "platform": "Telegram"
      }
      ```

    - **Expected Output:**

      Status code: 204

    - **Error Responses:**

      - `401 Unauthorized` if the JWT is invalid or null. The service will return:

        ```json
        {
          "error": "Unauthorized."
        }
        ```

      - `404 Not Found` if the users have no platform connected or no such group id under the user. The service will return:

        ```json
        {
          "error": "You do not own any platform."
        }
        ```

        ```json
        {
          "error": "Group not found."
        }
        ```

      - `500 Internal Server Error` if the server is facing error fetching. The service will return:

        ```json
        {
          "error": "Error deleting group."
        }
        ```

#### User management

1. **Logout** (WIP)
   Endpoint: `/users/logoutAll`

   Method: `POST`

   Headers:

   ```json
   {
     "Authorization": "Bearer <Your-Token>"
   }
   ```

## gRPC Service for ML Serverless Functions

## Directory Structure

Here's an overview of the main directories and files:

```
.
├── LICENSE
├── README.md
├── app.js                # Main application entry point
├── env.example           # Example environment file
├── userController.js  # Controller functions for routes
├── userRoutes.js       # Route definitions
├── generate.key.js       # Key generator utility
├── index.js              # Server initialization
├── middleware/
│   └── auth.js           # Authentication middleware
├── models/
│   └── Platform.js           # User Mongoose model
└── test/
    └── platform.test.js      # User-related tests using Axios
```

## Testing

To test user-related functionalities, use the `platform.test.js` script. This script, built with Axios, tests the following:

1. Creating Platform Link
2. Removing Platform Link
3. View all Platform Link

To run the test:

```bash
node test/user.test.js
```

---
