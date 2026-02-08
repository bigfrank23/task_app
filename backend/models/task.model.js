import mongoose from "mongoose";

const StatusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["pending", "in_progress", "late", "completed"],
      required: true,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { _id: false },
);

const attachmentSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String, // Cloudinary public ID for deletion
    },
    type: {
      type: String,
      enum: ["image", "video", "file"],
      required: true,
    },
    size: Number,
    filename: String,
    width: Number,      // ✅ Add this
    height: Number,     // ✅ Add this
    blurhash: String,     // ✅ Add this for image attachments
  },
  { _id: false },
);

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },

    attachments: {
      type: [attachmentSchema],
      validate: {
        validator: function (v) {
          return v.length <= 10; // Max 10 attachments
        },
        message: "Cannot have more than 10 attachments",
      },
    },

    status: {
      type: String,
      enum: {
        values: ["pending", "in_progress", "late", "completed"],
        message: "{VALUE} is not a valid status",
      },
      default: "pending",
      index: true,
    },

    statusHistory: {
      type: [StatusHistorySchema],
      default: [],
    },

    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high"],
        message: "{VALUE} is not a valid priority",
      },
      default: "medium",
      index: true,
    },

    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
      index: true,
      // validate: {
      //   validator: function (v) {
      //     // Only validate on creation
      //     if (this.isNew) {
      //       return v >= new Date();
      //     }
      //     return true;
      //   },
      //   message: "Due date must be in the future",
      // },
    },

    completedAt: {
      type: Date,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Task must be assigned to a user"],
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },

    tags: [
      {
        type: String,
        trim: true,
        maxlength: 30,
      },
    ],
    //   likes: {
    //   type: Number,
    //   default: 0
    // },
    // likedBy: [{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User'
    // }],
    reactions: {
      like: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      love: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      celebrate: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      dislike: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },

    saves: {
      type: Number,
      default: 0,
    },
    savedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    comments: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          default: "",
        },
        attachments: [
          {
            // ✅ Array of objects, NOT array of strings
            url: {
              type: String,
              required: true,
            },
            type: {
              type: String,
              enum: ["image", "video", "file"],
              required: true,
            },
            filename: {
              type: String,
              required: true,
            },
            size: Number,
            width: Number,      // ✅ Add
            height: Number,     // ✅ Add
            blurhash: String, 
          },
        ],
        deleted: {
          type: Boolean,
          default: false,
        },
        likes: {
          type: Number,
          default: 0,
        },
        likedBy: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
        replies: [
          {
            author: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
              required: true,
            },
            text: String,
            attachments: [
              {
                url: {
                  type: String,
                  required: true,
                },
                type: {
                  type: String,
                  enum: ["image", "video", "file"],
                  required: true,
                },
                filename: {
                  type: String,
                  required: true,
                },
                size: Number,
                width: Number,      // ✅ Add
                height: Number,     // ✅ Add
                blurhash: String, 
              },
            ],
            deleted: {
              type: Boolean,
              default: false,
            },
            reactions: {
              like: [
                {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "User",
                },
              ],
              love: [
                {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "User",
                },
              ],
              celebrate: [
                {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "User",
                },
              ],
              dislike: [
                {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "User",
                },
              ],
            },
            createdAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Compound indexes for common queries
TaskSchema.index({ assignedTo: 1, status: 1, isArchived: 1 });
TaskSchema.index({ assignedTo: 1, dueDate: 1 });
TaskSchema.index({ createdBy: 1, createdAt: -1 });

// Virtual for checking if task is overdue
TaskSchema.virtual("isOverdue").get(function () {
  return (
    this.status !== "completed" &&
    this.status !== "late" &&
    this.dueDate < new Date()
  );
});

// Pre-save middleware to handle status changes
TaskSchema.pre("save", function () {
  // Auto-update completedAt when status changes to completed
  if (this.isModified("status")) {
    if (this.status === "completed" && !this.completedAt) {
      this.completedAt = new Date();
    } else if (this.status !== "completed") {
      this.completedAt = undefined;
    }
  }
});

// Static method to get user's task statistics
TaskSchema.statics.getUserStats = async function (userId) {
  const stats = await this.aggregate([
    {
      $match: {
        assignedTo: new mongoose.Types.ObjectId(userId),
        isArchived: false,
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const result = {
    total: 0,
    pending: 0,
    in_progress: 0,
    late: 0,
    completed: 0,
  };

  stats.forEach((stat) => {
    result[stat._id] = stat.count;
    result.total += stat.count;
  });

  return result;
};

// Instance method to add status history
TaskSchema.methods.updateStatus = function (newStatus, userId) {
  if (this.status === newStatus) return;

  this.statusHistory.push({
    status: newStatus,
    changedBy: userId,
    changedAt: new Date(),
  });

  this.status = newStatus;
};

export default mongoose.model("Task", TaskSchema);
