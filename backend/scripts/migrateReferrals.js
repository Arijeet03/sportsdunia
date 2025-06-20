const mongoose = require('mongoose');
const User = require('../models/User');
const Referral = require('../models/Referral');
require('dotenv').config();

async function migrateReferrals() {
  try {
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sportsdunia_referral', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    
    const users = await User.find({});
    console.log(`Found ${users.length} users`);

    let createdCount = 0;
    let updatedCount = 0;

    for (const user of users) {
      
      let referralDoc = await Referral.findOne({ user: user._id });
      
      if (!referralDoc) {
        
        referralDoc = new Referral({
          user: user._id,
          referredBy: user.referredBy || null
        });
        await referralDoc.save();
        createdCount++;
        console.log(`Created Referral document for user: ${user.name} (${user.email})`);
      } else {
        
        if (!referralDoc.referredBy && user.referredBy) {
          referralDoc.referredBy = user.referredBy;
          await referralDoc.save();
          updatedCount++;
          console.log(`Updated Referral document for user: ${user.name} (${user.email})`);
        }
      }

      
      if (user.referredBy) {
        const referrerReferral = await Referral.findOne({ user: user.referredBy });
        if (!referrerReferral) {
          
          const newReferrerReferral = new Referral({
            user: user.referredBy,
            referredBy: null
          });
          await newReferrerReferral.save();
          console.log(`Created Referral document for referrer: ${user.referredBy}`);
        }

        
        if (referrerReferral && !referrerReferral.directReferrals.includes(user._id)) {
          referrerReferral.directReferrals.push(user._id);
          await referrerReferral.save();
          console.log(`Added ${user.name} to referrer's directReferrals`);
        }
      }
    }

    console.log(`\nMigration completed:`);
    console.log(`- Created ${createdCount} new Referral documents`);
    console.log(`- Updated ${updatedCount} existing Referral documents`);

    
    console.log('\nVerifying data...');
    const totalReferrals = await Referral.countDocuments();
    console.log(`Total Referral documents: ${totalReferrals}`);
    console.log(`Total Users: ${users.length}`);

    
    const sampleReferrals = await Referral.find({}).populate('user', 'name email').populate('referredBy', 'name email').limit(5);
    console.log('\nSample Referral documents:');
    sampleReferrals.forEach(ref => {
      console.log(`- User: ${ref.user?.name} (${ref.user?.email}) | Referred by: ${ref.referredBy?.name || 'None'} | Direct referrals: ${ref.directReferrals.length}`);
    });

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}


migrateReferrals(); 