// models/profileView.model.js
import mongoose from 'mongoose';

const profileViewSchema = new mongoose.Schema(
  {
    profileOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    viewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    // Track unique views per day
    viewDate: {
      type: String, // Format: 'YYYY-MM-DD'
      required: true
    }
  },
  { timestamps: true }
);

// Compound index to prevent duplicate views per day
profileViewSchema.index({ profileOwner: 1, viewer: 1, viewDate: 1 }, { unique: true });

export default mongoose.model('ProfileView', profileViewSchema);