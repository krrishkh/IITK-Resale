import mongoose from "mongoose";

const purchaseRequestSchema = new mongoose.Schema({
    item: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item",
            required: true,
        },
    buyer: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    seller: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item",
            required: true,
        },
    message: 
        {
            type: String,
            required: true,
        },
    status:
        {
            type: String,
            enum: ["accepted", "rejected", "pending"],
            default: "pending",
        },


}, {timestamps: true})

export const PurchaseRequest = mongoose.model("PurchaseRequest", purchaseRequestSchema);