const EarningsService = require('../services/earningsService');

exports.getSummary = async (req, res) => {
  try {
    const summary = await EarningsService.getSummary(req.user._id);
    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const filters = {
      level: req.query.level,
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };
    const history = await EarningsService.getHistory(req.user._id, filters);
    res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getRealtime = async (req, res) => {
  
  res.status(501).json({ message: 'Not implemented' });
}; 