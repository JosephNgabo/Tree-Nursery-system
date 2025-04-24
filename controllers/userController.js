const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key';

const userController = {
  register: async (req, res) => {
    try {
      const { name, email, password, role, tree_desc_id } = req.body;

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

      const query = `
        INSERT INTO users (name, email, password, role, tree_desc_id, created_at)
        VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
        RETURNING id, name, email, role, tree_desc_id, created_at
      `;

      const values = [name, email, hashedPassword, role, tree_desc_id];

      const result = await db.query(query, values);

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Error in user registration:", error); // Log full error details for debugging
      res.status(500).json({
        error: 'Failed to register user',
        details: error.stack || error.message || 'An unexpected error occurred' // Send stack trace if available
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = result.rows[0];

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email, role: user.role, tree_desc_id: user.tree_desc_id },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({ token });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Failed to login' });
    }
  }
};

module.exports = userController;
