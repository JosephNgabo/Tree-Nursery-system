const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *               - tree_desc_id
 *             properties:
 *               name:
 *                 type: string
 *                 example: Testing samples
 *               email:
 *                 type: string
 *                 example: sample@gmail.com
 *               password:
 *                 type: string
 *                 example: SecurePass123!
 *               role:
 *                 type: string
 *                 example: admin
 *               tree_desc_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */



/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     description: This endpoint is used for user authentication. It accepts an email and password, and returns a JWT token if the credentials are valid.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *     responses:
 *       200:
 *         description: Login successful, returns a JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: A success message.
 *                 token:
 *                   type: string
 *                   description: The JWT token for the logged-in user.
 *       400:
 *         description: Invalid credentials (either email or password is incorrect).
 *       500:
 *         description: Server error.
 */

// Make sure the controller methods are properly referenced
router.post('/register', userController.register);
router.post('/login', userController.login);

module.exports = router; 