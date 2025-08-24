import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { Chat } from "../models/chat.model.js";
import { Message } from "../models/message.model.js";

const getMyChats = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const chats = await Chat.find({ participants: userId })
        .populate("participants", "fullname")
        .populate("item", "itemName images")
        .sort({ updatedAt: -1 });

    // Return a standard JSON object
    return res.status(200).json({
        success: true,
        data: chats,
        message: "User chats fetched successfully."
    });
});


const getChatMessages = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    const userId = req.user._id;

    // First, verify the user is part of this chat for security
    const chat = await Chat.findOne({ _id: chatId, participants: userId });
    if (!chat) {
        throw new ApiError(404, "Chat not found or you do not have access.");
    }

    const messages = await Message.find({ chatId: chatId })
        .populate("sender", "fullname")
        .sort({ createdAt: 'asc' }); // Show oldest messages first

    // Return a standard JSON object
    return res.status(200).json({
        success: true,
        data: messages,
        message: "Messages fetched successfully."
    });
});


const getChatDetails = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findOne({ _id: chatId, participants: userId })
        .populate("participants", "fullname")
        .populate("item", "itemName");

    if (!chat) {
        throw new ApiError(404, "Chat not found or you do not have access.");
    }

    return res.status(200).json({
        success: true,
        data: chat,
        message: "Chat details fetched successfully."
    });
});


export { getMyChats, getChatMessages, getChatDetails  };
