const db = require('../config/db');

const treeController = {
  registerTree: async (req, res) => {
    try {
      const { name, species, variety, category, latitude, longitude } = req.body;
      
      const query = `
        INSERT INTO trees (name, species, variety, category, latitude, longitude, created_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      
      const values = [name, species, variety, category, latitude, longitude, req.user.id];
      const result = await db.query(query, values);
      
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error registering tree:', error);
      res.status(500).json({ error: 'Failed to register tree' });
    }
  },

  getAllTrees: async (req, res) => {
    try {
      const query = 'SELECT * FROM trees';
      const result = await db.query(query);
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching trees:', error);
      res.status(500).json({ error: 'Failed to fetch trees' });
    }
  },

  getTreeById: async (req, res) => {
    try {
      const { id } = req.params;
      const query = 'SELECT * FROM trees WHERE id = $1';
      const result = await db.query(query, [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Tree not found' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching tree:', error);
      res.status(500).json({ error: 'Failed to fetch tree' });
    }
  }
};

module.exports = treeController; 