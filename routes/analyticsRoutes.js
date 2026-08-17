import express from "express";
import * as controller from "../controllers/analyticsController.js";
import { rolesRequired } from "../middleware/auth.js";
const router = express.Router(); const member = rolesRequired("admin", "member");
router.get("/platform-breakdown", ...member, controller.platformBreakdown); router.get("/top-videos", ...member, controller.topVideos); router.get("/engagement-trends", ...member, controller.engagementTrends);
export default router;
