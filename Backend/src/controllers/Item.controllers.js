import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { Item } from "../models/item.models.js";


const addItem = asyncHandler( async(req, res) => {
    try {
        const { itemName, description, category, price, condition, negotiable, sellerRating } = req.body;

        // Ensure the required fields are present
        if (!itemName || !description || !category  || !price || !condition ) {
            throw new ApiError(400, "All required fields must be provided");
        }

        let imageUrls = [];
        if (req.files) {
            for (const file of req.files) {
                const result = await uploadOnCloudinary(file.path);
                imageUrls.push(result.url);
            }
        }

        // Create a new item
        const newItem = await Item.create({
            itemName,
            description,
            category,
            price,
            condition,
            negotiable,
            sellerRating,
            owner: req.user._id,
            images: imageUrls
        });

        return res
        .status(201)
        .json({
            success: true,
            message: "Item added successfully",
            item: newItem,
        });
    } catch (error) {
        throw new ApiError(500, error.message || "Failed to add item");
    }
})

const removeItem = asyncHandler( async(req, res) => {
    try {
        const { itemId } = req.params; // Get the item ID from the URL parameter

        if (!itemId) {
            throw new ApiError(400, "Item ID is required");
        }

        // Find the item in the database
        const item = await Item.findById(itemId);

        if (!item) {
            throw new ApiError(404, "Item not found");
        }

        // Ensure that only the owner can delete the item
        if (item.owner.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "Unauthorized: You can only delete your own items");
        }

        // Delete the item
        await Item.findByIdAndDelete(itemId);

        return res.status(200).json({
            success: true,
            message: "Item removed successfully",
        });

    } catch (error) {
        throw new ApiError(500, error.message || "Failed to remove item");
    }
})

export {
    addItem,
    removeItem
}