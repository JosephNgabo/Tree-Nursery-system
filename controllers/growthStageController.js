const db = require('../config/db');

// Create
const create = async (req, res) => {
  const { stage_name, description } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO growth_stage_identification_nursery (stage_name, description)
       VALUES ($1, $2) RETURNING *`,
      [stage_name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating growth stage:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all
const getAll = async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM growth_stage_identification_nursery ORDER BY tag_id`);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching growth stages:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get by ID
const getById = async (req, res) => {
  const { tag_id } = req.params;
  try {
    const result = await db.query(`SELECT * FROM growth_stage_identification_nursery WHERE tag_id = $1`, [tag_id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching growth stage:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update
const update = async (req, res) => {
  const { tag_id } = req.params;
  const { stage_name, description } = req.body;
  try {
    const result = await db.query(
      `UPDATE growth_stage_identification_nursery
       SET stage_name = $1, description = $2
       WHERE tag_id = $3 RETURNING *`,
      [stage_name, description, tag_id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error updating growth stage:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete
const remove = async (req, res) => {
  const { tag_id } = req.params;
  try {
    const result = await db.query(`DELETE FROM growth_stage_identification_nursery WHERE tag_id = $1 RETURNING *`, [tag_id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Error deleting growth stage:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { create, getAll, getById, update, remove };
