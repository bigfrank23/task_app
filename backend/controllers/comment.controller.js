// controllers/comment.controller.js
import Comment from "../models/comment.model.js";
import Reply from "../models/reply.model.js";
import cloudinary from "../utils/cloudinary.js";
import { toggleReaction } from "../utils/toggleReaction.js";
import { generateBlurhash, getImageDimensions } from "../utils/imageProcessor.js";

// Helper: Upload file to Cloudinary with metadata extraction for images
const uploadFile = async (file, folder) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Determine file type
      let fileType = "file";
      if (file.mimetype.startsWith("image")) {
        fileType = "image";
      } else if (file.mimetype.startsWith("video")) {
        fileType = "video";
      }

      // For images, get dimensions and blurhash
      let width = null;
      let height = null;
      let blurhash = null;

      if (fileType === "image") {
        const dimensions = await getImageDimensions(file.buffer);
        width = dimensions.width;
        height = dimensions.height;
        blurhash = await generateBlurhash(file.buffer);
      }

      // Upload to cloudinary
      cloudinary.uploader.upload_stream(
        { folder, resource_type: "auto" },
        (err, result) => {
          if (err) return reject(err);
          resolve({
            url: result.secure_url,
            type: fileType,
            filename: file.originalname,
            size: file.size,
            width,
            height,
            blurhash,
          });
        }
      ).end(file.buffer);
    } catch (error) {
      reject(error);
    }
  });
};

// Add comment
export const addComment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    console.log(taskId);
    console.log(text);
    console.log(userId);
    

    if (!text?.trim() && !req.files?.length) {
      return res.status(400).json({
        success: false,
        message: "Comment text or attachment required",
      });
    }

    // Upload attachments
    let attachments = [];
    if (req.files?.length) {
      attachments = await Promise.all(
        req.files.map((file) => uploadFile(file, "todo_app/comments"))
      );
    }

    // Create comment
    const comment = await Comment.create({
      task: taskId,
      author: userId,
      text: text?.trim() || "",
      attachments,
    });

    await comment.populate("author", "displayName userImage");

    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get comments (with reply count)
export const getComments = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    console.log('📥 GET comments request:', { taskId, page, limit });

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const comments = await Comment.find({ task: taskId, deleted: false })
      .populate("author", "displayName userImage")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    console.log('📤 Sending comments:', comments.length);

    // Get reply counts for each comment
    const commentIds = comments.map((c) => c._id);
    const replyCounts = await Reply.aggregate([
      { $match: { comment: { $in: commentIds }, deleted: false } },
      { $group: { _id: "$comment", count: { $sum: 1 } } },
    ]);

    const replyCountMap = {};
    replyCounts.forEach((rc) => {
      replyCountMap[rc._id.toString()] = rc.count;
    });

    comments.forEach((c) => {
      c.replyCount = replyCountMap[c._id.toString()] || 0;
    });

    const total = await Comment.countDocuments({ task: taskId, deleted: false });

    // ✅ Add no-cache headers
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');

    res.json({
      success: true,
      data: comments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        total,
      },
    });
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete comment
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    if (comment.author.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    comment.deleted = true;
    comment.text = "[deleted]";
    comment.attachments = [];
    await comment.save();

    res.json({ success: true });
  } catch (error) {
    console.error("Delete comment error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// React to comment
export const reactToComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { reactionType } = req.body;
    const userId = req.user.id;

    const allowed = ["like", "love", "celebrate", "dislike"];
    if (!allowed.includes(reactionType)) {
      return res.status(400).json({ success: false, message: "Invalid reaction" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    toggleReaction({
      reactions: comment.reactions,
      reactionType,
      userId,
    });

    await comment.save();

    res.json({ success: true, data: comment.reactions });
  } catch (error) {
    console.error("React to comment error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add reply
export const addReply = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    if (!text?.trim() && !req.files?.length) {
      return res.status(400).json({
        success: false,
        message: "Reply text or attachment required",
      });
    }

    // Upload attachments
    let attachments = [];
    if (req.files?.length) {
      attachments = await Promise.all(
        req.files.map((file) => uploadFile(file, "todo_app/replies"))
      );
    }

    // Create reply
    const reply = await Reply.create({
      comment: commentId,
      author: userId,
      text: text?.trim() || "",
      attachments,
    });

    await reply.populate("author", "displayName userImage");

    res.status(201).json({ success: true, data: reply });
  } catch (error) {
    console.error("Add reply error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get replies
export const getReplies = async (req, res) => {
  try {
    const { commentId } = req.params;

    const replies = await Reply.find({ comment: commentId, deleted: false })
      .populate("author", "displayName userImage")
      .sort({ createdAt: 1 })
      .lean();

    res.json({ success: true, data: replies });
  } catch (error) {
    console.error("Get replies error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete reply
export const deleteReply = async (req, res) => {
  try {
    const { replyId } = req.params;
    const userId = req.user.id;

    const reply = await Reply.findById(replyId);
    if (!reply) {
      return res.status(404).json({ success: false, message: "Reply not found" });
    }

    if (reply.author.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    reply.deleted = true;
    reply.text = "[deleted]";
    reply.attachments = [];
    await reply.save();

    res.json({ success: true });
  } catch (error) {
    console.error("Delete reply error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// React to reply
export const reactToReply = async (req, res) => {
  try {
    const { replyId } = req.params;
    const { reactionType } = req.body;
    const userId = req.user.id;

    const allowed = ["like", "love", "celebrate", "dislike"];
    if (!allowed.includes(reactionType)) {
      return res.status(400).json({ success: false, message: "Invalid reaction" });
    }

    const reply = await Reply.findById(replyId);
    if (!reply) {
      return res.status(404).json({ success: false, message: "Reply not found" });
    }

    toggleReaction({
      reactions: reply.reactions,
      reactionType,
      userId,
    });

    await reply.save();

    res.json({ success: true, data: reply.reactions });
  } catch (error) {
    console.error("React to reply error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};