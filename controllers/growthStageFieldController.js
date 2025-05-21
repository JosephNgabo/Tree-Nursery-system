const db = require('../config/db');

const growthStageFieldController = {
  // Create new stage
  create: async (req, res) => {
    try {
      const { stage_name, description, additional_info } = req.body;
      const query = `
        INSERT INTO growth_stage_identification_field (stage_name, description, additional_info)
        VALUES ($1, $2, $3)
        RETURNING *`;
      const result = await db.query(query, [stage_name, description, additional_info]);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Error creating growth stage:", error);
      res.status(500).json({ error: "Failed to create growth stage" });
    }
  },

  // Get all stages
  getAll: async (req, res) => {
    try {
      const result = await db.query('SELECT * FROM growth_stage_identification_field ORDER BY tag_id');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error fetching growth stages:", error);
      res.status(500).json({ error: "Failed to fetch growth stages" });
    }
  },

  // Get a single stage by ID
  getById: async (req, res) => {
    try {
      const { tag_id } = req.params;
      const result = await db.query('SELECT * FROM growth_stage_identification_field WHERE tag_id = $1', [tag_id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Growth stage not found' });
      }
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error("Error fetching stage:", error);
      res.status(500).json({ error: "Failed to fetch growth stage" });
    }
  },

  // Update a stage
  update: async (req, res) => {
    try {
      const { tag_id } = req.params;
      const { stage_name, description, additional_info } = req.body;
      const result = await db.query(
        `UPDATE growth_stage_identification_field
         SET stage_name = $1, description = $2, additional_info = $3
         WHERE tag_id = $4
         RETURNING *`,
        [stage_name, description, additional_info, tag_id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Stage not found' });
      }
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error("Error updating stage:", error);
      res.status(500).json({ error: "Failed to update growth stage" });
    }
  },

  // Delete a stage
  delete: async (req, res) => {
    try {
      const { tag_id } = req.params;
      const result = await db.query('DELETE FROM growth_stage_identification_field WHERE tag_id = $1 RETURNING *', [tag_id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Stage not found' });
      }
      res.status(200).json({ message: 'Stage deleted successfully' });
    } catch (error) {
      console.error("Error deleting stage:", error);
      res.status(500).json({ error: "Failed to delete growth stage" });
    }
  },
};

module.exports = growthStageFieldController;
