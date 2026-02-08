// models/notification.model.js
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: ['follow', 'task_comment', 'task_like', 'message', 'task_mention', 'task_assigned', 'new_post'],
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    link: {
      type: String, // URL to navigate to when clicked
    },
    relatedTask: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    },
    relatedMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    },
    read: {
      type: Boolean,
      default: false,
      index: true
    },
    readAt: {
      type: Date
    }
  },
  { 
    timestamps: true 
  }
);

// Compound indexes for efficient queries
notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, type: 1 });

// Auto-delete notifications older than 30 days
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // 30 days

export default mongoose.model('Notification', notificationSchema);