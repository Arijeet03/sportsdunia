const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Referral = require('../models/Referral');
const { generateUniqueReferralCode, isValidReferralCodeFormat } = require('../utils/referralCode');
const { generateToken } = require('../middleware/auth');

class AuthService {
  
  static async register(userData) {
    const { name, email, password, phone, referralCode } = userData;

    try {
      
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      
      const newReferralCode = await generateUniqueReferralCode(async (code) => {
        return await User.findOne({ referralCode: code });
      });

      
      let referredBy = null;
      if (referralCode) {
        if (!isValidReferralCodeFormat(referralCode)) {
          throw new Error('Invalid referral code format');
        }

        const referrer = await User.findOne({ referralCode: referralCode.toUpperCase() });
        if (!referrer) {
          throw new Error('Invalid referral code');
        }

        if (!referrer.isActive) {
          throw new Error('Referrer account is inactive');
        }

        
        const referralCount = await Referral.countDocuments({ referredBy: referrer._id });
        const maxReferrals = parseInt(process.env.MAX_DIRECT_REFERRALS) || 8;
        
        if (referralCount >= maxReferrals) {
          throw new Error('Referrer has reached maximum number of direct referrals');
        }

        referredBy = referrer._id;
      }

      
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        phone,
        referralCode: newReferralCode,
        referredBy
      });

      await newUser.save();

      
      const newReferral = new Referral({
        user: newUser._id,
        referredBy: referredBy || null
      });
      await newReferral.save();

      
      if (referredBy) {
        await Referral.findOneAndUpdate(
          { user: referredBy },
          { $push: { directReferrals: newUser._id } },
          { upsert: true }
        );
      }

      
      const token = generateToken(newUser._id);

      
      const userResponse = {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        referralCode: newUser.referralCode,
        referredBy: newUser.referredBy,
        totalEarnings: newUser.totalEarnings,
        role: newUser.role,
        createdAt: newUser.createdAt
      };

      return {
        user: userResponse,
        token
      };

    } catch (error) {
      throw error;
    }
  }

  
  static async login(email, password) {
    try {
      
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Invalid email or password');
      }

      if (!user.isActive) {
        throw new Error('Account is deactivated');
      }

      
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      
      const token = generateToken(user._id);

      
      const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        referralCode: user.referralCode,
        referredBy: user.referredBy,
        totalEarnings: user.totalEarnings,
        role: user.role,
        createdAt: user.createdAt
      };

      return {
        user: userResponse,
        token
      };

    } catch (error) {
      throw error;
    }
  }

  
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
}

module.exports = AuthService; 