import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler( async(req, res, next) => {
    try {
        // console.log(req.headers.cookie)  --> this is a string having both token 
        
        const cookies = req.headers.cookie? Object.fromEntries(req.headers.cookie.split("; ").map(c => c.split("="))): {};  //convert string into object
        const token = cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

       if(!token) {
          throw new ApiError(401, "Access Token is required");
       }
      
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user){
            throw new ApiError(401, "Invalid Access Token");
        }
    
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access Token")
    }
    
})