// controllers/message.controller.js

import Message  from '../models/message.model.js';
import { Conversation } from '../models/conversation.model.js';
import User from '../models/user.model.js';
import Notification from '../models/notification.model.js';


import cloudinary from "../utils/cloudinary.js";
import multer from 'multer';

// multer memory storage (files kept in memory)
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// Updated sendMessage
export const sendMessage = async (req, res) => {
  try {
    const { recipientId, content } = req.body;
    const senderId = req.user.id;
    console.log('sendMessage -> senderId:', senderId, 'recipientId:', recipientId);

    if (!recipientId) {
  return res.status(400).json({ success: false, message: "recipientId is required" });
}

    if (recipientId === senderId)
      return res.status(400).json({ success: false, message: "Cannot message yourself" });

    if (!content && !req.files?.length)
      return res.status(400).json({ success: false, message: "Message or attachment required" });

     // Upload attachments to Cloudinary (FIXED: proper upload_stream usage)
    let attachments = [];
    if (req.files && req.files.length) {
      attachments = await Promise.all(req.files.map(async (file) => {
        return new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              resource_type: 'auto',
              folder: 'todo_app/messages'
            },
            (error, result) => {
              if (error) reject(error);
              else {
                resolve({
                  url: result.secure_url,
                  type: file.mimetype.startsWith('image/') ? 'image' :
                        file.mimetype.startsWith('video/') ? 'video' : 'file',
                  filename: file.originalname,
                  size: file.size
                });
              }
            }
          ).end(file.buffer);
        });
      }));
    }

    const conversationId = Message.generateConversationId(senderId, recipientId);

    const message = await Message.create({
      conversationId,
      sender: senderId,
      recipient: recipientId,
      content: content?.trim() || '',
      attachments
    });

    // ... rest of your conversation update, notifications, population

    // Update or create conversation
     await Conversation.findOneAndUpdate(
       { conversationId },
       {
         $set: {
           conversationId,
           participants: [senderId, recipientId],
           lastMessage: message._id,
           lastMessageAt: new Date()
         },
         $inc: {
           [`unreadCount.${recipientId}`]: 1
         }
       },
       { upsert: true, new: true }
     );

     // Create notification for recipient
     // Create notification for recipient
const recipient = await User.findById(recipientId);

if (recipient && recipient.notificationSettings?.messages !== false) {
  const sender = await User.findById(senderId).select('displayName');

  await Notification.create({
    recipient: recipientId,
    sender: senderId,
    type: 'message',
    title: 'New Message',
    message: `${sender.displayName} sent you a message`,
    link: `/messages/${conversationId}`,
    relatedMessage: message._id
  });
}


    await message.populate('sender', 'displayName userImage lastSeen');
    await message.populate('recipient', 'displayName userImage lastSeen');

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    console.error('❌ Send message error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};



// Send a message
// export const sendMessage = async (req, res) => {
//   try {
//     const { recipientId, content } = req.body;
//     const senderId = req.user.id;

//     if (recipientId === senderId) {
//       return res.status(400).json({
//         success: false,
//         message: "Cannot message yourself"
//       });
//     }


//     // Validate
//     if (!content || content.trim().length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Message content is required'
//       });
//     }

//     // Check if recipient exists
//     const recipient = await User.findById(recipientId);
//     if (!recipient) {
//       return res.status(404).json({
//         success: false,
//         message: 'Recipient not found'
//       });
//     }

//     // Generate conversation ID
//     const conversationId = Message.generateConversationId(senderId, recipientId);

//     // Create message
//     const message = await Message.create({
//       conversationId,
//       sender: senderId,
//       recipient: recipientId,
//       content: content.trim()
//     });

//     // Update or create conversation
//     await Conversation.findOneAndUpdate(
//       { conversationId },
//       {
//         $set: {
//           conversationId,
//           participants: [senderId, recipientId],
//           lastMessage: message._id,
//           lastMessageAt: new Date()
//         },
//         $inc: {
//           [`unreadCount.${recipientId}`]: 1
//         }
//       },
//       { upsert: true, new: true }
//     );

//     // Create notification for recipient
//     if (recipient.notificationSettings?.messages !== false) {
//       const sender = await User.findById(senderId).select('displayName');
      
//       await Notification.create({
//         recipient: recipientId,
//         sender: senderId,
//         type: 'message',
//         title: 'New Message',
//         message: `${sender.displayName} sent you a message`,
//         link: `/messages/${conversationId}`,
//         relatedMessage: message._id
//       });
//     }

//     // Populate sender info
//     await message.populate('sender', 'displayName userImage');
//     await message.populate('recipient', 'displayName userImage');

//     console.log(`✅ Message sent from ${senderId} to ${recipientId}`);

//     res.status(201).json({
//       success: true,
//       data: message
//     });
//   } catch (error) {
//     console.error('❌ Send message error:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// Get messages in a conversation
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const userId = req.user.id;

    // Verify user is part of conversation
    const conversation = await Conversation.findOne({ conversationId });
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    if (!conversation.participants.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this conversation'
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [messages, total] = await Promise.all([
      Message.find({ 
        conversationId
        // ✅ REMOVED: deleted: false
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('sender', 'displayName userImage lastSeen')
        .populate('recipient', 'displayName userImage lastSeen')
        .lean(),
      Message.countDocuments({ conversationId }) // ✅ Also remove deleted: false here
    ]);

    // Mark messages as read
    await Message.updateMany(
      {
        conversationId,
        recipient: userId,
        read: false,
        deleted: false // ✅ Keep this - don't mark deleted messages as read
      },
      {
        $set: { read: true, readAt: new Date() }
      }
    );

    // Reset unread count for this user
    await Conversation.updateOne(
      { conversationId },
      {
        $set: { [`unreadCount.${userId}`]: 0 }
      }
    );

    res.json({
      success: true,
      data: {
        messages: messages.reverse(), // Oldest first
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('❌ Get messages error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
// export const getMessages = async (req, res) => {
//   try {
//     const { conversationId } = req.params;
//     const { page = 1, limit = 50 } = req.query;
//     const userId = req.user.id;

//     // Verify user is part of conversation
//     const conversation = await Conversation.findOne({ conversationId });
    
//     if (!conversation) {
//       return res.status(404).json({
//         success: false,
//         message: 'Conversation not found'
//       });
//     }

//     if (!conversation.participants.includes(userId)) {
//       return res.status(403).json({
//         success: false,
//         message: 'Not authorized to view this conversation'
//       });
//     }

//     const skip = (parseInt(page) - 1) * parseInt(limit);

//     const [messages, total] = await Promise.all([
//       Message.find({ 
//         conversationId,
//         deleted: false 
//       })
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(parseInt(limit))
//         .populate('sender', 'displayName userImage')
//         .populate('recipient', 'displayName userImage')
//         .lean(),
//       Message.countDocuments({ conversationId, deleted: false })
//     ]);

//     // Mark messages as read
//     await Message.updateMany(
//       {
//         conversationId,
//         recipient: userId,
//         read: false
//       },
//       {
//         $set: { read: true, readAt: new Date() }
//       }
//     );

//     // Reset unread count for this user
//     await Conversation.updateOne(
//       { conversationId },
//       {
//         $set: { [`unreadCount.${userId}`]: 0 }
//       }
//     );

//     res.json({
//       success: true,
//       data: {
//         messages: messages.reverse(), // Oldest first
//         pagination: {
//           total,
//           page: parseInt(page),
//           limit: parseInt(limit),
//           pages: Math.ceil(total / parseInt(limit))
//         }
//       }
//     });
//   } catch (error) {
//     console.error('❌ Get messages error:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// Get all conversations
export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [conversations, total] = await Promise.all([
      Conversation.find({ participants: userId })
        .sort({ lastMessageAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('participants', 'displayName userImage lastSeen')
        .populate('lastMessage')
        .lean(),
      Conversation.countDocuments({ participants: userId })
    ]);

    // Add other participant info and unread count
    const conversationsWithDetails = conversations.map(conv => {
      const otherParticipant = conv.participants.find(
        p => p._id.toString() !== userId
      );
      // console.log(conv.unreadCount, typeof conv.unreadCount);
      // const unreadCount = conv.unreadCount?.[req.user._id] || 0;
      const unreadCount = conv.unreadCount?.[userId] || 0;



      return {
        ...conv,
        otherParticipant,
        // unreadCount: conv.unreadCount?.get(userId) || 0
        unreadCount: unreadCount
      };
    });

    res.json({
      success: true,
      data: {
        conversations: conversationsWithDetails,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('❌ Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete a message
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Only sender can delete
    if (message.sender.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this message'
      });
    }

    message.deleted = true;
    // message.content = ''; // optional: hide content
    // message.attachments = []; // optional: remove attachments
    await message.save();

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete message error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// export const deleteMessage = async (req, res) => {
//   try {
//     const { messageId } = req.params;
//     const userId = req.user.id;

//     const message = await Message.findById(messageId);

//     if (!message) {
//       return res.status(404).json({
//         success: false,
//         message: 'Message not found'
//       });
//     }

//     // Only sender can delete
//     if (message.sender.toString() !== userId) {
//       return res.status(403).json({
//         success: false,
//         message: 'Not authorized to delete this message'
//       });
//     }

//     message.deleted = true;
//     await message.save();

//     res.json({
//       success: true,
//       message: 'Message deleted successfully'
//     });
//   } catch (error) {
//     console.error('❌ Delete message error:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// controllers/message.controller.js

// Restore a deleted message
export const restoreMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Only sender can restore
    if (message.sender.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to restore this message'
      });
    }

    message.deleted = false;
    await message.save();

    await message.populate('sender', 'displayName userImage');
    await message.populate('recipient', 'displayName userImage');

    res.json({
      success: true,
      message: 'Message restored successfully',
      data: message
    });
  } catch (error) {
    console.error('❌ Restore message error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Mark conversation as read
export const markConversationAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    await Promise.all([
      Message.updateMany(
        {
          conversationId,
          recipient: userId,
          read: false
        },
        {
          $set: { read: true, readAt: new Date() }
        }
      ),
      Conversation.updateOne(
        { conversationId },
        {
          $set: { [`unreadCount.${userId}`]: 0 }
        }
      )
    ]);

    res.json({
      success: true,
      message: 'Conversation marked as read'
    });
  } catch (error) {
    console.error('❌ Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get unread message count
export const getUnreadCount = async (req, res) => {
  try {

    const userId = req.user.id;

    const conversations = await Conversation.find({ participants: userId })
      .select('unreadCount');

    const totalUnread = conversations.reduce((sum, conv) => {
      return sum + (conv.unreadCount?.get(userId) || 0);
    }, 0);

    res.json({
      success: true,
      data: {
        unreadCount: totalUnread
      }
    });
  } catch (error) {
    console.error('❌ Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};