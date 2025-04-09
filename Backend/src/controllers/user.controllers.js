import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.utils.js";



const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Error generating tokens:", error);
        throw new ApiError(500, error.message || "Something went wrong while generating access and refresh tokens");
    }
};

const registerUser = asyncHandler( async(req, res) => {
    try {
        const {fullname, username, email, contact, address, gender, password, confirmPassword } = req.body
    
        if(!fullname || !username || !email || !contact || !address || !gender || !password ){
            throw new ApiError(400, "All fields are required");
        }

        const existedUser = await User.findOne({
            $or : [{username}, {email}, {contact} ]
        })

        if(existedUser){
            throw new ApiError(401, "user already registered");
        }
        if(password!=confirmPassword){
            throw new ApiError(402, " password is not matching");
        }

        const newUser = await User.create({
            fullname,
            username:username.toLowerCase(),
            email,
            contact,
            address,
            gender,
            password,
            
        })

        const createdUser = await User.findById(newUser._id).select(
                "-password -refreshToken"
            )

        if(!createdUser){
            throw new ApiError(500, "Something Went Wrong");
        }

        return   res
        .status(201)
        .json({
            message: "User registered successfully",
            
        });
     
        

    } catch (error) {
        throw error
    }


});

const loginUser = asyncHandler( async(req, res) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier) {
          throw new ApiError(402, "Email or Username is required");
        }
        if (!password) {
          throw new ApiError(402, "Password is required");
        }
        
        // Determine if identifier is email or username
        const existedUser = await User.findOne({
          $or: [{ email: identifier }, { username: identifier }]
        });
    
    
        if(!existedUser){
            throw new ApiError(409, "User not registered");
        }
    
        const isPasswordValid = await existedUser.isPasswordCorrect(password)

        if(!isPasswordValid){
            throw new ApiError(401, "Invalid User credentials")
        }

        const {accessToken , refreshToken} = await generateAccessAndRefreshToken(existedUser._id)
        
        const loggedInUser = await User.findById(existedUser._id).select("-password -refreshToken")

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
           {
            message:    "User Logged in successfully"
           }
        )

     
    } catch (error) {
        throw error
    }

});

const logoutUser = asyncHandler( async(req, res) => {
    console.log(req.user)
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        {
            message: "user logged out successfully"
        }
    )

})

const getUserDetails = asyncHandler( async(req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password -refreshToken")
        if(!user){
            throw new ApiError(404, "User not found")
        }

        return res.status(200).json({
            message: "User details fetched successfully",
            user
        })
    } catch (error) {
        throw error
    }
});


export {
    registerUser,
    loginUser,
    logoutUser,
    getUserDetails


}