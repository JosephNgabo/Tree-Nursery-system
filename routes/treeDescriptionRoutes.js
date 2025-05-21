const express = require('express');
const router = express.Router();
const treeDescriptionController = require('../controllers/treeDescriptionController');
const auth = require('../middleware/auth');

// Get all tree descriptions
/**
 * @swagger
 * /tree-descriptions:
 *   get:
 *     summary: Get all tree descriptions
 *     tags: [TreeDescription]
 *     responses:
 *       200:
 *         description: List of tree descriptions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TreeDescription'
 *       500:
 *         description: Server error
 */

router.get('/', auth, treeDescriptionController.getAll);

// Get a single tree description by ID
/**
 * @swagger
 * /tree-descriptions/{tree_desc_id}:
 *   get:
 *     summary: Get a tree description by ID
 *     tags: [TreeDescription]
 *     parameters:
 *       - in: path
 *         name: tree_desc_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the tree description
 *     responses:
 *       200:
 *         description: Tree description found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TreeDescription'
 *       404:
 *         description: Tree description not found
 */

router.get('/:tree_desc_id', auth, treeDescriptionController.getOne);

// Create a new tree description
/**
 * @swagger
 * /tree-descriptions:
 *   post:
 *     summary: Add a new tree description
 *     tags: [TreeDescription]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TreeDescription'
 *     responses:
 *       201:
 *         description: Tree description created successfully
 *       500:
 *         description: Server error
 */

router.post('/', auth, treeDescriptionController.create);

// Update a tree description
/**
 * @swagger
 * /tree-descriptions/{tree_desc_id}:
 *   put:
 *     summary: Update a tree description by ID
 *     tags: [TreeDescription]
 *     parameters:
 *       - in: path
 *         name: tree_desc_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the tree description
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TreeDescription'
 *     responses:
 *       200:
 *         description: Tree description updated successfully
 *       404:
 *         description: Tree description not found
 *       500:
 *         description: Server error
 */

router.put('/:tree_desc_id', auth, treeDescriptionController.update);

// Delete a tree description
/**
 * @swagger
 * /tree-descriptions/{tree_desc_id}:
 *   delete:
 *     summary: Delete a tree description by ID
 *     tags: [TreeDescription]
 *     parameters:
 *       - in: path
 *         name: tree_desc_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the tree description
 *     responses:
 *       200:
 *         description: Tree description deleted successfully
 *       404:
 *         description: Tree description not found
 *       500:
 *         description: Server error
 */
router.delete('/:tree_desc_id', auth, treeDescriptionController.delete);



module.exports = router;
