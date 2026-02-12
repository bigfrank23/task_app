import express from 'express'
import { googleAuth } from '../controllers/google_auth.controller.js';
import { verifyToken } from "../middleware/verfyToken.js";

import { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getUser, getMe, searchUsers, getUserById, getUsers, deleteAccount } from '../controllers/user.controller.js'
import { loginLimiter } from '../utils/rateLimit.js';

const router = express.Router()

router.post('/auth/register',loginLimiter, registerUser)
router.post('/auth/google', googleAuth);
router.post('/auth/login', loginLimiter, loginUser)
router.post('/auth/logout', logoutUser)
router.get('/auth/:id', getUser) 
router.post("/auth/forgot-password", forgotPassword);
router.patch("/auth/reset-password/:token", resetPassword);

// For Chat
router.get('/me', getMe);
router.get('/search', searchUsers);
router.get('/:id', getUserById);
router.get('/', getUsers);
router.delete("/delete-account", verifyToken, deleteAccount);


// router.put('/auth/update',  verifyToken, updateUser) 

export default router