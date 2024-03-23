const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { JWT } = require('google-auth-library');
const keys = require('./path/to/your/service/account/key.json'); // Update the path
const PROTO_PATH = './path/to/your/chatstodo_ml_service.proto'; // Update the path

// Load your proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const chatstodo_ml_service = protoDescriptor.chatstodo_ml_service;

// Cloud Run service URL (without the protocol)
const serviceURL = 'your-cloud-run-service-url'; // Update this

// Initialize gRPC client
async function initGrpcClient() {
    const client = new JWT({
        email: keys.client_email,
        key: keys.private_key,
    });
    const idToken = await client.fetchIdToken(`https://${serviceURL}`);

    const sslCreds = grpc.credentials.createSsl();
    const authCreds = grpc.credentials.createFromMetadataGenerator((params, callback) => {
        const metadata = new grpc.Metadata();
        metadata.add('authorization', `Bearer ${idToken}`);
        callback(null, metadata);
    });
    const combinedCreds = grpc.credentials.combineChannelCredentials(sslCreds, authCreds);

    return new chatstodo_ml_service.ChatAnalysisService(
        `${serviceURL}:443`, // Include the port
        combinedCreds
    );
}

let grpcClient;
initGrpcClient().then(client => {
    grpcClient = client;
}).catch(console.error);

// Helper function to send message data
function sendMessageData(userId, messageArray) {
    const timestamp = { seconds: Math.floor(Date.now() / 1000), nanos: 0 };
    const request = {
        user_id: userId,
        timestamp,
        message_text: messageArray
    };

    grpcClient.analyzeChat(request, (error, response) => {
        if (error) {
            console.error('Error:', error);
            return;
        }
        console.log('Chat Analysis Response:', response);
    });
}

module.exports = { sendMessageData };
