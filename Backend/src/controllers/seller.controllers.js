import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { PurchaseRequest } from "../models/purchaseRequest.models.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { Item } from "../models/item.models.js";



const getSellerRequest = asyncHandler( async(req, res) => {
    const sellerId = req.user._id;
    const requests = await PurchaseRequest.find({ seller: sellerId })
        .populate("item", "itemName description price")
        .populate("buyer", "name contact email");

    return res.status(200).json({
        success: true,
        requests,
    });
})

const respondToRequest = asyncHandler(async (req, res) => {
    const { requestId, response } = req.body; // response = "accepted" or "rejected"

    if (!["accepted", "rejected"].includes(response)) {
        throw new ApiError(400, "Invalid response. Must be 'accepted' or 'rejected'");
    }

    const purchaseRequest = await PurchaseRequest.findById(requestId);
    if (!purchaseRequest) throw new ApiError(404, "Purchase request not found");

    if (purchaseRequest.seller.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized to respond to this request");
    }

    purchaseRequest.status = response;
    await purchaseRequest.save();

    if (response === "accepted") {
        // Mark item as sold
        await Item.findByIdAndUpdate(purchaseRequest.item, { status: "sold" });

        // Reject all other pending requests for the same item
        await PurchaseRequest.updateMany(
            { item: purchaseRequest.item, status: "pending" },
            { status: "rejected" }
        );
    }

    return res.status(200).json({
        success: true,
        message: `Request ${response} successfully`,
    });
});

export {
    getSellerRequest,
    respondToRequest
}