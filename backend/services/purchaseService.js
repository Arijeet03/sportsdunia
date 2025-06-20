const Purchase = require('../models/Purchase');
const User = require('../models/User');
const Referral = require('../models/Referral');
const Earning = require('../models/Earning');
const { emitEarningNotification } = require('../socket/socketHandler');
const { getIo } = require('../socket/ioInstance');

class PurchaseService {

  static async createPurchase(userId, purchaseData) {
    const { amount, description, category } = purchaseData;
    const minAmount = parseFloat(process.env.MIN_PURCHASE_AMOUNT) || 1000;
    const isValidForReferral = amount >= minAmount;
    let earnings = [];

    const purchase = new Purchase({
      userId,
      amount,
      description,
      category,
      isValidForReferral,
      status: 'completed'
    });
    await purchase.save();

    if (isValidForReferral) {
     
      const user = await User.findById(userId);
      
      const referralName = user ? user.name : 'Unknown';
      const referralEmail = user ? user.email : '';
      if (user && user.referredBy) {
        const level1User = await User.findById(user.referredBy);
        if (level1User && level1User.isActive) {
          const level1Commission = amount * ((parseFloat(process.env.LEVEL1_COMMISSION_PERCENTAGE) || 5) / 100);

       
          const earning1 = new Earning({
            userId: level1User._id,
            amount: level1Commission,
            source: 'direct',
            level: 1,
            purchaseId: purchase._id,
            status: 'pending'
          });
          await earning1.save();

          level1User.totalEarnings += level1Commission;
          await level1User.save();

          const io = getIo();
          emitEarningNotification(io, level1User._id, {
            amount: level1Commission,
            level: 1,
            fromUser: userId,
            referralName,
            referralEmail,
            purchaseId: purchase._id,
            timestamp: new Date()
          });

          earnings.push({
            user: level1User,
            amount: level1Commission,
            level: 1
          });

          if (level1User.referredBy) {
            const level2User = await User.findById(level1User.referredBy);
            if (level2User && level2User.isActive) {
              const level2Commission = amount * ((parseFloat(process.env.LEVEL2_COMMISSION_PERCENTAGE) || 1) / 100);

              const earning2 = new Earning({
                userId: level2User._id,
                amount: level2Commission,
                source: 'indirect',
                level: 2,
                purchaseId: purchase._id,
                status: 'pending'
              });
              await earning2.save();

          
              level2User.totalEarnings += level2Commission;
              await level2User.save();

              emitEarningNotification(io, level2User._id, {
                amount: level2Commission,
                level: 2,
                fromUser: userId,
                referralName,
                referralEmail,
                purchaseId: purchase._id,
                timestamp: new Date()
              });

              earnings.push({
                user: level2User,
                amount: level2Commission,
                level: 2
              });
            }
          }
        }
      }
    }

    return {
      purchase,
      earnings
    };
  }

  static async getPurchaseHistory(userId) {
    try {
      return await Purchase.find({ userId }).sort({ createdAt: -1 });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PurchaseService; 