const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');
const { authenticateToken } = require('../middleware/auth');


router.use(authenticateToken);


router.get('/earnings-summary', reportsController.getEarningsSummary);


router.get('/referral-analytics', reportsController.getReferralAnalytics);


router.get('/level-breakdown', reportsController.getLevelBreakdown);


router.get('/earning-sources', reportsController.getEarningSources);


router.get('/monthly-trend', reportsController.getMonthlyTrend);

module.exports = router; 