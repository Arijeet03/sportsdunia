const { v4: uuidv4 } = require('uuid');


const generateReferralCode = () => {
  
  const uuid = uuidv4().replace(/-/g, '');
  return uuid.substring(0, 8).toUpperCase();
};


const isValidReferralCodeFormat = (code) => {
  if (!code || typeof code !== 'string') return false;
  
  
  const regex = /^[A-Z0-9]{8}$/;
  return regex.test(code);
};


const generateUniqueReferralCode = async (checkExists) => {
  let code;
  let attempts = 0;
  const maxAttempts = 10;

  do {
    code = generateReferralCode();
    attempts++;
    
    if (attempts > maxAttempts) {
      throw new Error('Unable to generate unique referral code after maximum attempts');
    }
  } while (await checkExists(code));

  return code;
};


const calculateReferralLevel = (user, targetUser) => {
  if (!user || !targetUser) return 0;
  
  
  if (targetUser.referredBy && targetUser.referredBy.toString() === user._id.toString()) {
    return 1;
  }
  
  
  if (targetUser.referredBy) {
    
    
    return 0;
  }
  
  return 0;
};

module.exports = {
  generateReferralCode,
  generateUniqueReferralCode,
  isValidReferralCodeFormat,
  calculateReferralLevel
}; 