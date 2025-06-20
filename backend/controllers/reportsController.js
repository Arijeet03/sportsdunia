const User = require('../models/User');
const Earning = require('../models/Earning');
const Purchase = require('../models/Purchase');
const Referral = require('../models/Referral');


exports.getEarningsSummary = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log('Getting earnings summary for user:', userId);
    
    
    const earnings = await Earning.find({ userId: userId });
    console.log('Found earnings:', earnings.length);
    
   
    const totalEarnings = earnings.reduce((sum, earning) => sum + earning.amount, 0);
    const directEarnings = earnings.filter(e => e.level === 1).reduce((sum, earning) => sum + earning.amount, 0);
    const indirectEarnings = earnings.filter(e => e.level > 1).reduce((sum, earning) => sum + earning.amount, 0);
    
   
    const directReferrals = await Referral.countDocuments({ referredBy: userId });
    console.log('Direct referrals count:', directReferrals);
    
    const directReferralIds = await getDirectReferralIds(userId);
    console.log('Direct referral IDs:', directReferralIds);
    
    const indirectReferrals = await Referral.countDocuments({ 
      referredBy: { $in: directReferralIds }
    });
    console.log('Indirect referrals count:', indirectReferrals);
    
  
    const monthlyBreakdown = await getMonthlyEarningsBreakdown(userId);
    
   
    const levelBreakdown = await getLevelWiseBreakdown(userId);
    
    const responseData = {
      totalEarnings,
      directEarnings,
      indirectEarnings,
      directReferrals,
      indirectReferrals,
      monthlyBreakdown,
      levelBreakdown,
      recentEarnings: earnings.slice(0, 10)
    };
    
    console.log('Response data:', responseData);
    
    res.status(200).json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error('Error in getEarningsSummary:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getReferralAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    
   
    const directReferrals = await Referral.find({ referredBy: userId })
      .populate('user', 'name email phone referralCode createdAt');
    
    
    for (const ref of directReferrals) {
      
      ref.earnings = await Earning.find({
        userId: userId, 
        level: 1
      }).populate({
        path: 'purchaseId',
        match: { userId: ref.user._id }
      });
      
      ref.earnings = ref.earnings.filter(e => e.purchaseId);
    }
    
   
    const directReferralIds = directReferrals.map(r => r.user._id);
    const indirectReferrals = await Referral.find({ 
      referredBy: { $in: directReferralIds } 
    })
      .populate('user', 'name email phone referralCode createdAt');
    
    for (const ref of indirectReferrals) {
     
      ref.earnings = await Earning.find({
        userId: userId,
        level: 2
      }).populate({
        path: 'purchaseId',
        match: { userId: ref.user._id }
      });
     
      ref.earnings = ref.earnings.filter(e => e.purchaseId);
    }
    const activeDirectReferrals = directReferrals.filter(ref => ref.earnings && ref.earnings.length > 0).length;
    const activeIndirectReferrals = indirectReferrals.filter(ref => ref.earnings && ref.earnings.length > 0).length;


    console.log('Direct Referrals:', directReferrals.map(r => ({
      name: r.user.name,
      earningsCount: r.earnings.length
    })));
    console.log('Active Direct Referrals:', activeDirectReferrals);
    console.log('Indirect Referrals:', indirectReferrals.map(r => ({
      name: r.user.name,
      earningsCount: r.earnings.length
    })));
    console.log('Active Indirect Referrals:', activeIndirectReferrals);
    

    const analytics = {
      directReferrals: {
        count: directReferrals.length,
        totalEarnings: directReferrals.reduce((sum, ref) => 
          sum + ref.earnings.reduce((eSum, earning) => eSum + earning.amount, 0), 0
        ),
        activeReferrals: activeDirectReferrals,
        referrals: directReferrals.map(ref => ({
          id: ref.user._id,
          name: ref.user.name,
          email: ref.user.email,
          phone: ref.user.phone,
          referralCode: ref.user.referralCode,
          joinedDate: ref.user.createdAt,
          totalEarnings: ref.earnings.reduce((sum, earning) => sum + earning.amount, 0),
          purchaseCount: ref.earnings.length
        }))
      },
      indirectReferrals: {
        count: indirectReferrals.length,
        totalEarnings: indirectReferrals.reduce((sum, ref) => 
          sum + ref.earnings.reduce((eSum, earning) => eSum + earning.amount, 0), 0
        ),
        activeReferrals: activeIndirectReferrals,
        referrals: indirectReferrals.map(ref => ({
          id: ref.user._id,
          name: ref.user.name,
          email: ref.user.email,
          phone: ref.user.phone,
          referralCode: ref.user.referralCode,
          joinedDate: ref.user.createdAt,
          totalEarnings: ref.earnings.reduce((sum, earning) => sum + earning.amount, 0),
          purchaseCount: ref.earnings.length
        }))
      }
    };
    
    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getLevelBreakdown = async (req, res) => {
  try {
    const userId = req.user._id;
    const levelBreakdown = await getLevelWiseBreakdown(userId);
    
    res.status(200).json({
      success: true,
      data: levelBreakdown
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.getEarningSources = async (req, res) => {
  try {
    const userId = req.user._id;
    
    
    const earnings = await Earning.find({ userId: userId })
      .populate({
        path: 'purchaseId',
        populate: { path: 'userId', select: 'name email' }
      });
    
   
    const sources = {};

    earnings.forEach(earning => {
      const purchase = earning.purchaseId;
      if (!purchase || !purchase.userId) return; 

      const referralId = purchase.userId._id.toString();
      if (!sources[referralId]) {
        sources[referralId] = {
          name: purchase.userId.name || 'Unknown',
          email: purchase.userId.email || 'Unknown',
          level: earning.level,
          totalEarnings: 0,
          purchaseCount: 0,
          purchases: []
        };
      }
      
      sources[referralId].totalEarnings += earning.amount;
      sources[referralId].purchaseCount += 1;
      sources[referralId].purchases.push({
        amount: purchase.amount,
        description: purchase.description,
        date: purchase.createdAt,
          earning: earning.amount
        });
    });
    
    const sourcesArray = Object.values(sources).sort((a, b) => b.totalEarnings - a.totalEarnings);
    
    res.status(200).json({
      success: true,
      data: sourcesArray
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.getMonthlyTrend = async (req, res) => {
  try {
    const userId = req.user._id;
    const { months = 12 } = req.query;
    
    const monthlyBreakdown = await getMonthlyEarningsBreakdown(userId, parseInt(months));
    
    res.status(200).json({
      success: true,
      data: monthlyBreakdown
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


async function getDirectReferralIds(userId) {
  const directReferrals = await Referral.find({ referredBy: userId });
  return directReferrals.map(ref => ref.user);
}

async function getMonthlyEarningsBreakdown(userId, months = 12) {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  
  const earnings = await Earning.find({
    userId: userId,
    createdAt: { $gte: startDate }
  });
  
  const monthlyData = {};
  
  for (let i = 0; i < months; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthlyData[monthKey] = {
      month: monthKey,
      totalEarnings: 0,
      directEarnings: 0,
      indirectEarnings: 0,
      earningCount: 0
    };
  }
  
  earnings.forEach(earning => {
    const monthKey = `${earning.createdAt.getFullYear()}-${String(earning.createdAt.getMonth() + 1).padStart(2, '0')}`;
    if (monthlyData[monthKey]) {
      monthlyData[monthKey].totalEarnings += earning.amount;
      monthlyData[monthKey].earningCount += 1;
      
      if (earning.level === 1) {
        monthlyData[monthKey].directEarnings += earning.amount;
      } else {
        monthlyData[monthKey].indirectEarnings += earning.amount;
      }
    }
  });
  
  return Object.values(monthlyData).reverse();
}

async function getLevelWiseBreakdown(userId) {
  const earnings = await Earning.find({ userId: userId });
  
  const levelBreakdown = {};
  
  earnings.forEach(earning => {
    if (!levelBreakdown[earning.level]) {
      levelBreakdown[earning.level] = {
        level: earning.level,
        totalEarnings: 0,
        earningCount: 0,
        commissionRate: earning.level === 1 ? 5 : 1
      };
    }
    
    levelBreakdown[earning.level].totalEarnings += earning.amount;
    levelBreakdown[earning.level].earningCount += 1;
  });
  
  return Object.values(levelBreakdown).sort((a, b) => a.level - b.level);
} 