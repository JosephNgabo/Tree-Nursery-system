const express = require('express');
const router = express.Router();
const treeController = require('../controllers/treeController');
const authenticateToken = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');

router.post('/',
  authenticateToken,
  checkRole(['Admin', 'Nursery Staff', 'Field Agent', 'Researcher']),
  treeController.registerTree
);

module.exports = router; 