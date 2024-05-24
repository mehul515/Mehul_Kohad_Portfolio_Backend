import express from "express";
import { deleteMessage, getAllMessages, sendMessage } from "../controller/message.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

router.post("/send", sendMessage);
router.get("/getAll", isAuthenticated, getAllMessages);
router.delete("/delete/:id", isAuthenticated, deleteMessage);
 
export default router;
