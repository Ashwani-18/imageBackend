const express = require('express');
const { signup, login } = require('../controller/authController');
const{credits} = require('../controller/TransactionController')
const {auth} = require('../middleware/authMiddleware')



const authRoute = express.Router();

// Routes
authRoute.post('/signup', signup);
authRoute.post('/login', login);
authRoute.get('/credits', auth, credits)

module.exports = authRoute; 
