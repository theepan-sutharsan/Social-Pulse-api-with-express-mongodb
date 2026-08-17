import express from "express";
import * as controller from "../controllers/channelAnalyticsController.js";
import { requireAuth } from "../middleware/auth.js";
const router = express.Router(); const auth = requireAuth();
router.get("/:channel_id", auth, controller.detail); router.get("/:channel_id/history", auth, controller.history); router.get("/:channel_id/growth", auth, controller.growth); router.get("/:channel_id/revenue", auth, controller.channelRevenue); router.get("/:channel_id/predictions", auth, controller.predictions); router.get("/:channel_id/top-videos", auth, controller.topVideos);
export default router;
