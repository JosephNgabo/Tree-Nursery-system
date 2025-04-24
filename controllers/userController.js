const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Ensure you're loading environment variables

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key'; // Use environment variable for security

const userController = {
  register: async (req, res) => {
    try {
      const { name, email, password, role, tree_desc_id } = req.body;

      // Validate input fields
      if (!name || !email || !password || !role || !tree_desc_id) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      // Check if email already exists
      const checkEmailQuery = 'SELECT * FROM users WHERE email = $1';
      const checkEmailResult = await db.query(checkEmailQuery, [email]);
      if (checkEmailResult.rows.length > 0) {
        return res.status(400).json({ error: 'Email is already registered' });
      }

      // Check if the tree_desc_id exists in the trees_nursery table
      const checkTreeDescQuery = 'SELECT * FROM trees_nursery WHERE tree_desc_id = $1';
      const checkTreeDescResult = await db.query(checkTreeDescQuery, [tree_desc_id]);

      if (checkTreeDescResult.rows.length === 0) {
        return res.status(400).json({
          error: 'Failed to register user',
          details: `Tree nursery record with tree_desc_id ${tree_desc_id} does not exist. Please provide a valid Tree Nursery.`
        });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user into the database
      const query = `
        INSERT INTO users (name, email, password, role, tree_desc_id, created_at)
        VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
        RETURNING id, name, email, role, tree_desc_id, created_at
      `;

      const values = [name, email, hashedPassword, role, tree_desc_id];
      const result = await db.query(query, values);

      // Return success response
      res.status(201).json(result.rows[0]);

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        error: 'Failed to register user',
        details: error.message || 'An unexpected error occurred'
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate input fields
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      // Find user
      const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = result.rows[0];

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email, role: user.role, tree_desc_id: user.tree_desc_id },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Return JWT token
      res.json({ token });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Failed to login', details: error.message });
    }
  }
};

module.exports = userController;
