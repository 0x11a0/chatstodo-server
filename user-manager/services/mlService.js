const dotenv = require("dotenv");
dotenv.config();
const grpc = require("@grpc/grpc-js");
const { JWT } = require("google-auth-library");
const {
  ChatAnalysisServiceClient,
} = require("../generated/chatstodo_ml_service_grpc_pb");
const messages = require("../generated/chatstodo_ml_service_pb");

// Cloud Run service URL (without the protocol)
const isProd = process.env.IS_PROD.toLowerCase() === "true";
let serviceURL = isProd ? process.env.ML_URL : process.env.ML_LOCAL_URL;
let keys = isProd ? require(process.env.ML_KEY_PATH) : {};

// Initialize gRPC client
async function initGrpcClient() {
  let creds;
  if (isProd == true) {
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
    creds = grpc.credentials.combineChannelCredentials(sslCreds, authCreds);
  } else {
    // Use insecure credentials for local development
    creds = grpc.credentials.createInsecure();
  }

  return new ChatAnalysisServiceClient(serviceURL, creds);
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
    const request = new messages.UserChatRequest();
    request.setUserId(userId);

    const timestamp = new messages.google.protobuf.Timestamp();
    timestamp.fromDate(new Date());
    request.setTimestamp(timestamp);

    chatMessages.forEach((chatMsg) => {
      const chat = new messages.Chat();
      chat.setUserId(chatMsg.user_id);
      chat.setChatMessage(chatMsg.chat_message);

      const msgTimestamp = new messages.google.protobuf.Timestamp();
      msgTimestamp.fromDate(new Date(chatMsg.timestamp));
      chat.setTimestamp(msgTimestamp);

      request.addMessageText(chat);
    });

    grpcClient.analyzeChat(request, (error, response) => {
      if (error) {
        console.error("Error:", error);
        reject(error);
      } else {
        console.log("Chat Analysis Response:", response);
        resolve(response);
      }
    });
  });
}

module.exports = { initGrpcClient, sendMessageData };
