const crypto = require('crypto');

// 256-bit key
const secret = crypto.randomBytes(32).toString('hex');

console.log(secret);