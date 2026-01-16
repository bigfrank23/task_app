import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";

// 1️⃣ Update profile info (name, displayName, email)
export const updateProfileInfo = async (req, res) => {
  const { displayName, firstName, lastName, jobTitle, bio, email } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

     // 🛑 Prevent duplicate email
    if (email && email !== user.email) {
      const exists = await User.findOne({ email });
      if (exists) return res.status(409).json({ message: "Email already in use" });
    }

    if (displayName) user.displayName = displayName;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (jobTitle) user.jobTitle = jobTitle;
    if (bio) user.bio = bio;
    if (email) user.email = email;

    await user.save();

    const { hashedPassword, ...result } = user.toObject();
    res.status(200).json({ message: "Profile updated", user: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 2️⃣ Update password
export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🚫 Google-auth users cannot change password
    if (user.authProvider !== "local" || !user.hashedPassword) {
      return res.status(400).json({
        message: "Google-authenticated users cannot change password",
      });
    }

    // Validate inputs
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Missing password fields" });
    }

    const valid = await bcrypt.compare(
      currentPassword,
      user.hashedPassword
    );

    if (!valid) {
      return res
        .status(400)
        .json({ message: "Current password is incorrect" });
    }

    const isSameAsOld = await bcrypt.compare(
      newPassword,
      user.hashedPassword
    );

    if (isSameAsOld) {
      return res
        .status(400)
        .json({ message: "New password must be different" });
    }

    user.hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// 3️⃣ Upload avatar
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const result = await cloudinary.uploader.upload_stream(
      { folder: "todo_app/avatars" },
      async (error, result) => {
        if (error) throw error;

        const user = await User.findById(req.userId);
        user.userImage = result.secure_url;
        await user.save();

        res.json({ message: "Profile photo uploaded", url: result.secure_url });
      }
    );

    result.end(req.file.buffer); // pipe buffer into Cloudinary
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 4️⃣ Upload cover photo (same pattern)
export const uploadCoverPhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const result = await cloudinary.uploader.upload_stream(
      { folder: "todo_app/cover_photos" },
      async (error, result) => {
        if (error) throw error;

        const user = await User.findById(req.userId);
        user.coverPhoto = result.secure_url; // add coverPhoto field to user model
        await user.save();

        res.json({ message: "Cover photo uploaded", url: result.secure_url });
      }
    );

    result.end(req.file.buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
