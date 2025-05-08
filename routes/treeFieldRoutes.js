const express = require('express');
const router = express.Router();
const treeFieldController = require('../controllers/treeFieldController');
const auth = require('../middleware/auth'); 

/**
 * @swagger
 * /tree-field/register:
 *   post:
 *     summary: Register a new tree field entry
 *     tags: [TreeField]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tree_desc_id
 *               - growing_method_id
 *               - stage_id_field
 *               - date_planted
 *               - quantity
 *               - propagation_method
 *               - village_id
 *               - registered_by
 *             properties:
 *               tree_desc_id:
 *                 type: integer
 *                 example: 1
 *               growing_method_id:
 *                 type: integer
 *                 example: 2
 *               stage_id_field:
 *                 type: integer
 *                 example: 3
 *               date_planted:
 *                 type: string
 *                 format: date
 *                 example: "2024-04-15"
 *               quantity:
 *                 type: integer
 *                 example: 100
 *               propagation_method:
 *                 type: string
 *                 example: "seeds"
 *               village_id:
 *                 type: integer
 *                 example: 5
 *               registered_by:
 *                 type: integer
 *                 example: 7
 *               notes:
 *                 type: string
 *                 example: "This is a new field test batch"
 *     responses:
 *       201:
 *         description: Tree field registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tree_field_id:
 *                   type: integer
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request (e.g. missing fields)
 *       500:
 *         description: Server error
 */

// Register tree field
router.post('/register', auth, treeFieldController.register);



module.exports = router;
