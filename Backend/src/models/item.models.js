import mongoose, { Schema } from "mongoose";


const itemSchema = new Schema({
    itemName:
        {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
    description:
        {
            type: String,
            required: true,
        },
    category:
        {
            type: String,
            required: true,
        },
    owner:
        {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    images:
        [
            {
                type: String,
                required: true,
            }
        ],
    price:
        {
            type: Number,
            required: true,
        },
    status:
        {
            type: String,
            enum: ["sold", "active"],
            default: "active",
        },
    condition:
        {
            type: String,
            enum: ["new", "used"],
            required: true,
        },
    soldTo:
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    sellerRating:
        {
            type: Number,
            min: 1,
            max: 5,
        },
    negotiable: 
        {
            type: Boolean,
            default: false,
        },

},{timestamps: true})

export const Item = mongoose.model("Item", itemSchema)