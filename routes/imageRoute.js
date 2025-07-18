const express = require('express');
const { image } = require('../controller/imageController');
const { auth } = require('../middleware/authMiddleware');
const router = express.Router();

// POST /api/v1/image/generate-image
router.post('/generate-image', auth, image);

module.exports = router; 