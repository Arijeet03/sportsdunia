const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { validate, userRegistrationSchema, userLoginSchema } = require('../utils/validation');


router.post('/register', validate(userRegistrationSchema), authController.register);

router.post('/login', validate(userLoginSchema), authController.login);

router.get('/profile', authenticateToken, authController.getProfile);

module.exports = router; 