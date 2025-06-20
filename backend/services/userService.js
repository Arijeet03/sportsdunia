const User = require('../models/User');
const Referral = require('../models/Referral');

class UserService {
  
  static async getProfile(userId) {
    try {
      const user = await User.findById(userId).select('-password');
      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  
  static async updateProfile(userId, updateData) {
    try {
      const allowedFields = ['name', 'phone'];
      const filteredData = {};

      
      Object.keys(updateData).forEach(key => {
        if (allowedFields.includes(key)) {
          filteredData[key] = updateData[key];
        }
      });

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        filteredData,
        { new: true, runValidators: true }
      ).select('-password');

      if (!updatedUser) {
        throw new Error('User not found');
      }

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  
  static async getReferralTree(userId) {
    try {
      
      const directReferrals = await Referral.findOne({ user: userId })
        .populate({
          path: 'directReferrals',
          select: 'name email referralCode totalEarnings createdAt',
          match: { isActive: true }
        });

      
      const userReferral = await Referral.findOne({ user: userId })
        .populate('referredBy', 'name email referralCode');

      
      const indirectReferrals = [];
      if (directReferrals && directReferrals.directReferrals.length > 0) {
        const directReferralIds = directReferrals.directReferrals.map(ref => ref._id);
        
        const level2Referrals = await Referral.find({
          referredBy: { $in: directReferralIds }
        }).populate({
          path: 'user',
          select: 'name email referralCode totalEarnings createdAt',
          match: { isActive: true }
        });

        indirectReferrals.push(...level2Referrals.map(ref => ref.user).filter(Boolean));
      }

      return {
        directReferrals: directReferrals ? directReferrals.directReferrals : [],
        indirectReferrals,
        referredBy: userReferral ? userReferral.referredBy : null,
        totalDirectReferrals: directReferrals ? directReferrals.directReferrals.length : 0,
        totalIndirectReferrals: indirectReferrals.length
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserService; 