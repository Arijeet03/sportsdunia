const express = require('express');
const router = express.Router();
const earningsController = require('../controllers/earningsController');
const { authenticateToken } = require('../middleware/auth');
const { validateQuery, earningsQuerySchema } = require('../utils/validation');


router.get('/summary', authenticateToken, earningsController.getSummary);

router.get('/history', authenticateToken, validateQuery(earningsQuerySchema), earningsController.getHistory);

router.get('/realtime', authenticateToken, earningsController.getRealtime);

module.exports = router; 