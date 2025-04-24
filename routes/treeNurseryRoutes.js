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

// Get single tree nursery
router.get('/:tree_desc_id', auth, treeNurseryController.viewSingle);

// Update tree nursery
router.put('/:tree_desc_id', auth, treeNurseryController.update);

// Delete tree nursery
router.delete('/:tree_desc_id', auth, treeNurseryController.delete);

module.exports = router; 