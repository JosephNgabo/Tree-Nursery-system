const crypto = require('crypto');

// Generate a 256-bit (32-byte) random string for your JWT secret
const JWT_SECRET = crypto.randomBytes(32).toString('hex');
console.log(JWT_SECRET);