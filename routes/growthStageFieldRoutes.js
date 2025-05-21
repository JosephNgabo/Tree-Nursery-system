const express = require('express');
const router = express.Router();
const growthStageFieldController = require('../controllers/growthStageFieldController');

/**
 * @swagger
 * /growth-stage-field:
 *   post:
 *     summary: Create a new growth stage field
 *     tags: [GrowthStageField]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GrowthStageField'
 *     responses:
 *       201:
 *         description: Growth stage field created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GrowthStageField'

 *   get:
 *     summary: Get all growth stage fields
 *     tags: [GrowthStageField]
 *     responses:
 *       200:
 *         description: List of growth stage fields
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GrowthStageField'

 * /growth-stage-field/{tag_id}:
 *   get:
 *     summary: Get a single growth stage field by ID
 *     tags: [GrowthStageField]
 *     parameters:
 *       - in: path
 *         name: tag_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the growth stage field
 *     responses:
 *       200:
 *         description: A single growth stage field
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GrowthStageField'
 *       404:
 *         description: Stage not found

 *   put:
 *     summary: Update a growth stage field
 *     tags: [GrowthStageField]
 *     parameters:
 *       - in: path
 *         name: tag_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the growth stage field to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GrowthStageField'
 *     responses:
 *       200:
 *         description: Growth stage field updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GrowthStageField'
 *       404:
 *         description: Stage not found

 *   delete:
 *     summary: Delete a growth stage field
 *     tags: [GrowthStageField]
 *     parameters:
 *       - in: path
 *         name: tag_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the growth stage field to delete
 *     responses:
 *       200:
 *         description: Stage deleted successfully
 *       404:
 *         description: Stage not found
 */

router.post('/', growthStageFieldController.create);
router.get('/', growthStageFieldController.getAll);
router.get('/:tag_id', growthStageFieldController.getById);
router.put('/:tag_id', growthStageFieldController.update);
router.delete('/:tag_id', growthStageFieldController.delete);



module.exports = router;
