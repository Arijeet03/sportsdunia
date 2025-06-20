const UserService = require('../services/userService');

exports.getProfile = async (req, res) => {
  try {
    const user = await UserService.getProfile(req.user._id);
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updatedUser = await UserService.updateProfile(req.user._id, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getReferralTree = async (req, res) => {
  try {
    const referralTree = await UserService.getReferralTree(req.user._id);
    
    res.status(200).json({
      success: true,
      data: referralTree
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}; 