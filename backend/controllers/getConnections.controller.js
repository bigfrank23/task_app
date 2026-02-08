import mongoose from 'mongoose';
import User from '../models/user.model.js';

export const getUserConnections = async (req, res) => {
  try {
    // Debug: Check what's in req.user
    console.log('🔍 req.user:', req.user);
    console.log('🔍 req.user._id:', req.user?._id);
    console.log('🔍 Type of _id:', typeof req.user?._id);
    
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const userId = req.user._id;
    
    // Debug: Try to find the user
    console.log('🔍 Searching for user with ID:', userId);
    const user = await User.findById(userId).lean();
    
    console.log('👤 User found:', user ? 'YES' : 'NO');
    
    if (!user) {
      console.log('❌ User not found in database with ID:', userId);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    console.log('✅ User data:', {
      id: user._id,
      displayName: user.displayName,
      followingCount: user.following?.length || 0,
      followersCount: user.followers?.length || 0
    });
    
    // Find mutuals
    const followingSet = new Set(user.following?.map(id => id.toString()) || []);
    const followerSet = new Set(user.followers?.map(id => id.toString()) || []);
    
    const mutualIds = [...followingSet].filter(id => followerSet.has(id));
    console.log('🤝 Mutual IDs:', mutualIds);
    
    // Get user details
    const connections = await User.find({
      _id: { $in: mutualIds }
    }).select('firstName lastName displayName userImage jobTitle bio').lean();
    
    console.log('✅ Connections found:', connections.length);

    res.json({
      success: true,
      count: connections.length,
      data: connections,
      debug: {
        userId: userId.toString(),
        followingCount: user.following?.length || 0,
        followersCount: user.followers?.length || 0,
        mutualIds
      }
    });

  } catch (error) {
    console.error('❌ Full error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// In getConnections.controller.js
export const getUserConnectionsById = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from URL params
    
    console.log('🔍 Finding connections for user:', userId);

    const user = await User.findById(userId)
      .select('following followers')
      .lean();
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find mutuals
    const followingSet = new Set(user.following?.map(id => id.toString()) || []);
    const followerSet = new Set(user.followers?.map(id => id.toString()) || []);
    
    const mutualIds = [...followingSet].filter(id => followerSet.has(id));
    
    // Get user details
    const connections = await User.find({
      _id: { $in: mutualIds }
    }).select('firstName lastName displayName userImage jobTitle bio').lean();

    res.json({
      success: true,
      count: connections.length,
      data: connections
    });

  } catch (error) {
    console.error('❌ Connections error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch connections' 
    });
  }
};