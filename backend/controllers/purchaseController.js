const PurchaseService = require('../services/purchaseService');

exports.createPurchase = async (req, res) => {
  try {
    const result = await PurchaseService.createPurchase(req.user._id, req.body);
    res.status(201).json({
      success: true,
      message: 'Purchase created successfully',
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getPurchaseHistory = async (req, res) => {
  try {
    const purchases = await PurchaseService.getPurchaseHistory(req.user._id);
    res.status(200).json({
      success: true,
      data: purchases
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}; 