const express = require('express');
const imageRoute = express.Router();
const {image} = require('../controller/imageController');
const {auth} = require('../middleware/authMiddleware')

// POST /api/image
imageRoute.post('/generate-image', auth,image );

module.exports = imageRoute; 