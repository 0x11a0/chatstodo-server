// Credential.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../services/db");
require("dotenv").config();
const Platform = require("./Platform");
const crypto = require("crypto");

const ENCRYPTION_ALGORITHM = "aes-256-ctr";
const DB_SECRET = process.env.DB_SECRET;
const IV_LENGTH = 16; // For AES, this is 16 bytes

function getKey(key) {
  return crypto
    .createHash("sha256")
    .update(String(key))
    .digest("base64")
    .substring(0, 32);
}

const encrypt = (text) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  console.log("IV", iv);
  const cipher = crypto.createCipheriv(
    ENCRYPTION_ALGORITHM,
    getKey(DB_SECRET),
    iv
  );

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  console.log(iv.toString("hex") + ":" + encrypted);
  return iv.toString("hex") + ":" + encrypted;
};

const decrypt = (hash) => {
  const parts = hash.split(":");
  const iv = Buffer.from(parts.shift(), "hex");

  // Debug: Check IV length
  console.log(`IV Length: ${iv.length}`); // Should be 16 for AES-256-CTR

  if (iv.length !== IV_LENGTH) {
    throw new Error("Invalid IV length");
  }

  const encryptedText = parts.join(":");
  const decipher = crypto.createDecipheriv(
    ENCRYPTION_ALGORITHM,
    getKey(DB_SECRET),
    iv
  );
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

const Credential = sequelize.define("Credential", {
  credentialId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  credentialSecret: {
    type: DataTypes.STRING,
    allowNull: false,
    get() {
      console.log("get");
      // Decrypt the credential secret before retrieving it
      const encryptedSecret = this.getDataValue("credentialSecret");
      return decrypt(encryptedSecret);
    },
    set(value) {
      // Encrypt the credential secret before storing it
      this.setDataValue("credentialSecret", encrypt(value));
    },
  },
});

Credential.belongsTo(Platform);
Platform.hasOne(Credential);

module.exports = Credential;
