import { Server } from "socket.io";
import { Message } from "./models/message.model.js"; // Adjust the path to your Message model as needed

let io;

export const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin:  process.env.CORS_ORIGIN,
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log("✅ A user connected:", socket.id);

        // --- Event to join a specific chat room ---
        socket.on("joinRoom", (chatId) => {
            if (chatId) {
                socket.join(chatId);
                console.log(`User ${socket.id} joined room ${chatId}`);
            }
        });

        // --- Event for receiving, saving, and broadcasting a message ---
        socket.on("sendMessage", async (data) => {
            if (!data || !data.chatId || !data.message) {
                console.error("Invalid message data received");
                return;
            }

            try {
                // 1. Save the incoming message to the database
                const newMessage = await Message.create({
                    chatId: data.chatId,
                    sender: data.message.sender._id, // Get sender ID from the message data
                    content: data.message.content
                });

                // 2. Populate the sender's details for the full message object
                const populatedMessage = await Message.findById(newMessage._id).populate("sender", "fullname username");

                // 3. Broadcast the final, saved message to everyone in the room
                socket.to(data.chatId).emit("receiveMessage", populatedMessage);

            } catch (error) {
                console.error("Socket 'sendMessage' event error:", error);
                // Optionally, emit an error back to the sender
                socket.emit("sendMessageError", { message: "Could not send message." });
            }
        });

         // Listen for when a user starts typing
        socket.on("typing", (data) => {
            // Broadcast to everyone else in the room that this user is typing
            socket.to(data.chatId).emit("userTyping", { userId: data.userId });
        });

        // Listen for when a user stops typing
        socket.on("stopTyping", (data) => {
            // Broadcast to everyone else that the user has stopped
            socket.to(data.chatId).emit("userStoppedTyping");
        });

        socket.on("disconnect", () => {
            console.log("❌ User disconnected:", socket.id);
        });
    });

    return io;
};

// --- Function to get the initialized Socket.IO instance ---
export const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO not initialized!");
    }
    return io;
};
