const express = require('express');
const router = express.Router();
const treeGrowingMethodsController = require('../controllers/treeGrowingMethodController');
const auth = require('../middleware/auth');

// CRUD routes
/**
 * @swagger
 * /tree-growing-methods:
 *   post:
 *     summary: Add a new tree growing method
 *     tags: [TreeGrowingMethods]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - method_name
 *               - description
 *             properties:
 *               method_name:
 *                 type: string
 *                 example: Air Layering
 *               description:
 *                 type: string
 *                 example: A propagation technique where part of a plant stem is wrapped and allowed to root while still attached to the parent.
 *     responses:
 *       201:
 *         description: Method created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TreeGrowingMethod'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */

router.post('/', auth, treeGrowingMethodsController.register);

/**
 * @swagger
 * /tree-growing-methods:
 *   get:
 *     summary: Get all tree growing methods
 *     tags: [TreeGrowingMethods]
 *     responses:
 *       200:
 *         description: A list of tree growing methods
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TreeGrowingMethod'
 *       500:
 *         description: Server error
 */

router.get('/', auth, treeGrowingMethodsController.viewAll);
/**
 * @swagger
 * /tree-growing-methods/{method_id}:
 *   get:
 *     summary: Get a single tree growing method by ID
 *     tags: [TreeGrowingMethods]
 *     parameters:
 *       - in: path
 *         name: method_id
 *         required: true
 *         description: Numeric ID of the method
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: The tree growing method
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TreeGrowingMethod'
 *       404:
 *         description: Method not found
 *       500:
 *         description: Server error
 */

router.get('/:method_id', auth, treeGrowingMethodsController.viewSingle);
/**
 * @swagger
 * /tree-growing-methods/{method_id}:
 *   put:
 *     summary: Update a tree growing method
 *     tags: [TreeGrowingMethods]
 *     parameters:
 *       - in: path
 *         name: method_id
 *         required: true
 *         description: ID of the method to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               method_name:
 *                 type: string
 *                 example: Grafting
 *               description:
 *                 type: string
 *                 example: Modified description for grafting
 *     responses:
 *       200:
 *         description: Method updated successfully
 *       404:
 *         description: Method not found
 *       500:
 *         description: Server error
 */

router.put('/:method_id', auth, treeGrowingMethodsController.update);
/**
 * @swagger
 * /tree-growing-methods/{method_id}:
 *   delete:
 *     summary: Delete a tree growing method
 *     tags: [TreeGrowingMethods]
 *     parameters:
 *       - in: path
 *         name: method_id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2
 *     responses:
 *       200:
 *         description: Method deleted successfully
 *       404:
 *         description: Method not found
 *       500:
 *         description: Server error
 */

router.delete('/:method_id', auth, treeGrowingMethodsController.delete);

module.exports = router;
