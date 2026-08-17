import express from "express";
import * as controller from "../controllers/videoAnalyticsController.js";
import { requireAuth } from "../middleware/auth.js";
const router = express.Router(); const auth = requireAuth();
router.get("/:video_id/history", auth, controller.history); router.get("/:video_id/analytics", auth, controller.analytics); router.get("/:video_id/seo", auth, controller.seoAnalysis); router.get("/:video_id/prediction", auth, controller.prediction); router.get("/:video_id/viral-score", auth, controller.viralScore);
export default router;
