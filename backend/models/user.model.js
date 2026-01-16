import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    displayName: {
        type: String,
        required: true,
        trim: true,
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    jobTitle: {
        type: String,
        trim: true
    },
    bio: {
        type: String,
        maxlength: 300
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    hashedPassword: {
        type: String,
        minlength: 6,
        // Only required if the user registered locally
        required: function () {
        return this.authProvider === "local";
        },
    },
    userImage: {
        type: String,
        default: null
    },
    coverPhoto: {
    type: String,
    default: null
    },
    googleId: {
    type: String,
    default: null
    },
    authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
    },
    // reset password
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    loginAttempts: {
  type: Number,
  default: 0,
    },
    lockUntil: {
    type: Date,
    },

},{timestamps: true});

const User = mongoose.model("User", userSchema)

export default User