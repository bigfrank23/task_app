// server.js (or your main file)
import express from 'express';
import connectDb from './utils/connectDb.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import http from "http";
import { initSocket } from './sockets/server.js';

// Import routes
import userRouter from './routes/user.route.js';
import profileRouter from './routes/profile.route.js';
import taskRouter from './routes/task.route.js';
import socialInteractions from './routes/social.route.js';
import followRoutes from './routes/follow.route.js';
import messageRoutes from './routes/message.route.js';
import notificationRoutes from './routes/notification.route.js';
dotenv.config();

const app = express();

app.set('trust proxy', 1);


// CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'https://taskflow-xi-seven.vercel.app', // Add your frontend URL here
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Todo App API is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Routes
app.use('/user', userRouter);
app.use('/user', profileRouter);
app.use('/task', taskRouter);
app.use('/socials', socialInteractions);
app.use('/follow', followRoutes);
app.use('/messages', messageRoutes);
app.use('/notifications', notificationRoutes);

// Start late task checker
import { startLateTaskChecker } from './utils/taskLateChecker.js';
startLateTaskChecker();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = initSocket(server);

// Connect to database
connectDb();

// Use PORT from environment or default to 8000
const PORT = process.env.PORT || 8000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.IO ready`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Error handlers
process.on("unhandledRejection", (reason, promise) => {
  console.error("UNHANDLED REJECTION:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("UNCAUGHT EXCEPTION:", error);
  process.exit(1);
});

export default app;