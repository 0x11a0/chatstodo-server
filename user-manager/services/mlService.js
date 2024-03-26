const dotenv = require("dotenv");
dotenv.config();
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const { JWT } = require("google-auth-library");
const keys = require(process.env.ML_KEY_PATH);
const PROTO_PATH = process.env.ML_PROTO_PATH;

// Load your proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const chatstodo_ml_service = protoDescriptor.chatstodo_ml_service;

// Cloud Run service URL (without the protocol)
let serviceURL = "";
if (process.env.IS_PROD.toLowerCase() === "true") {
  serviceURL = process.env.ML_URL; // Update this
} else {
  //   serviceURL = process.env.ML_URL;
}

// Initialize gRPC client
async function initGrpcClient() {
  const client = new JWT({
    email: keys.client_email,
    key: keys.private_key,
  });
  const idToken = await client.fetchIdToken(`https://${serviceURL}`);

  const sslCreds = grpc.credentials.createSsl();
  const authCreds = grpc.credentials.createFromMetadataGenerator(
    (params, callback) => {
      const metadata = new grpc.Metadata();
      metadata.add("authorization", `Bearer ${idToken}`);
      callback(null, metadata);
    }
  );
  const combinedCreds = grpc.credentials.combineChannelCredentials(
    sslCreds,
    authCreds
  );

  return new chatstodo_ml_service.ChatAnalysisService(
    `${serviceURL}:443`, // Include the port
    combinedCreds
  );
}

let grpcClient;
initGrpcClient()
  .then((client) => {
    grpcClient = client;
  })
  .catch(console.error);

// Helper function to send message data
function sendMessageData(grpcClient, userId, messageArray) {
    return new Promise((resolve, reject) => {
      const timestamp = { seconds: Math.floor(Date.now() / 1000), nanos: 0 };
      const request = {
        "message_text": messageArray,
        "timestamp": timestamp,
        "user_id": userId
      };
  
      grpcClient.analyzeChat(request, (error, response) => {
        if (error) {
          console.error("Error:", error);
          reject(error); // Reject the promise on error
        } else {
          console.log("Chat Analysis Response:", response);
          resolve(response); // Resolve the promise with the response
        }
      });
    });
  }  

module.exports = { initGrpcClient, sendMessageData };
// async function main() {
//     try {
//         let grpcClient = await initGrpcClient();
//         sendMessageData(grpcClient, "123123", "");
//     } catch (error) {
//         console.error(error);
//     }
// }
// main();