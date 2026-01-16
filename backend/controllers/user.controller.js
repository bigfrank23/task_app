import User from "../models/user.model.js"
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmailTransporter.js";
import { isLocked } from "../utils/accountLock.js";

export const registerUser = async(req, res) => {
    const {displayName, firstName, lastName, email, password} = req.body

    try {
        if (!displayName || !firstName || !lastName || !email || !password) {
            return res.status(400).json({message: "All fields are required!"})
        }
    
        const existingUser = await User.findOne({email})
    
        //No duplicate email
        if (existingUser) return res.status(409).json({message: "Email already exist!"})
    
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
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
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
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        const {hashedPassword, ...detailsWithoutPassword} = user.toObject()
        res.status(200).json({message: "Sign in successful!" , detailsWithoutPassword})

    } catch (error) {
        console.log(error );
        res.status(500).json({ message: "Server error" });
        
    }
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

// FORGOT PASSWORD
// export const forgotPassword = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     // ✅ Always return success (prevent email enumeration)
//     if (!user || user.authProvider === "google") {
//       return res.json({
//         message: "If the email exists, a reset link has been sent",
//       });
//     }

//     const resetToken = crypto.randomBytes(32).toString("hex");
//     const hashedToken = crypto
//       .createHash("sha256")
//       .update(resetToken)
//       .digest("hex");

//     user.resetPasswordToken = hashedToken;
//     user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 min
//     await user.save();

//     const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

//     const resetEmailTemplate = (resetUrl, name) => `
// <!DOCTYPE html>
// <html>
// <head>
//   <meta charset="UTF-8" />
//   <style>
//     body {
//       font-family: Arial, sans-serif;
//       background: #f4f6f8;
//       padding: 20px;
//     }
//     .card {
//       max-width: 480px;
//       background: #ffffff;
//       padding: 20px;
//       margin: auto;
//       border-radius: 8px;
//     }
//     .btn {
//       display: inline-block;
//       background: #2563eb;
//       color: #ffffff;
//       padding: 12px 18px;
//       text-decoration: none;
//       border-radius: 6px;
//       margin-top: 15px;
//     }
//     .footer {
//       font-size: 12px;
//       color: #888;
//       margin-top: 20px;
//     }
//   </style>
// </head>
// <body>
//   <div class="card">
//     <h2>Password Reset</h2>
//     <p>Hello ${name},</p>
//     <p>You requested to reset your password.</p>

//     <a href="${resetUrl}" class="btn">
//       Reset Password
//     </a>

//     <p>This link expires in 15 minutes.</p>

//     <div class="footer">
//       If you didn’t request this, ignore this email.
//     </div>
//   </div>
// </body>
// </html>
// `;

// await sendEmail({
//   to: user.email,
//   subject: "Reset your password",
//   html: resetEmailTemplate(resetUrl, user.firstName),
// });


//     res.json({ message: "If the email exists, a reset link has been sent" });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// we;lfffelge,ege;llr;lel
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


