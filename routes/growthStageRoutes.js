const express = require('express');
const router = express.Router();
const controller = require('../controllers/growthStageController');
const auth = require('../middleware/auth');

// Routes
/**
 * @swagger
 * /growth-stage:
 *   post:
 *     summary: Create a new growth stage
 *     tags: [GrowthStage]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - stage_name
 *               - description
 *             properties:
 *               stage_name:
 *                 type: string
 *                 example: Young Tree
 *               description:
 *                 type: string
 *                 example: Trees that are past sapling stage but not yet mature.
 *     responses:
 *       201:
 *         description: Growth stage created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GrowthStage'
 */

router.post('/', auth, controller.create);
/**
 * @swagger
 * /growth-stage:
 *   get:
 *     summary: Get all growth stages
 *     tags: [GrowthStage]
 *     responses:
 *       200:
 *         description: A list of growth stages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GrowthStage'
 */

router.get('/', auth, controller.getAll);
/**
 * @swagger
 * /growth-stage/{id}:
 *   get:
 *     summary: Get a single growth stage by ID
 *     tags: [GrowthStage]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The tag_id of the growth stage
 *     responses:
 *       200:
 *         description: Growth stage found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GrowthStage'
 *       404:
 *         description: Growth stage not found
 */

router.get('/:tag_id', auth, controller.getById);
/**
 * @swagger
 * /growth-stage/{id}:
 *   put:
 *     summary: Update an existing growth stage
 *     tags: [GrowthStage]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The tag_id of the growth stage
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stage_name:
 *                 type: string
 *                 example: Updated Name
 *               description:
 *                 type: string
 *                 example: Updated description for the stage.
 *     responses:
 *       200:
 *         description: Growth stage updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GrowthStage'
 *       404:
 *         description: Growth stage not found
 */

router.put('/:tag_id', auth, controller.update);
/**
 * @swagger
 * /growth-stage/{id}:
 *   delete:
 *     summary: Delete a growth stage by ID
 *     tags: [GrowthStage]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The tag_id of the growth stage
 *     responses:
 *       200:
 *         description: Growth stage deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Deleted successfully
 *       404:
 *         description: Growth stage not found
 */

router.delete('/:tag_id', auth, controller.remove);

module.exports = router;