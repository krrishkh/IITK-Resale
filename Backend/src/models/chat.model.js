import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema({
    participants: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }],
    item: {
        type: Schema.Types.ObjectId,
        ref: "Item",
        required: true,
    },
}, { timestamps: true });

export const Chat = mongoose.model("Chat", chatSchema);