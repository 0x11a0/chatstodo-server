# ChatsTodo - Server

### Overview
Handles the retrieval and management of user data, including tasks, events, and summaries, from the ML Serverless Functions.

#### Table of Contents

1. [Installation and Setup](#installation-and-setup)
2. [API Usage](#api-usage)
3. [Directory Structure](#directory-structure)
4. [Testing](#testing)

#### Installation and Setup

1. **Clone the repository**:

    ```bash
    git clone https://github.com/lucasodra/chatstodo-server
    cd chatstodo-server/user-manager
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Set up your environment**:

    Copy `env.example` to a new file named `.env`:

    ```bash
    cp env.example .env
    ```

    Ensure you update `.env` with the required environment variables.
    Ensure you have MongoDB installed and running locally.

4. **Start the server**:

    ```bash
    npm test
    ```

    By default, the server runs on `http://localhost:3000`.


#### API Usage

**Base URL**: `http://localhost:3000/api`

1. **Register a new user (pending confirmation with auth service)**

    - **Endpoint:** `/users/register`
    - **Method:** `POST`
    - **Body:**

    ```json
    {
        "username": "newUser",
        "email": "newuser@example.com",
        "password": "password123"
    }
    ```

    - **Expected Output:**

    ```json
    {
        "message": "User registered successfully!"
    }
    ```

2. **Refresh All User Data**

    - **Endpoint:** `/users/:userId/refreshAll`
    - **Method:** `POST`
    - **URL Parameters:** Replace `:userId` with the actual user ID.
    - **Body:** *None required*
    - **Expected Output:**

    ```json
    {
        "message": "Refresh all requested successfully."
    }
    ```

3. **Get User Data**

    - **Endpoint:** `/users/:userId/data`
    - **Method:** `GET`
    - **URL Parameters:** Replace `:userId` with the actual user ID.
    - **Body:** *None required*
    - **Expected Output:**

    ```json
    {
        "tasks": [...],
        "events": [...],
        "summaries": [...]
    }
    ```

4. **Add Platform Link**

    - **Endpoint:** `/users/:userId/platforms`
    - **Method:** `POST`
    - **URL Parameters:** Replace `:userId` with the actual user ID.
    - **Body:**

    ```json
    {
        "platform": "Telegram",
        "credentials": {
            "token": "abc123",
            "otherKey": "value"
        }
    }
    ```

    - **Expected Output:**

    ```json
    {
        "message": "Platform link added successfully."
    }
    ```

5. **Remove Platform Link**

    - **Endpoint:** `/users/:userId/platforms`
    - **Method:** `DELETE`
    - **URL Parameters:** Replace `:userId` with the actual user ID.
    - **Body:**

    ```json
    {
        "platform": "Telegram"
    }
    ```

    - **Expected Output:**

    ```json
    {
        "message": "Platform link removed successfully."
    }
    ```

6. **Get All Platform Links**

    - **Endpoint:** `/users/:userId/platforms`
    - **Method:** `GET`
    - **URL Parameters:** Replace `:userId` with the actual user ID.
    - **Body:** *None required*
    - **Expected Output:**

    ```json
    [
        {
            "platformName": "Telegram",
            "credentials": {
                "token": "abc123",
                "otherKey": "value"
            }
        },
        ...
    ]
    ```

    Endpoint: `/users/logoutAll`
    
    Method: `POST`

    Headers:

    ```json
    {
        "Authorization": "Bearer <Your-Token>"
    }
    ```

#### Directory Structure

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

#### Testing

To test user-related functionalities, use the `platform.test.js` script. This script, built with Axios, tests the following:
1. Creating Platform Link
2. Removing Platform Link
3. View all Platform Link

To run the test:

```bash
node test/user.test.js
```

---
