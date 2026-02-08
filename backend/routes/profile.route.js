import express from "express";
import { verifyToken } from "../middleware/verfyToken.js";
import {
  updateProfileInfo,
  updatePassword,
  uploadAvatar,
  uploadCoverPhoto,
  deleteAvatar,
  deleteCoverPhoto,
  getUserProfile,
  getMyProfile,
  getUserMedia,
  trackProfileView,
  getProfileViewers,
  getUserMediaCounts,
} from "../controllers/profile.controller.js";
import multer from "multer";

const router = express.Router();

// Multer memory storage (for Cloudinary or local save)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Public route - anyone can view a user's profile (no auth required)
router.get('/profile/:userId', getUserProfile);

// Protected routes
router.use(verifyToken);
router.get('/profile/me', verifyToken, getMyProfile);

router.get('/:userId/media/counts', verifyToken, getUserMediaCounts);
router.get('/:userId/media', verifyToken, getUserMedia);

// routes/profile.route.js
router.post('/:userId/view', verifyToken, trackProfileView);
router.get('/:userId/viewers', verifyToken, getProfileViewers);

// Update basic profile info
router.patch("/profile/info", updateProfileInfo);

// Update password
router.patch("/profile/password", updatePassword);

// Upload avatar
router.patch("/profile/avatar", upload.single("avatar"), uploadAvatar);

// Upload cover photo
router.patch("/profile/cover", upload.single("cover"), uploadCoverPhoto);
//Delete avatar & cover photo
router.delete('/profile/avatar', deleteAvatar);
router.delete('/profile/cover-photo', deleteCoverPhoto);

export default router;
