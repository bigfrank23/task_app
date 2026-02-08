// routes/follow.routes.js
import express from 'express';
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  checkFollowStatus,
  getSuggestedUsers
} from '../controllers/follow.controller.js';
import { verifyToken } from '../middleware/verfyToken.js';
import {  getUserConnections, getUserConnectionsById } from '../controllers/getConnections.controller.js';

const router = express.Router();

router.use(verifyToken); 
router.get('/users/me/connections', getUserConnections);
router.get('/users/:userId/connections', getUserConnectionsById);
router.get('/suggestions', getSuggestedUsers);
router.get('/:userId/followers', getFollowers);
router.get('/:userId/following', getFollowing);
router.get('/:userId/follow-status', checkFollowStatus);

router.post('/:userId/follow', followUser);
router.delete('/:userId/unfollow', unfollowUser);



export default router;