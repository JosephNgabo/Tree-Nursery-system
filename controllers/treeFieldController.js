const db = require("../config/db");

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
        notes,
      } = req.body;

      console.log("Received data:", req.body); // Debug log

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
        notes,
      ];

      console.log("Query values:", values); // Debug log

      const result = await db.query(query, values);
      console.log("Query result:", result.rows[0]); // Debug log

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Detailed error:", error); // More detailed error logging
      res.status(500).json({
        error: "Failed to register tree nursery",
        details: error.message,
        code: error.code,
      });
    }
  },
  // Update tree field record
  update: async (req, res) => {
    try {
      const { id } = req.params; // Get tree field ID from URL parameter
      const {
        tree_desc_id,
        growing_method_id,
        stage_id_field,
        date_planted,
        quantity,
        propagation_method,
        village_id,
        registered_by,
        notes,
      } = req.body;

      // Validate required fields
      if (
        !tree_desc_id ||
        !growing_method_id ||
        !stage_id_field ||
        !date_planted ||
        !quantity ||
        !propagation_method ||
        !village_id ||
        !registered_by
      ) {
        return res.status(400).json({
          error: "Missing required fields",
          details: "Ensure all required fields are provided",
        });
      }

      console.log("Updating record:", id, req.body); // Debug log

      // Update tree field query
      const query = `
      UPDATE trees_field 
      SET 
        tree_desc_id = $1,
        growing_method_id = $2,
        stage_id_field = $3,
        date_planted = $4,
        quantity = $5,
        propagation_method = $6,
        village_id = $7,
        registered_by = $8,
        notes = $9,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
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
        notes || null, // Set notes to null if not provided
        id,
      ];

      const result = await db.query(query, values);

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: "Tree field record not found",
          details: `No tree field found with ID ${id}`,
        });
      }

      res.json({
        message: "Tree field updated successfully",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({
        error: "Failed to update tree field record",
        details: error.message,
      });
    }
  },
  // Get single tree field
  viewSingle: async (req, res) => {
    try {
      const { tree_desc_id } = req.params;

      const query = `
      SELECT * FROM trees_field
      WHERE tree_desc_id = $1
      LIMIT 1
    `;

      const result = await db.query(query, [tree_desc_id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Tree field record not found" });
      }

      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error("Error fetching tree field record:", error);
      res.status(500).json({
        error: "Failed to fetch tree field record",
        details: error.message,
      });
    }
  },

  viewAll: async (req, res) => {
    try {
      const { tree_desc_id, village_id, date_planted } = req.query;
      let query = "SELECT * FROM trees_field";
      let conditions = [];
      let values = [];

      if (tree_desc_id) {
        conditions.push(`tree_desc_id = $${values.length + 1}`);
        values.push(tree_desc_id);
      }

      if (village_id) {
        conditions.push(`village_id = $${values.length + 1}`);
        values.push(village_id);
      }

      if (date_planted) {
        conditions.push(`date_planted = $${values.length + 1}`);
        values.push(date_planted);
      }

      if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
      }

      query += " ORDER BY created_at DESC";

      const result = await db.query(query, values);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "No tree field records found" });
      }

      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error fetching tree field records:", error);
      res.status(500).json({
        error: "Failed to fetch tree field records",
        details: error.message,
      });
    }
  },
  delete: async (req, res) => {
    try {
      const { tree_desc_id } = req.params;

      const result = await db.query(
        "DELETE FROM trees_field WHERE tree_desc_id = $1 RETURNING *",
        [tree_desc_id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Tree field record not found" });
      }

      res.status(200).json({
        message: "Tree field record deleted successfully",
        deletedRecord: result.rows[0],
      });
    } catch (error) {
      console.error("Error deleting tree field record:", error);
      res.status(500).json({
        error: "Failed to delete tree field record",
        details: error.message,
      });
    }
  },
};

module.exports = treeFieldController;
