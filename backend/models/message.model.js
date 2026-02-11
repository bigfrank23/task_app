import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      required: true,
      index: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000
    },
    attachments: [{
      url: String,
      type: {
        type: String,
        enum: ['image', 'video', 'file']
      },
      filename: String,
      size: Number
    }],
    read: {
      type: Boolean,
      default: false
    },
    readAt: {
      type: Date
    },
    deleted: {
      type: Boolean,
      default: false
    }
  },
  { 
    timestamps: true 
  }
);

// Compound indexes
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ sender: 1, recipient: 1 });

// Helper method to generate conversation ID
messageSchema.statics.generateConversationId = function(userId1, userId2) {
  // Always put smaller ID first for consistency
  const ids = [userId1.toString(), userId2.toString()].sort();
  return `${ids[0]}_${ids[1]}`;
};

export default mongoose.model('Message', messageSchema);