import express from "express";
import {
  createTask,
  getTasks,
  getArchivedTasks,
  updateTaskStatus,
  updateTask,
  deleteTask,
  archiveTask,
  upload,
  getAllTasks,
  checkLateTasks
} from "../controllers/task.controller.js";
import { verifyToken } from "../middleware/taskMiddleware.js";
import { rateLimiter } from "../middleware/taskMiddleware.js";

const router = express.Router();

// Apply authentication to all routes
router.use(verifyToken);

// Rate limiting for write operations
const writeRateLimit = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50 // 50 requests per window
});

// Task CRUD operations
router.post("/", writeRateLimit, upload.array('attachments', 10), createTask);
router.get("/", getAllTasks);
router.get("/tasks", getTasks);
router.get("/archived", getArchivedTasks);
router.post('/check-late', verifyToken, checkLateTasks);
router.patch("/:taskId", writeRateLimit, updateTask);
router.patch("/:taskId/status", writeRateLimit, updateTaskStatus);
router.patch("/:taskId/archive", writeRateLimit, archiveTask);
router.delete("/:taskId", writeRateLimit, deleteTask);

export default router;