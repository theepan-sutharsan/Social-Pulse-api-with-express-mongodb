import express from "express";
import * as controller from "../controllers/videoController.js";
import { rolesRequired } from "../middleware/auth.js";
const router = express.Router(); const member = rolesRequired("admin", "member");
router.get("", ...member, controller.getVideos); router.get("/export", ...member, controller.exportVideos); router.get("/:video_id", ...member, controller.getVideo); router.get("/:video_id/metrics", ...member, controller.getVideoMetrics); router.post("/:video_id/thumbnail-analysis", ...member, controller.thumbnailCreate); router.get("/:video_id/thumbnail-analysis", ...member, controller.thumbnailGet);
export default router;
