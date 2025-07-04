const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate a user from a JSON Web Token passed in the Authorization
 * header of the request. If the token is invalid or missing, it sends an error response
 * with a 401 or 403 status code. If the token is valid, it adds the user to the request
 * and calls the next middleware.
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token.' });

    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
