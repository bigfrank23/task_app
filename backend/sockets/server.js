// sockets/server.js
import { Server } from "socket.io";
import { setupSocket } from "./socket.js"; // Your existing handler

export const initSocket = (server) => {
  const allowedOrigins = [
  'http://localhost:5173',
  'https://smoothtaskflow.vercel.app',
];

  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  setupSocket(io); // Your existing setupSocket function
  console.log("✅ Socket.IO server initialized on port 8000");
  
  return io;
};
