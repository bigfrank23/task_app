// import jwt from 'jsonwebtoken'

// export const verifyToken = (req, res, next) => {
//     const token = req.cookies.token;

//     if (!token) {
//         return res.status(401).json({ message: "Access Denied. No token provided." });
//     }

//     jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
//         if (err) {
//             return res.status(403).json({ message: "Invalid token." });
//         }
//         // req.userId = payload.userId || payload.id || payload._id

//         req.user = {
//       id: payload.userId || payload.id || payload._id,
//     };

//         next();
//     });
// }

// middleware/verifyToken.js
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js'; // Import User model

export const verifyToken = async (req, res, next) => {
  // console.log('🔍 Token Debug:', {
  //   cookie: req.cookies?.token?.substring(0, 20),
  //   authHeader: req.headers.authorization?.substring(0, 30),
  //   hasCookie: !!req.cookies?.token,
  //   hasAuthHeader: !!req.headers.authorization
  // });
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    const userId = payload.userId || payload.id || payload._id;
    
    // Fetch the full user object
    const user = await User.findById(userId).select('-hashedPassword');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    req.user = user; // Now req.user has _id, email, etc.
    
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: "Invalid token." });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired." });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};