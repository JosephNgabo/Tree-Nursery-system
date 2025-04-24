const jwt = require('jsonwebtoken');

// Use the environment variable if available
const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key';

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

module.exports = auth;