import express from 'express'
import { googleAuth } from '../controllers/google_auth.controller.js';
import { verifyToken } from "../middleware/verfyToken.js";

import { registerUser, loginUser, logoutUser, forgotPassword, resetPassword } from '../controllers/user.controller.js'
import { loginLimiter } from '../utils/rateLimit.js';

const router = express.Router()

router.post('/auth/register', registerUser)
router.post('/auth/google', googleAuth);
router.post('/auth/login', loginLimiter, loginUser)
router.post('/auth/logout', logoutUser)
router.post("/auth/forgot-password", forgotPassword);
router.patch("/auth/reset-password/:token", resetPassword);


// router.put('/auth/update',  verifyToken, updateUser) 

export default router