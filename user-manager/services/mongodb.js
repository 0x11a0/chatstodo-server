const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const mongoDBURL = process.env.MONGODB_URL;

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(mongoDBURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to MongoDB:", error);
  }
};

async function testConnection() {
  try {
    await connectToMongoDB();
  } catch (error) {
    console.error("Connection test failed:", error);
  }
}

module.exports = { connectToMongoDB, testConnection };
