const db = require('../config/db');

const treeFieldController = {
register: async (req, res) => {
    try {
      const {
        tree_desc_id,
        growing_method_id,
        stage_id_field,
        date_planted,
        quantity,
        propagation_method,
        village_id,
        registered_by,
        notes
      } = req.body;
  
      console.log('Received data:', req.body); // Debug log
  
      // Add registration_date and created_at automatically
      const query = `
        INSERT INTO trees_field (
          tree_desc_id,
          growing_method_id,
          stage_id_field,
          date_planted,
          quantity,
          registration_date,
          propagation_method,
          village_id,
          registered_by,
          created_at,
          notes
        ) VALUES ($1, $2, $3, $4, $5, CURRENT_DATE, $6, $7, $8, CURRENT_TIMESTAMP, $9)
        RETURNING *
      `;
  
      const values = [
        tree_desc_id,
        growing_method_id,
        stage_id_field,
        date_planted,
        quantity,
        propagation_method,
        village_id,
        registered_by,
        notes
      ];
  
      console.log('Query values:', values); // Debug log
  
      const result = await db.query(query, values);
      console.log('Query result:', result.rows[0]); // Debug log
      
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Detailed error:', error); // More detailed error logging
      res.status(500).json({ 
        error: 'Failed to register tree nursery',
        details: error.message,
        code: error.code
      });
    }
  }
};

module.exports = treeFieldController;