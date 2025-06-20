const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const { authenticateToken } = require('../middleware/auth');
const { validate, purchaseSchema } = require('../utils/validation');


router.post('/create', authenticateToken, validate(purchaseSchema), purchaseController.createPurchase);

router.get('/history', authenticateToken, purchaseController.getPurchaseHistory);

module.exports = router; 