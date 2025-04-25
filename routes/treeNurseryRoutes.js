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
 *     tags: [TreeNursery]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tree nurseries
 *       500:
 *         description: Server error
 */
// Get all trees nursery
router.get('/', auth, treeNurseryController.view);

/**
 * @swagger
 * /tree-nursery/{tree_desc_id}:
 *   get:
 *     summary: Get a single tree nursery by ID
 *     tags: [TreeNursery]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tree_desc_id
 *         required: true
 *         description: ID of the tree nursery to retrieve
 *         schema:
 *           type: integer
 *           example: 2
 *     responses:
 *       200:
 *         description: The tree nursery details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tree_desc_id:
 *                   type: integer
 *                   example: 2
 *                 growing_method_id:
 *                   type: integer
 *                   example: 1
 *                 stage_id_nursery:
 *                   type: integer
 *                   example: 1
 *                 date_planted:
 *                   type: string
 *                   format: date
 *                   example: "2024-04-16"
 *                 quantity:
 *                   type: string
 *                   example: "350.00"
 *                 registration_date:
 *                   type: string
 *                   format: date
 *                   example: "2025-04-16"
 *                 propagation_method:
 *                   type: string
 *                   example: "Testing updating"
 *                 village_id:
 *                   type: string
 *                   example: "1"
 *                 registered_by:
 *                   type: integer
 *                   example: 5
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-16T17:25:37.085Z"
 *                 notes:
 *                   type: string
 *                   example: "Now updated"
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-16T17:39:06.524Z"
 *       404:
 *         description: Tree nursery not found
 *       500:
 *         description: Server error
 */
// Get single tree nursery
router.get('/:tree_desc_id', auth, treeNurseryController.viewSingle);


/**
 * @swagger
 * /tree-nursery/{tree_desc_id}:
 *   put:
 *     summary: Update a tree nursery by ID
 *     tags: [TreeNursery]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tree_desc_id
 *         required: true
 *         description: ID of the tree nursery to update
 *         schema:
 *           type: integer
 *           example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tree_desc_id:
 *                 type: integer
 *                 description: The ID of the tree description
 *                 example: 2
 *               growing_method_id:
 *                 type: integer
 *                 description: The ID of the growing method
 *                 example: 1
 *               stage_id_nursery:
 *                 type: integer
 *                 description: The stage ID of the nursery
 *                 example: 1
 *               date_planted:
 *                 type: string
 *                 format: date
 *                 description: The planting date of the tree nursery
 *                 example: "2024-04-16"
 *               quantity:
 *                 type: string
 *                 description: The quantity of trees in the nursery
 *                 example: "350.00"
 *               propagation_method:
 *                 type: string
 *                 description: The method used for propagation
 *                 example: "Cuttings"
 *               village_id:
 *                 type: string
 *                 description: The ID of the village where the nursery is located
 *                 example: "1"
 *               notes:
 *                 type: string
 *                 description: Any additional notes about the nursery
 *                 example: "Updated propagation method"
 *     responses:
 *       200:
 *         description: The tree nursery was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tree_desc_id:
 *                   type: integer
 *                   example: 2
 *                 growing_method_id:
 *                   type: integer
 *                   example: 1
 *                 stage_id_nursery:
 *                   type: integer
 *                   example: 1
 *                 date_planted:
 *                   type: string
 *                   format: date
 *                   example: "2024-04-16"
 *                 quantity:
 *                   type: string
 *                   example: "350.00"
 *                 propagation_method:
 *                   type: string
 *                   example: "Cuttings"
 *                 village_id:
 *                   type: string
 *                   example: "1"
 *                 registered_by:
 *                   type: integer
 *                   example: 5
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-04-16T17:25:37.085Z"
 *                 notes:
 *                   type: string
 *                   example: "Updated propagation method"
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-16T17:39:06.524Z"
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Tree nursery not found
 *       500:
 *         description: Server error
 */

// Update tree nursery
router.put('/:tree_desc_id', auth, treeNurseryController.update);

/**
 * @swagger
 * /tree-nursery/{tree_desc_id}:
 *   delete:
 *     summary: Delete a tree nursery record
 *     tags: [Tree Nursery]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tree_desc_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the tree nursery to delete
 *     responses:
 *       200:
 *         description: Tree nursery record deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tree nursery deleted successfully
 *       404:
 *         description: Tree nursery record not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Tree nursery record not found
 *       401:
 *         description: Unauthorized – missing or invalid token
 *       500:
 *         description: Internal server error
 */

// Delete tree nursery
router.delete('/:tree_desc_id', auth, treeNurseryController.delete);

module.exports = router; 