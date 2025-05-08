const db = require('../config/db');

const treeNurseryController = {
  // register: async (req, res) => {
  //   try {
  //     const {
  //       tree_desc_id,
  //       growing_method_id,
  //       stage_id_nursery,
  //       date_planted,
  //       quantity,
  //       propagation_method,
  //       village_id,
  //       registered_by,
  //       notes
  //     } = req.body;

  //     console.log('Received data:', req.body); // Debug log

  //     // Add registration_date and created_at automatically
  //     const query = `
  //       INSERT INTO trees_nursery (
  //         tree_desc_id,
  //         growing_method_id,
  //         stage_id_nursery,
  //         date_planted,
  //         quantity,
  //         registration_date,
  //         propagation_method,
  //         village_id,
  //         registered_by,
  //         created_at,
  //         notes
  //       ) VALUES ($1, $2, $3, $4, $5, CURRENT_DATE, $6, $7, $8, CURRENT_TIMESTAMP, $9)
  //       RETURNING *
  //     `;

  //     const values = [
  //       tree_desc_id,
  //       growing_method_id,
  //       stage_id_nursery,
  //       date_planted,
  //       quantity,
  //       propagation_method,
  //       village_id,
  //       registered_by,
  //       notes
  //     ];

  //     console.log('Query values:', values); // Debug log

  //     const result = await db.query(query, values);
  //     console.log('Query result:', result.rows[0]); // Debug log
      
  //     res.status(201).json(result.rows[0]);
  //   } catch (error) {
  //     console.error('Detailed error:', error); // More detailed error logging
  //     res.status(500).json({ 
  //       error: 'Failed to register tree nursery',
  //       details: error.message,
  //       code: error.code
  //     });
  //   }
  // },

  register: async (req, res) => {
    try {
      const {
        tree_desc_id,         // ✅ Directly from client
        growing_method_id,
        stage_id_nursery,
        date_planted,
        quantity,
        propagation_method,
        village_id,
        registered_by,
        notes
      } = req.body;
  
      // ✅ Step 1: Validate required fields
      if (
        !tree_desc_id || !growing_method_id || !stage_id_nursery || !date_planted ||
        !quantity || !propagation_method || !village_id || !registered_by
      ) {
        return res.status(400).json({
          error: 'Missing required fields',
          details: 'Ensure all required fields including tree_desc_id are provided'
        });
      }
  
      // ✅ Step 2: Insert into trees_nursery
      const insertQuery = `
        INSERT INTO trees_nursery (
          tree_desc_id,
          growing_method_id,
          stage_id_nursery,
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
        stage_id_nursery,
        date_planted,
        quantity,
        propagation_method,
        village_id,
        registered_by,
        notes || null
      ];
  
      const result = await db.query(insertQuery, values);
  
      return res.status(201).json({
        message: 'Tree nursery registered successfully',
        data: result.rows[0]
      });
    } catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({
        error: 'Failed to register tree nursery',
        details: error.message,
        code: error.code
      });
    }
  },
    
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        tree_desc_id,
        growing_method_id,
        stage_id_nursery,
        date_planted,
        quantity,
        propagation_method,
        village_id,
        notes
      } = req.body;

      console.log('Updating record:', id, req.body);

      const query = `
        UPDATE trees_nursery 
        SET 
          tree_desc_id = $1,
          growing_method_id = $2,
          stage_id_nursery = $3,
          date_planted = $4,
          quantity = $5,
          propagation_method = $6,
          village_id = $7,
          notes = $8,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $9
        RETURNING *
      `;

      const values = [
        tree_desc_id,
        growing_method_id,
        stage_id_nursery,
        date_planted,
        quantity,
        propagation_method,
        village_id,
        notes,
        id
      ];

      const result = await db.query(query, values);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Tree nursery record not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Update error:', error);
      res.status(500).json({ 
        error: 'Failed to update tree nursery record',
        details: error.message 
      });
    }
  },
  view: async (req, res) => {
    try {
      const { tree_desc_id, village_id, date_planted } = req.query; // Fetch query params if they exist
  
      // Base query
      let query = 'SELECT * FROM trees_nursery';
      let queryParams = [];
  
      // Add filters if specific query parameters are provided
      if (tree_desc_id || village_id || date_planted) {
        query += ' WHERE';
        let conditions = [];
  
        if (tree_desc_id) {
          conditions.push('tree_desc_id = $1');
          queryParams.push(tree_desc_id);
        }
  
        if (village_id) {
          conditions.push('village_id = $2');
          queryParams.push(village_id);
        }
  
        if (date_planted) {
          conditions.push('date_planted = $3');
          queryParams.push(date_planted);
        }
  
        // Join all conditions
        query += ' ' + conditions.join(' AND ');
      }
  
      query += ' ORDER BY created_at DESC'; // Optionally order by created_at or any other column
  
      // Execute the query
      const result = await db.query(query, queryParams);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'No records found' });
      }
  
      res.status(200).json(result.rows); // Return all records or filtered records
    } catch (error) {
      console.error('Error fetching records:', error);
      res.status(500).json({
        error: 'Failed to fetch tree nursery records',
        details: error.message
      });
    }
  },

  // Get single tree nursery
  viewSingle: async (req, res) => {
    try {
      const { tree_desc_id } = req.params;  // Get the tree_desc_id from the route parameter
  
      const query = `
        SELECT * FROM trees_nursery 
        WHERE tree_desc_id = $1
        LIMIT 1
      `;
  
      const result = await db.query(query, [tree_desc_id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Tree nursery record not found' });
      }
  
      res.status(200).json(result.rows[0]);  // Return the single record (first match)
    } catch (error) {
      console.error('Error fetching record:', error);
      res.status(500).json({
        error: 'Failed to fetch tree nursery record',
        details: error.message
      });
    }
  },
  update: async (req, res) => {
    try {
      const { tree_desc_id } = req.params;  // Get tree_desc_id from route parameter
      const { quantity, propagation_method, notes } = req.body;  // Fields to update
  
      console.log('Updating tree nursery record with tree_desc_id:', tree_desc_id);
  
      // SQL query to update the tree nursery record
      const query = `
        UPDATE trees_nursery
        SET
          quantity = $1,
          propagation_method = $2,
          notes = $3,
          updated_at = CURRENT_TIMESTAMP  -- Automatically set updated_at
        WHERE tree_desc_id = $4
        RETURNING *  -- Return the updated record
      `;
  
      const values = [quantity, propagation_method, notes, tree_desc_id];
  
      // Execute the query
      const result = await db.query(query, values);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Tree nursery record not found' });
      }
  
      // Return the updated tree nursery record
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Update error:', error);
      res.status(500).json({
        error: 'Failed to update tree nursery record',
        details: error.message
      });
    }
  },
  delete: async (req, res) => {
    try {
      // Extracting the tree_desc_id from the request parameters
      const { tree_desc_id } = req.params;
  
      console.log('Deleting record with tree_desc_id:', tree_desc_id);
  
      // SQL query to delete the tree nursery record by tree_desc_id
      const query = `
        DELETE FROM trees_nursery
        WHERE tree_desc_id = $1
        RETURNING *
      `;
  
      // Execute the query
      const result = await db.query(query, [tree_desc_id]);
  
      // If no rows were deleted, respond with an error message
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Tree nursery record not found' });
      }
  
      // Send a success response
      res.json({ message: 'Tree nursery record deleted successfully', deletedRecord: result.rows[0] });
    } catch (error) {
      console.error('Delete error:', error);
      res.status(500).json({
        error: 'Failed to delete tree nursery record',
        details: error.message,
      });
    }
  }  
  
};

module.exports = treeNurseryController; 