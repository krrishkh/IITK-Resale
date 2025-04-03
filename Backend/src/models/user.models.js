import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { ApiError } from "../utils/ApiError.utils.js";
import jwt from "jsonwebtoken"

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

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
   try {
     const aToken = jwt.sign(
         {
             _id : this._id,
             username : this.username,
             email : this.email,
             fullname : this.fullname
         },
         process.env.ACCESS_TOKEN_SECRET,
         {
             expiresIn : process.env.ACCESS_TOKEN_EXPIRY
         }
     )
     return aToken;
   } catch (error) {
    console.log("error while generating access token", error)
    throw new ApiError(500, "access token generation failed")
   }
}

userSchema.methods.generateRefreshToken = function(){
    try {
        const rToken=  jwt.sign(
            {
                _id: this._id,
                
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY
            }
        )
        return rToken
    } catch (error) {
        console.log("error while generating refresh token", error)
        throw new ApiError(500, "refresh token generation failed")
    }
}


export const User = mongoose.model("User", userSchema);