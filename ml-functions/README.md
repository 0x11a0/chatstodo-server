# Chatstodo ML Functions

The Chat Analysis Service is a gRPC-based application designed to analyze chat messages using OpenAI's GPT-3.5 Turbo. It summarizes chat messages, extracts tasks, and identifies events, providing a comprehensive overview of the chat content.

## What's Completed as of 22 March 2024

- **Protobuf Schema**: Defined for `UserChatRequest` and `ChatAnalysisResponse` to structure the request and response data. `Chat` and `EventDetail` made to detail chat messages and events more accurately
- **gRPC Code Generation**: Generated the necessary `pb2` and `pb2_grpc` files from the protobuf schema.
- **OpenAI Helper**: Implemented `openai_helper.py` to interact with OpenAI's API for processing chat messages.
- **gRPC Server**: Created `server.py` to set up the gRPC server and handle incoming requests.
- **Dependencies**: Listed all necessary dependencies in `requirements.txt` for easy installation.
- **Docker**: Created `dockerfile` to define the environment and instructions for building the Docker image of the service. Included a .dockerignore file to prevent unnecessary or sensitive files from being added to the Docker context, optimizing the build process and ensuring the Docker image contains only what's necessary for the service to run.
- **Deployment**: Successfully deployed the containerized service to Google Cloud Run, leveraging its fully managed platform to automatically scale the service based on incoming requests, and ensuring a secure and highly available environment.

## Getting Started

### Prerequisites

- Docker installed on your machine.
- Google Cloud SDK (gcloud CLI) installed. Documentation: https://cloud.google.com/run/docs/quickstarts (This service was deployed on GCR)

### Installing Google Cloud SDK

Ensure you have an account with Google Cloud. Install the SDK here: https://cloud.google.com/sdk/docs/install.

Extract the archive to any location and run the script with the following command:

```bash
./google-coud-sdk/install.sh
```

Open a new terminal so that the changes take effect.

Initialize gcloud CLI:

```bash
gcloud init
```

## Setup

### Cloning the Repository

To get started, clone this repository to your local machine:

```bash
git clone https://github.com/lucasodra/chatstodo-ml-functions.git
cd chat-analysis-service
```

### Virtual Environment Setup

Install virtualenv if you don't have it

```bash
pip install virtualenv
```

Create a virtual environment

```bash
virtualenv venv
```

Activate the virtual environment

```bash
# On Windows
venv\Scripts\activate

# On Unix or MacOS
source venv/bin/activate
```

### Dependencies

With the virtual environment activated, install the project dependencies.

```bash
pip install -r requirements.txt
```

At any point of time if you have installed a dependency. Update requirements.txt with

```bash
pip freeze > requirements.txt
```

### Environment Variables

Copy the `.env.example` file to `.env` and fill in your OPenAI API key.

```bash
cp .env.example .env
# Edit .env to add your OpenAI API key
```

### Regerating gRPC Stubs

If you make changes to the protobuf schema, you need to regenerate the Python gRPC code stubs (`pb2.py` and `pb2_grpc.py`). Ensure you have `grpcio-tools` installed and run the following command from the prohect root.

```bash
python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. ./chatstodo_ml_service.proto
```

### Running the server

Start the gRPC Server

```bash
python server.py
```

## Docker

### Building and pushing Docker Image

Build your docker image by navigating to your project directory and run:

```bash
docker build -t [PROJECT-NAME]
```

Bear in mind if you are using ARM architecture and wish to deploy on Google Cloud Run you'd need to build in another architecture.

```bash
docker buildx build -t [PROJECT-NAME] --platform linux/amd64 . [OTHER-ARCHITECTURE]
```

### Tag Docker image for Google Container Registry

Replace `[Project-ID]` with your Google Cloud Project ID.

```bash
docker tag [PROJECT-NAME] gcr.io/[PROJECT-ID]/[PROJECT-NAME]
```

### Push your Docker image to GCR

Ensure you are authenticated with

```bash
gcloud auth configure-docker
docker push gcr.io/[PROJECT-ID]/[PROJECT-NAME]
```

When you have deployed on Google Cloud Run and require an identity token for authentication. Access with:

```bash
gcloud auth print-identity-token
```

# Conclusion

You've now built and deployed your Chat Analysis Service to Google Cloud Run, and you know how to obtain an identity token for authenticated access. This setup leverages Google Cloud's serverless platform to offer a scalable and secure environment for running your ML functions.

Remember to replace placeholders like [PROJECT-ID] and [REGION] with your actual Google Cloud Project ID and the region you're deploying to. This README provides a concise guide to getting your service running on Google Cloud Run, including handling authentication with identity tokens for secure access.
