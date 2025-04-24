const express = require('express');
const router = express.Router();
const treeFieldController = require('../controllers/treeFieldController');
const auth = require('../middleware/auth'); 

// Register tree field
router.post('/register', auth, treeFieldController.register);



module.exports = router;
