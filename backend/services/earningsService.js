const Earning = require('../models/Earning');

class EarningsService {

  static async getHistory(userId, filters = {}) {
    const query = { userId };
    if (filters.level) query.level = filters.level;
    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
      if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
    }
    const earnings = await Earning.find(query)
      .sort({ createdAt: -1 })
      .populate({
        path: 'purchaseId',
        populate: { path: 'userId', select: 'name email' }
      });


    return earnings.map(e => ({
      ...e.toObject(),
      referralName: e.purchaseId && e.purchaseId.userId ? e.purchaseId.userId.name : '',
      referralEmail: e.purchaseId && e.purchaseId.userId ? e.purchaseId.userId.email : ''
    }));
  }

 
  static async getSummary(userId) {
    const earnings = await Earning.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$level',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);
    let total = 0;
    const breakdown = {};
    earnings.forEach(e => {
      total += e.total;
      breakdown[`level${e._id}`] = { total: e.total, count: e.count };
    });
    return { total, breakdown };
  }
}

module.exports = EarningsService; 