import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    fullname:
        {
            type: String,
            required: true,
            trim: true,
            index: true
        },
    username:
        {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
    email: 
        {
            type: String,
            required: true,
            trim: true,
            unique: true,
            match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,"Invalid Email"]
        },
    gender: 
        {
            type: String,
            enum: ["male", "female", "other" ],
            required: true,
            trim: true,
            lowercase: true,
        },
    contact:
        {
            type: Number,
            required: true,
            unique: true,
            trim: true,
            match: [/^\d{10}$/, "Invalid contact number! Must be 10 digits."]
        },
    address:
        {
            type: String,
            required: true
        },
    password: 
        {
            type: String,
            required: true,
        },
    avatar:
        {
            type: String,
        },
    buyProduct:
        [
            {
                type: Schema.Types.ObjectId,
                ref: "Item"
            }
        ],
    sellProduct:
        [
            {
                type: Schema.Types.ObjectId,
                ref: "Item"
            }
        ],
    refreshToken:
        {
            type: String
        }


},{ timestamps: true})



export const User = mongoose.model("User", userSchema);