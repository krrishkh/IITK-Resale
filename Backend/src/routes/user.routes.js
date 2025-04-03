import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { addItem } from "../controllers/Item.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { requestPurchase } from "../controllers/buyer.controllers.js";
import { getSellerRequest, respondToRequest } from "../controllers/seller.controllers.js";
import { getAllItems } from "../controllers/buyer.controllers.js";


const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT ,logoutUser);
router.route("/addItem").post(verifyJWT, upload.array("images", 5) ,addItem);
router.route("/request").post(verifyJWT, requestPurchase);
router.route("/respond").post(verifyJWT, respondToRequest);

router.route("/seller-requests").get(verifyJWT, getSellerRequest);
router.route("/allItems").get(verifyJWT, getAllItems)

export default  router ;