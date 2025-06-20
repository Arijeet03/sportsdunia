const express = require('express');
const router = express.Router();
const referralController = require('../controllers/referralController');
const { authenticateToken } = require('../middleware/auth');
const { validate, referralSchema } = require('../utils/validation');


router.post('/join', authenticateToken, validate(referralSchema), referralController.joinWithReferralCode);

router.get('/tree', authenticateToken, referralController.getReferralTree);

router.get('/stats', authenticateToken, referralController.getReferralStats);

module.exports = router; 