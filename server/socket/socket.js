// Filename: server/socket/socket.js

import { Server } from 'socket.io';
import http from 'http';

// This map will store which user is connected to which socket
// e.g., { userId: socketId, anotherUserId: anotherSocketId }
const userSocketMap = {};

const initializeSocket = (app) => {
    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: ["http://localhost:5173", "http://localhost:5174"], // Allow requests from your frontend
            methods: ["GET", "POST"]
        }
    });

    // Main connection event
    io.on('connection', (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId && userId !== "undefined") {
            userSocketMap[userId] = socket.id;
            console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
        }

        // Emit 'getOnlineUsers' event to all clients to update online status
        io.emit("getOnlineUsers", Object.keys(userSocketMap));

        // Listen for 'sendMessage' event from a client
        socket.on("sendMessage", ({ recipientId, message }) => {
            const recipientSocketId = userSocketMap[recipientId];
            if (recipientSocketId) {
                // If the recipient is online, send the message to their specific socket
                io.to(recipientSocketId).emit("newMessage", message);
            }
        });

        // Disconnect event
        socket.on('disconnect', () => {
            // Find which user disconnected and remove them from the map
            const disconnectedUserId = Object.keys(userSocketMap).find(key => userSocketMap[key] === socket.id);
            if (disconnectedUserId) {
                delete userSocketMap[disconnectedUserId];
                console.log(`User disconnected: ${disconnectedUserId}`);
                io.emit("getOnlineUsers", Object.keys(userSocketMap));
            }
        });
    });

    return { io, server };
};

export { initializeSocket, userSocketMap };