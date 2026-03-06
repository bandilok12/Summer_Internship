const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from header
 let token;
  
  // 1. Check headers (x-auth-token)
  if (req.headers['x-auth-token']) {
    token = req.headers['x-auth-token'];
  }
  // 2. Check Authorization header (Bearer scheme)
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Check if no token
  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    
    res.status(401).json({ error: 'Token is not valid' });
  }
};