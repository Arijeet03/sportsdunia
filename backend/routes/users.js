const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');
const { validate, userUpdateSchema } = require('../utils/validation');


router.get('/profile', authenticateToken, userController.getProfile);

router.put('/profile', authenticateToken, validate(userUpdateSchema), userController.updateProfile);

router.get('/referrals', authenticateToken, userController.getReferralTree);

module.exports = router; 