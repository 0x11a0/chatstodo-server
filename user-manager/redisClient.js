const redis = require("redis");

class RedisClient {
  constructor() {
    if (!RedisClient.instance) {
      RedisClient.instance = this;
      this.client = redis.createClient({
        url: process.env.REDIS_URL, // Use environment variable for Redis URL
      });
      this.client.on("error", (err) =>
        console.error("Redis Client Error", err)
      );
      this.client
        .connect()
        .catch((err) => console.error("Redis Connect Error", err));
    }

    return RedisClient.instance;
  }

  async get(key) {
    try {
      return await this.client.get(key);
    } catch (error) {
      console.error("Redis Get Error", error);
      throw error;
    }
  }

  async del(key) {
    try {
      return await this.client.del(key);
    } catch (error) {
      console.error("Redis Del Error", error);
      throw error;
    }
  }

  // Add more methods as needed
}

const instance = new RedisClient();
Object.freeze(instance);

module.exports = instance;
