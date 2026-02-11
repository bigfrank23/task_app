import User from "../models/user.model.js"
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmailTransporter.js";
import { isLocked } from "../utils/accountLock.js";
import Task from "../models/task.model.js";
import Message from "../models/message.model.js";
import Notification from "../models/notification.model.js";
import ProfileView from "../models/profileView.model.js";

export const registerUser = async(req, res) => {
    const {displayName, firstName, lastName, email, password} = req.body

    try {
        if (!displayName || !firstName || !lastName || !email || !password) {
            return res.status(400).json({message: "All fields are required!"})
        }
    
        const existingUserViaEmail = await User.findOne({email})
        const existingUserViaDisplayName = await User.findOne({displayName})
    
        //No duplicate email
        if (existingUserViaEmail) return res.status(409).json({message: "Email already exist!"})
        if (existingUserViaDisplayName) return res.status(409).json({message: "Display Name already Taken!"})
    
        const newHashedPassword = await bcrypt.hash(password, 10)
    
        const user = await User.create({
            displayName,
            firstName,
            lastName,
            email,
            hashedPassword: newHashedPassword
        })
    
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'})
    
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // ✅ FIXED
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
    
        const {hashedPassword, ...detailsWithoutPassword} = user.toObject()
        res.status(201).json({message: "User created!" , detailsWithoutPassword})
        
    } catch (error) {
         // Mongoose validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(
            err => err.message
            );
    
            return res.status(400).json({
            message: messages[0] // first validation error
            });
        }
    }

}

// Login user
export const loginUser = async(req, res) => {
    const {email, password} = req.body

    try {

        if (!email || !password) {
            return res.status(400).json({message: "All fields are required!"})
        }

        const user = await User.findOne({email})

        if (!user) {
            return res.status(400).json({message: "User not found!"})
        }

        // Check if user is locked
        if (isLocked(user)) {
      const secondsLeft = Math.ceil(
        (user.lockUntil - Date.now()) / 1000
      );

      return res.status(423).json({
        message: `Account locked. Try again in ${secondsLeft}s`,
      });
    }

        // Block password login for Google users
        if (user.authProvider === "google") {
        return res.status(400).json({
            message: "This account was created using Google. Please sign in with Google."
        });
        }
        console.log(user.authProvider);
        
            
        const isPasswordCorrect = await bcrypt.compare(password, user.hashedPassword)

        if (!isPasswordCorrect) {
            return res.status(400).json({message: "Email or Password is not valid!"})
        }

        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'})

        res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        const {hashedPassword, ...detailsWithoutPassword} = user.toObject()
        res.status(200).json({message: "Sign in successful!" , detailsWithoutPassword})

    } catch (error) {
        console.log(error );
        res.status(500).json({ message: "Server error" });
        
    }
}

// Get User
export const getUser = async(req, res) => {
  console.log(req.params.id)
    const user = await User.findById(req.params.Id)
    
    console.log('user from db ', user);
    

    if (!user) return res.status(404).json({message: "User not found!"})

    res.json(user)
}

// Logut User
export const logoutUser = (req, res) => {
    try {
        res.clearCookie('token')
        res.status(200).json({message: "Signout successfully!"})
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

// Update
export const updateUser = async (req, res) => {
  const { displayName, firstName, lastName, email, password } = req.body;

  try {
    const userId = req.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // 🚫 Prevent Google users from setting password directly
    if (user.authProvider === "google" && password) {
      return res.status(400).json({
        message: "Google-authenticated users cannot set a password.",
      });
    }

    // 🛑 Prevent duplicate email
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(409).json({ message: "Email already in use!" });
      }
    }

    // ✅ Update allowed fields only
    if (displayName) user.displayName = displayName;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;

    // 🔐 Update password if provided
    if (password) {
      user.hashedPassword = await bcrypt.hash(password, 10);
    }

    await user.save();

    const { hashedPassword, ...detailsWithoutPassword } =
      user.toObject();

    res.status(200).json({
      message: "Profile updated successfully!",
      user: detailsWithoutPassword,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.authProvider === "google") {
      return res.json({
        message: "If the email exists, a reset link has been sent",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

   const resetEmailTemplate = (resetUrl, name) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f4f6f8;
      padding: 20px;
    }
    .card {
      max-width: 480px;
      background: #ffffff;
      padding: 20px;
      margin: auto;
      border-radius: 8px;
    }
    .btn {
      display: inline-block;
      background: #2563eb;
      color: #ffffff;
      padding: 12px 18px;
      text-decoration: none;
      border-radius: 6px;
      margin-top: 15px;
    }
    .footer {
      font-size: 12px;
      color: #888;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="card">
    <h2>Password Reset</h2>
    <p>Hello ${name},</p>
    <p>You requested to reset your password.</p>

    <a href="${resetUrl}" class="btn">
      Reset Password
    </a>

    <p>This link expires in 15 minutes.</p>

    <div class="footer">
      If you didn’t request this, ignore this email.
    </div>
  </div>
</body>
</html>
`;

    await sendEmail({
      to: user.email,
      subject: "Reset your password",
      html: resetEmailTemplate(resetUrl, user.firstName),
    });

    res.json({ message: "If the email exists, a reset link has been sent" });
  } catch (err) {
    console.error("Forgot password error:", err); // ADD THIS LINE
    res.status(500).json({ message: "Server error" });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  console.log("Full req.body:", req.body); // ADD THIS
  console.log("Request headers:", req.headers); // ADD THIS

   console.log("Received token:", token); // ADD THIS
  console.log("New password provided:", !!newPassword); 

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

    console.log("Hashed token:", hashedToken); // ADD THIS


  try {
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    console.log("User found:", !!user); // ADD THIS
    console.log("Current time:", Date.now()); // ADD THIS
    if (user) {
      console.log("Token expires at:", user.resetPasswordExpires); // ADD THIS
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.hashedPassword = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
     console.error("Reset password error:", err); // ADD THIS
    res.status(500).json({ message: "Server error" });
  }
};


// Controller for chat
// controllers/user.controller.js

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-hashedPassword -resetPasswordToken -resetPasswordExpires');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('displayName userImage jobTitle bio location followersCount followingCount');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all users (for “start conversation”) Exclude yourself 
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.id } })
      .select('displayName userImage jobTitle');

    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Search users (🔥 very important for chat)
export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.json({ success: true, data: [] });
    }

    const users = await User.find({
      _id: { $ne: req.user.id },
      displayName: { $regex: q, $options: 'i' }
    })
      .limit(10)
      .select('displayName userImage jobTitle');

    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    // ✅ Find user first to verify existence
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ Find all tasks to delete their Cloudinary attachments
    const userTasks = await Task.find({
      $or: [{ createdBy: userId }, { assignedTo: userId }]
    });

    // ✅ Delete all Cloudinary files from tasks
    const cloudinaryDeletions = [];
    for (const task of userTasks) {
      if (task.attachments && task.attachments.length > 0) {
        for (const attachment of task.attachments) {
          if (attachment.publicId) {
            // Determine resource type based on attachment type
            const resourceType = 
              attachment.type === 'image' ? 'image' :
              attachment.type === 'video' ? 'video' : 'raw';
            
            cloudinaryDeletions.push(
              cloudinary.uploader.destroy(attachment.publicId, {
                resource_type: resourceType
              }).catch(err => {
                console.error(`Failed to delete ${attachment.publicId}:`, err);
              })
            );
          }
        }
      }
    }

    // ✅ Delete user's profile images from Cloudinary
    if (user.userImage) {
      const avatarPublicId = user.userImage.split('/').slice(-2).join('/').split('.')[0];
      cloudinaryDeletions.push(
        cloudinary.uploader.destroy(`todo_app/avatars/${avatarPublicId}`)
          .catch(err => console.error('Failed to delete avatar:', err))
      );
    }

    if (user.coverPhoto) {
      const coverPublicId = user.coverPhoto.split('/').slice(-2).join('/').split('.')[0];
      cloudinaryDeletions.push(
        cloudinary.uploader.destroy(`todo_app/cover_photos/${coverPublicId}`)
          .catch(err => console.error('Failed to delete cover:', err))
      );
    }

    // Wait for all Cloudinary deletions
    await Promise.all(cloudinaryDeletions);

    // ✅ Delete all user-related data from database
    await Promise.all([
      // Delete user's tasks
      Task.deleteMany({ createdBy: userId }),
      
      // Delete tasks assigned to user
      Task.deleteMany({ assignedTo: userId }),
      
      // Remove user from followers/following lists
      User.updateMany(
        { followers: userId },
        { $pull: { followers: userId }, $inc: { followersCount: -1 } }
      ),
      User.updateMany(
        { following: userId },
        { $pull: { following: userId }, $inc: { followingCount: -1 } }
      ),
      
      // Delete user's messages
      Message.deleteMany({ $or: [{ sender: userId }, { recipient: userId }] }),
      
      // Delete user's notifications
      Notification.deleteMany({ $or: [{ sender: userId }, { recipient: userId }] }),
      
      // Delete profile views
      ProfileView.deleteMany({ $or: [{ profileOwner: userId }, { viewer: userId }] }),
      
      // Finally, delete the user
      User.findByIdAndDelete(userId)
    ]);

    // ✅ Clear cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.status(200).json({
      success: true,
      message: "Account and all associated data deleted successfully",
    });

  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};