const mongoose = require('mongoose');
const User = require('../models/User');
const Referral = require('../models/Referral');
const Purchase = require('../models/Purchase');
require('dotenv').config();

const INACTIVITY_DAYS = 7;
const MIN_PURCHASE_AMOUNT = 1000;

async function markInactiveByReferralActivity() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sportsdunia_referral');
    console.log('Connected to MongoDB');

    const cutoff = new Date(Date.now() - INACTIVITY_DAYS * 24 * 60 * 60 * 1000);
    const users = await User.find({ isActive: true });
    let inactivated = 0;

    for (const user of users) {
      // Get direct referrals
      const referralDoc = await Referral.findOne({ user: user._id });
      if (!referralDoc || !referralDoc.directReferrals.length) continue;

      // Check if any direct referral has a qualifying purchase in the last 7 days
      const qualifyingReferral = await Purchase.findOne({
        userId: { $in: referralDoc.directReferrals },
        amount: { $gte: MIN_PURCHASE_AMOUNT },
        status: 'completed',
        createdAt: { $gte: cutoff }
      });

      if (!qualifyingReferral) {
        user.isActive = false;
        await user.save();
        inactivated++;
        console.log(`Marked inactive: ${user.name} (${user.email})`);
      }
    }

    console.log(`\nTotal users marked inactive: ${inactivated}`);
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error in markInactiveByReferralActivity:', error);
    await mongoose.disconnect();
  }
}

markInactiveByReferralActivity(); 