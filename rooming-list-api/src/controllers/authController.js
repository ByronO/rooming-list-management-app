const jwt = require('jsonwebtoken');

/**
 * Authenticates a user and returns a JWT token if the credentials are valid.
 *
 * @param {Object} req - The request object containing the username and password
 *   in the body.
 * @param {Object} res - The response object used to send back the JSON response.
 *
 * @returns {Object} - A JSON object containing the JWT token.
 */
const login = (req, res) => {
  const { username, password } = req.body;

  const hardcodedUser = {
    username: 'admin',
    password: 'password123',
  };

  if (username !== hardcodedUser.username || password !== hardcodedUser.password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token });
};

module.exports = {
  login,
};