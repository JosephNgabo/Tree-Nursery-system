// controllers/locationsController.js
const db = require('../config/db');
const NodeCache = require("node-cache");
const locationCache = new NodeCache({ stdTTL: 300 }); // Cache for 5 minutes

const getAllLocations = async (req, res) => {
  try {
    const { province, district, sector, cell, village, q, page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const cacheKey = JSON.stringify({ province, district, sector, cell, village, q, page, limit });
    const cachedData = locationCache.get(cacheKey);
    if (cachedData) return res.json(cachedData);

    let filters = [];
    let values = [];
    let index = 1;

    if (province) {
      filters.push(`province ILIKE $${index++}`);
      values.push(`%${province}%`);
    }
    if (district) {
      filters.push(`district ILIKE $${index++}`);
      values.push(`%${district}%`);
    }
    if (sector) {
      filters.push(`sector ILIKE $${index++}`);
      values.push(`%${sector}%`);
    }
    if (cell) {
      filters.push(`cell ILIKE $${index++}`);
      values.push(`%${cell}%`);
    }
    if (village) {
      filters.push(`vilage ILIKE $${index++}`);
      values.push(`%${village}%`);
    }
    if (q) {
      filters.push(`(
        vilage ILIKE $${index} OR
        cell ILIKE $${index} OR
        sector ILIKE $${index} OR
        district ILIKE $${index} OR
        province ILIKE $${index}
      )`);
      values.push(`%${q}%`);
      index++;
    }

    const filterQuery = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const query = `
      SELECT * FROM locations
      ${filterQuery}
      ORDER BY province, district, sector, cell, vilage
      LIMIT $${index} OFFSET $${index + 1}
    `;

    values.push(limit);
    values.push(offset);

    const result = await db.query(query, values);
    locationCache.set(cacheKey, result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ error: "Failed to fetch locations" });
  }
};

module.exports = {
  getAllLocations
};
