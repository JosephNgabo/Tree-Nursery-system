const express = require('express');
const router = express.Router();
const treeNurseryController = require('../controllers/treeNurseryController');
const auth = require('../middleware/auth'); // We'll create this next

// Protected route - requires authentication
router.post('/register', auth, treeNurseryController.register);

/**
 * @swagger
 * /tree-nursery:
 *   get:
 *     summary: Get all tree nurseries
 *     tags:
 *       - Tree Nursery
 *     responses:
 *       200:
 *         description: A list of tree nurseries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   tree_desc_id:
 *                     type: integer
 *                     example: 2
 *                   growing_method_id:
 *                     type: integer
 *                     example: 1
 *                   stage_id_nursery:
 *                     type: integer
 *                     example: 1
 *                   date_planted:
 *                     type: string
 *                     format: date
 *                     example: 2024-04-16
 *                   quantity:
 *                     type: string
 *                     example: "350.00"
 *                   registration_date:
 *                     type: string
 *                     format: date
 *                     example: 2025-04-16
 *                   propagation_method:
 *                     type: string
 *                     example: Testing updating
 *                   village_id:
 *                     type: string
 *                     example: "1"
 *                   registered_by:
 *                     type: integer
 *                     example: 5
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-04-16T17:25:37.085Z
 *                   notes:
 *                     type: string
 *                     example: Now updated
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                     example: 2025-04-16T17:39:06.524Z
 *       500:
 *         description: Server error
 */

// Get all trees nursery
router.get('/', auth, treeNurseryController.view);

// Get single tree nursery
router.get('/:tree_desc_id', auth, treeNurseryController.viewSingle);

// Update tree nursery
router.put('/:tree_desc_id', auth, treeNurseryController.update);

// Delete tree nursery
router.delete('/:tree_desc_id', auth, treeNurseryController.delete);

module.exports = router; 