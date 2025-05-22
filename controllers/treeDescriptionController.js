const db = require('../config/db');

const treeDescriptionController = {
  // Get all descriptions
  getAll: async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM tree_description ORDER BY tree_desc_id ASC');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching tree descriptions:', error);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  },

  // Get one by ID
  getOne: async (req, res) => {
    try {
      const { tree_desc_id } = req.params;
      const result = await db.query(
        'SELECT * FROM tree_description WHERE tree_desc_id = $1',
        [tree_desc_id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Tree description not found' });
      }
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching tree description:', error);
      res.status(500).json({ error: 'Failed to fetch record' });
    }
  },

  // Create new
  create: async (req, res) => {
    try {
      const { scientific_name, kinyarwanda, family, products } = req.body;

      const result = await db.query(
        `INSERT INTO tree_description (scientific_name, kinyarwanda, family, products)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [scientific_name, kinyarwanda, family, products]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating tree description:', error);
      res.status(500).json({ error: 'Failed to create record' });
    }
  },

  // // Update existing
  // update: async (req, res) => {
  //   try {
  //     const { tree_desc_id } = req.params;
  //     const { scientific_name, Kinyarwanda, Family, Products } = req.body;

  //     const result = await db.query(
  //       `UPDATE tree_description 
  //        SET scientific_name = $1, Kinyarwanda = $2, Family = $3, Products = $4 
  //        WHERE tree_desc_id = $5 RETURNING *`,
  //       [scientific_name, Kinyarwanda, Family, Products, tree_desc_id]
  //     );

  //     if (result.rows.length === 0) {
  //       return res.status(404).json({ message: 'Tree description not found' });
  //     }

  //     res.status(200).json(result.rows[0]);
  //   } catch (error) {
  //     console.error('Error updating tree description:', error);
  //     res.status(500).json({ error: 'Failed to update record' });
  //   }
  // },
  // Update existing 
  update: async (req, res) => {
    try {
      const { tree_desc_id } = req.params;
      const fields = req.body;
  
      const allowedFields = ['scientific_name', 'kinyarwanda', 'family', 'products'];
      const updates = [];
      const values = [];
  
      let i = 1;
      for (const key of allowedFields) {
        if (fields[key] !== undefined) {
          updates.push(`${key} = $${i}`);
          values.push(fields[key]);
          i++;
        }
      }
  
      if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields provided to update' });
      }
  
      values.push(tree_desc_id); // last value for WHERE clause
  
      const result = await db.query(
        `UPDATE tree_description SET ${updates.join(', ')} WHERE tree_desc_id = $${values.length} RETURNING *`,
        values
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Tree description not found' });
      }
  
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error updating tree description:', error);
      res.status(500).json({ error: 'Failed to update record' });
    }
  },
  

  // Delete
  delete: async (req, res) => {
    try {
      const { tree_desc_id } = req.params;

      const result = await db.query(
        'DELETE FROM tree_description WHERE tree_desc_id = $1 RETURNING *',
        [tree_desc_id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Tree description not found' });
      }

      res.status(200).json({ message: 'Tree description deleted successfully' });
    } catch (error) {
      console.error('Error deleting tree description:', error);
      res.status(500).json({ error: 'Failed to delete record' });
    }
  }
};

module.exports = treeDescriptionController;
