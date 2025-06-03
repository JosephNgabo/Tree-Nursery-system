const db = require('../config/db');

const treeNurseryController = {

    register: async (req, res) => {
        try {
            const {
                tree_desc_id,        
                quantity_added,
                registration_date,
                village_id,
                registered_by,
                notes
            } = req.body;
    
            // ✅ Step 1: Validate required fields
            if (!tree_desc_id || !quantity_added || !registration_date || !village_id || !registered_by) {
                return res.status(400).json({
                    error: 'Missing required fields',
                    details: 'Ensure all required fields are provided'
                });
            }
    
            // Start a transaction to ensure data consistency
            await db.query('BEGIN');
    
            try {
                // ✅ Step 2: Insert into trees_nursery
                const insertNurseryQuery = `
                    INSERT INTO trees_nursery (
                        tree_desc_id,
                        quantity_added,
                        registration_date,
                        village_id,
                        registered_by,
                        notes
                    ) VALUES ($1, $2, $3, $4, $5, $6)
                    RETURNING *
                `;
    
                const nurseryValues = [
                    tree_desc_id,
                    quantity_added,
                    registration_date,
                    village_id,
                    registered_by,
                    notes || null
                ];
    
                const nurseryResult = await db.query(insertNurseryQuery, nurseryValues);
    
                // ✅ Step 3: Update tree_description quantity_nursery
                const updateTreeDescQuery = `
                    UPDATE tree_description 
                    SET quantity_nursery = quantity_nursery + $1
                    WHERE tree_desc_id = $2
                    RETURNING *
                `;
    
                const treeDescResult = await db.query(updateTreeDescQuery, [quantity_added, tree_desc_id]);
    
                // ✅ Step 4: Insert into tree_monitoring
                const insertMonitoringQuery = `
                    INSERT INTO tree_monitoring (
                        tree_desc_id,
                        monitoring_date,
                        quantity,
                        health_status,
                        source,
                        monitored_by,
                        notes
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                    RETURNING *
                `;
    
                const monitoringValues = [
                    tree_desc_id,
                    registration_date,
                    quantity_added,
                    'active',
                    1,
                    registered_by,
                    notes || null
                ];
    
                const monitoringResult = await db.query(insertMonitoringQuery, monitoringValues);
    
                // Commit the transaction
                await db.query('COMMIT');
    
                return res.status(201).json({
                    message: 'Tree nursery registered successfully',
                    data: {
                        nursery: nurseryResult.rows[0],
                        treeDescription: treeDescResult.rows[0],
                        monitoring: monitoringResult.rows[0]
                    }
                });
    
            } catch (error) {
                // Rollback the transaction in case of error
                await db.query('ROLLBACK');
                throw error;
            }
    
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

      // Start a transaction
      await db.query('BEGIN');

      try {
        // Update trees_nursery
        const updateNurseryQuery = `
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

        const result = await db.query(updateNurseryQuery, values);

        if (result.rows.length === 0) {
          await db.query('ROLLBACK');
          return res.status(404).json({ error: 'Tree nursery record not found' });
        }

        // Update tree_description quantity_nursery if quantity changed
        if (quantity) {
          const updateTreeDescQuery = `
            UPDATE tree_description 
            SET quantity_nursery = quantity_nursery + ($1 - (
              SELECT quantity FROM trees_nursery WHERE id = $2
            ))
            WHERE tree_desc_id = $3
            RETURNING *
          `;
          await db.query(updateTreeDescQuery, [quantity, id, tree_desc_id]);
        }

        await db.query('COMMIT');
        res.json(result.rows[0]);
      } catch (error) {
        await db.query('ROLLBACK');
        throw error;
      }
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
        const { tree_desc_id, village_id, registration_date } = req.query;

        // Base query with JOINs to get related information
        let query = `
            SELECT 
                tn.*,
                td.scientific_name,
                td.kinyarwanda,
                td.family,
                td.quantity_nursery as total_nursery_quantity,
                tm.health_status,
                tm.monitoring_date,
                tm.quantity as monitored_quantity
            FROM trees_nursery tn
            LEFT JOIN tree_description td ON tn.tree_desc_id = td.tree_desc_id
            LEFT JOIN tree_monitoring tm ON tn.tree_desc_id = tm.tree_desc_id 
                AND tm.source = 1
            WHERE 1=1
        `;
        let queryParams = [];
        let paramCount = 1;

        // Add filters if specific query parameters are provided
        if (tree_desc_id) {
            query += ` AND tn.tree_desc_id = $${paramCount}`;
            queryParams.push(tree_desc_id);
            paramCount++;
        }

        if (village_id) {
            query += ` AND tn.village_id = $${paramCount}`;
            queryParams.push(village_id);
            paramCount++;
        }

        if (registration_date) {
            query += ` AND tn.registration_date = $${paramCount}`;
            queryParams.push(registration_date);
            paramCount++;
        }

        // Add ordering by registration_date only
        query += ' ORDER BY tn.registration_date DESC';

        // Execute the query
        const result = await db.query(query, queryParams);

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                message: 'No records found',
                filters: {
                    tree_desc_id,
                    village_id,
                    registration_date
                }
            });
        }

        // Group the results by nursery record to handle multiple monitoring entries
        const groupedResults = result.rows.reduce((acc, row) => {
            const key = `${row.tree_desc_id}-${row.registration_date}`;
            if (!acc[key]) {
                acc[key] = {
                    ...row,
                    monitoring_history: []
                };
            }
            if (row.monitoring_date) {
                acc[key].monitoring_history.push({
                    health_status: row.health_status,
                    monitoring_date: row.monitoring_date,
                    quantity: row.monitored_quantity
                });
            }
            return acc;
        }, {});

        res.status(200).json({
            message: 'Records retrieved successfully',
            count: Object.keys(groupedResults).length,
            data: Object.values(groupedResults)
        });

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
      const { tree_desc_id } = req.params;
      
      console.log('Fetching tree nursery record with tree_desc_id:', tree_desc_id);
  
      const query = `
        SELECT 
          tn.*,
          td.scientific_name,
          td.kinyarwanda,
          td.family,
          td.quantity_nursery as total_nursery_quantity,
          tm.health_status,
          tm.monitoring_date,
          tm.quantity as monitored_quantity
        FROM trees_nursery tn
        LEFT JOIN tree_description td ON tn.tree_desc_id = td.tree_desc_id
        LEFT JOIN tree_monitoring tm ON tn.tree_desc_id = tm.tree_desc_id 
          AND tm.source = 1
        WHERE tn.tree_desc_id = $1
        LIMIT 1
      `;
  
      const result = await db.query(query, [tree_desc_id]);
      console.log('Query result:', result.rows);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ 
          message: 'Tree nursery record not found',
          tree_desc_id: tree_desc_id,
          details: 'No record found with the provided tree_desc_id'
        });
      }

      // Get monitoring history for this nursery
      const monitoringQuery = `
        SELECT 
          health_status,
          monitoring_date,
          quantity,
          notes
        FROM tree_monitoring
        WHERE tree_desc_id = $1
        ORDER BY monitoring_date DESC
      `;

      const monitoringResult = await db.query(monitoringQuery, [tree_desc_id]);
      console.log('Monitoring history:', monitoringResult.rows);

      // Combine the results
      const response = {
        ...result.rows[0],
        monitoring_history: monitoringResult.rows
      };
  
      res.status(200).json({
        message: 'Tree nursery record retrieved successfully',
        data: response
      });
    } catch (error) {
      console.error('Error fetching record:', error);
      res.status(500).json({
        error: 'Failed to fetch tree nursery record',
        details: error.message,
        tree_desc_id: req.params.tree_desc_id
      });
    }
  },
  delete: async (req, res) => {
    try {
      const { tree_desc_id } = req.params;
  
      console.log('Deleting record with tree_desc_id:', tree_desc_id);
  
      // Start a transaction
      await db.query('BEGIN');
  
      try {
        // First, get the record to be deleted to update tree_description
        const getRecordQuery = `
          SELECT quantity_added 
          FROM trees_nursery 
          WHERE tree_desc_id = $1
        `;
        const recordResult = await db.query(getRecordQuery, [tree_desc_id]);
  
        if (recordResult.rows.length === 0) {
          await db.query('ROLLBACK');
          return res.status(404).json({ 
            error: 'Tree nursery record not found',
            tree_desc_id: tree_desc_id
          });
        }
  
        const { quantity_added } = recordResult.rows[0];
  
        // Delete the tree nursery record
        const deleteQuery = `
          DELETE FROM trees_nursery
          WHERE tree_desc_id = $1
          RETURNING *
        `;
  
        const deleteResult = await db.query(deleteQuery, [tree_desc_id]);
  
        // Update tree_description quantity_nursery
        const updateTreeDescQuery = `
          UPDATE tree_description 
          SET quantity_nursery = quantity_nursery - $1
          WHERE tree_desc_id = $2
          RETURNING *
        `;
  
        await db.query(updateTreeDescQuery, [quantity_added, tree_desc_id]);
  
        // Delete related monitoring records
        const deleteMonitoringQuery = `
          DELETE FROM tree_monitoring
          WHERE tree_desc_id = $1 AND source = 1
        `;
  
        await db.query(deleteMonitoringQuery, [tree_desc_id]);
  
        // Commit the transaction
        await db.query('COMMIT');
  
        res.json({ 
          message: 'Tree nursery record and related data deleted successfully',
          deletedRecord: deleteResult.rows[0]
        });
  
      } catch (error) {
        // Rollback the transaction in case of error
        await db.query('ROLLBACK');
        throw error;
      }
  
    } catch (error) {
      console.error('Delete error:', error);
      res.status(500).json({
        error: 'Failed to delete tree nursery record',
        details: error.message,
        tree_desc_id: req.params.tree_desc_id
      });
    }
  }  
  
};

module.exports = treeNurseryController; 