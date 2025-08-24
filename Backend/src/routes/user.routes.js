import { Router } from "express";
import { loginUser, logoutUser, registerUser, verifyOtp } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { addItem } from "../controllers/Item.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { requestPurchase, startChatOrSendMessage } from "../controllers/buyer.controllers.js";
import { getSellerRequest, respondToRequest } from "../controllers/seller.controllers.js";
import { getAllItems } from "../controllers/buyer.controllers.js";
import { getItemById } from "../controllers/buyer.controllers.js";
import { getMyItems } from "../controllers/seller.controllers.js";
import { getUserDetails } from "../controllers/user.controllers.js";
import { getMyRequests } from "../controllers/seller.controllers.js";
import { getMyChats, getChatMessages, getChatDetails } from "../controllers/chat.controllers.js";``

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/verify-otp").post(verifyOtp);
router.route("/logout").post(verifyJWT ,logoutUser);
router.route("/addItem").post(verifyJWT, upload.array("images", 5) ,addItem);
router.route("/request").post(verifyJWT, startChatOrSendMessage);
router.route("/respond").post(verifyJWT, respondToRequest);

router.route("/seller-requests").get(verifyJWT, getSellerRequest);
router.route("/allItems").get(verifyJWT, getAllItems)
router.route("/item/:id").get(verifyJWT, getItemById);
router.route("/getMyItems").get(verifyJWT, getMyItems);
router.route("/getUserDetails").get(verifyJWT, getUserDetails);
router.route("/getMyRequests").get(verifyJWT, getMyRequests);
router.route("/my-chats").get(verifyJWT, getMyChats);
router.route("/chats/:chatId/messages").get(verifyJWT, getChatMessages);
router.route("/chats/:chatId").get(verifyJWT, getChatDetails);


export default  router ;