import express from "express";
import * as controller from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";
const router = express.Router();
router.post("/register", controller.register); router.post("/login", controller.login); router.post("/forgot-password", controller.forgotPassword); router.post("/reset-password", controller.resetPassword); router.post("/logout", requireAuth(), controller.logout); router.get("/profile", requireAuth(), controller.profile); router.put("/profile", requireAuth(), controller.updateProfile);
export default router;
