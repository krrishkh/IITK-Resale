import { Item } from "../models/item.models.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { PurchaseRequest } from "../models/purchaseRequest.models.js";

import { Chat } from "../models/chat.model.js";
import { Message } from "../models/message.model.js";
import { getIO } from "../socket.js";


const getAllItems = asyncHandler(async (req, res) => {
    try {
        const items = await Item.find({ status: { $ne: "sold" } }).populate("owner", "fullname contact email");; // Fetch only unsold items
        res.status(200).json({
            success: true,
            items,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch items",
        });
    }
});


const requestPurchase = asyncHandler( async(req, res) => {
    const { itemId, message } = req.body;
    const buyerId = req.user._id;
    
    const item = await Item.findById(itemId);

    console.log(item)

    if(!item){
        throw new ApiError(500, "Item not found");
    }

    if (item.owner.toString() === buyerId.toString()) {
        throw new ApiError(400, "You cannot request to buy your own item");
    }

    // Check if the buyer has already sent a request for this item
    const existingRequest = await PurchaseRequest.findOne({
        item: itemId,
        buyer: buyerId,
        status: "pending",
    });

    if (existingRequest) {
        throw new ApiError(400, "You have already sent a request for this item");
    }

    const purchaseRequest = await PurchaseRequest.create({
        item: itemId,
        buyer: buyerId,
        seller: item.owner,
        message,
    });

    return res
    .status(201)
    .json({
        success: true,
        message: "Purchase request sent successfully",
        request: purchaseRequest,
    })
    
});


const getItemById = asyncHandler( async (req, res) => {
    try {
      const item = await Item.findById(req.params.id).populate("owner", "fullname email contact");
      if (!item) {
        return res.status(404).json({ success: false, message: "Item not found" });
      }
  
      res.status(200).json({
        success: true,
        item,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
    }
});


const startChatOrSendMessage = asyncHandler(async (req, res) => {
    const { itemId, message } = req.body;
    const buyerId = req.user._id;

    if (!message || !message.trim()) {
        throw new ApiError(400, "Message content cannot be empty.");
    }

    const item = await Item.findById(itemId);
    if (!item) {
        throw new ApiError(404, "Item not found");
    }

    const sellerId = item.owner;

    if (buyerId.equals(sellerId)) {
        throw new ApiError(400, "You cannot send a message about your own item.");
    }

    let chat = await Chat.findOne({
        item: itemId,
        participants: { $all: [buyerId, sellerId] }
    });

    if (!chat) {
        chat = await Chat.create({
            item: itemId,
            participants: [buyerId, sellerId]
        });
    }

    const newMessage = await Message.create({
        chatId: chat._id,
        sender: buyerId,
        content: message
    });

    const populatedMessage = await Message.findById(newMessage._id).populate("sender", "fullname username");

    const io = getIO();
    io.to(chat._id.toString()).emit("receiveMessage", populatedMessage);


    return res.status(201).json({
        success: true,
        data: { 
            chatId: chat._id, 
            message: populatedMessage 
        },
        message: "Message sent successfully."
    });
});



export { 
    getAllItems, 
    requestPurchase,
    getItemById,
    startChatOrSendMessage
};
