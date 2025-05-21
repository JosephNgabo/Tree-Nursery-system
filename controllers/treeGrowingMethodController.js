const db = require('../config/db');

const treeGrowingMethodsController = {
  // Create a new growing method
  register: async (req, res) => {
    try {
      const { method_name, description } = req.body;

      const query = `
        INSERT INTO tree_growing_methods (method_name, description)
        VALUES ($1, $2)
        RETURNING *;
      `;
      const result = await db.query(query, [method_name, description]);

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating method:', error);
      res.status(500).json({ error: 'Failed to create tree growing method' });
    }
  },

  // Get all methods
  viewAll: async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM tree_growing_methods ORDER BY method_id ASC');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching methods:', error);
      res.status(500).json({ error: 'Failed to fetch tree growing methods' });
    }
  },

  // Get single method by ID
  viewSingle: async (req, res) => {
    try {
      const { method_id } = req.params;

      const result = await db.query(
        'SELECT * FROM tree_growing_methods WHERE method_id = $1',
        [method_id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Method not found' });
      }

      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching method:', error);
      res.status(500).json({ error: 'Failed to fetch method' });
    }
  },

  // Update method
  update: async (req, res) => {
    try {
      const { method_id } = req.params;
      const { method_name, description } = req.body;

      const result = await db.query(
        `UPDATE tree_growing_methods
         SET method_name = $1, description = $2
         WHERE method_id = $3
         RETURNING *`,
        [method_name, description, method_id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Method not found' });
      }

      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error updating method:', error);
      res.status(500).json({ error: 'Failed to update tree growing method' });
    }
  },

  // Delete method
  delete: async (req, res) => {
    try {
      const { method_id } = req.params;

      const result = await db.query(
        'DELETE FROM tree_growing_methods WHERE method_id = $1 RETURNING *',
        [method_id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Method not found' });
      }

      res.status(200).json({ message: 'Method deleted successfully' });
    } catch (error) {
      console.error('Error deleting method:', error);
      res.status(500).json({ error: 'Failed to delete tree growing method' });
    }
  }
};

module.exports = treeGrowingMethodsController;
