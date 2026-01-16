import express from "express";
import { verifyToken } from "../middleware/verfyToken.js";
import {
  updateProfileInfo,
  updatePassword,
  uploadAvatar,
  uploadCoverPhoto,
} from "../controllers/profile.controller.js";
import multer from "multer";

const router = express.Router();

// Multer memory storage (for Cloudinary or local save)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Protected routes
router.use(verifyToken);

// Update basic profile info
router.patch("/profile/info", updateProfileInfo);

// Update password
router.patch("/profile/password", updatePassword);

// Upload avatar
router.patch("/profile/avatar", upload.single("avatar"), uploadAvatar);

// Upload cover photo
router.patch("/profile/cover", upload.single("cover"), uploadCoverPhoto);

export default router;
