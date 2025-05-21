const express = require('express');
const router = express.Router();
const locationsController = require('../controllers/locationsController');

/**
 * @swagger
 * /locations:
 *   get:
 *     summary: Get all locations with pagination, filtering, and search
 *     tags: [Locations]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of results per page
 *       - in: query
 *         name: province
 *         schema:
 *           type: string
 *         description: Filter by province
 *       - in: query
 *         name: district
 *         schema:
 *           type: string
 *         description: Filter by district
 *       - in: query
 *         name: sector
 *         schema:
 *           type: string
 *         description: Filter by sector
 *       - in: query
 *         name: cell
 *         schema:
 *           type: string
 *         description: Filter by cell
 *       - in: query
 *         name: village
 *         schema:
 *           type: string
 *         description: Filter by village
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search keyword
 *     responses:
 *       200:
 *         description: List of locations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalItems:
 *                   type: integer
 *                 locations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       village_code:
 *                         type: string
 *                         example: OL01000697
 *                       vilage:
 *                         type: string
 *                         example: Abatarushwa
 *                       cell:
 *                         type: string
 *                         example: Rwezamenyo I
 *                       sector:
 *                         type: string
 *                         example: Rwezamenyo
 *                       district:
 *                         type: string
 *                         example: Nyarugenge
 *                       province:
 *                         type: string
 *                         example: Umujyi wa Kigali
 */
router.get('/', locationsController.getAllLocations);

module.exports = router;
