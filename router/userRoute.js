import express from "express"
import { register, login, logout, getUser, updateProfile, updatePassword, getUserForPortfolio } from "../controller/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.get("/logout", isAuthenticated, logout)
router.get("/me", isAuthenticated, getUser)
router.put("/update/profile", isAuthenticated, updateProfile)
router.put("/update/password", isAuthenticated, updatePassword)
router.get("/portfolio", getUserForPortfolio)
 
export default router;