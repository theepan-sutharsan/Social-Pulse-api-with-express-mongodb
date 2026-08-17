import express from "express";
import * as controller from "../controllers/youtubeAudienceController.js";
import { rolesRequired } from "../middleware/auth.js";
const router = express.Router(); const member = rolesRequired("admin", "member");
router.post("/estimate", ...member, controller.estimate); router.post("/analyze", ...member, controller.start); router.get("/history", ...member, controller.history); router.get("/runs/:run_id", ...member, controller.getRun); router.delete("/runs/:run_id", ...member, controller.deleteRun); router.get("/runs/:run_id/comments", ...member, controller.comments); router.get("/runs/:run_id/export.csv", ...member, controller.exportCsv); router.get("/runs/:run_id/export.pdf", ...member, controller.exportPdf); router.delete("/videos/:video_id/comments", ...member, controller.purgeComments);
export default router;
