import express from "express";
import * as controller from "../controllers/videoAnalysisController.js";
import { rolesRequired } from "../middleware/auth.js";
const router = express.Router(); const member = rolesRequired("admin", "member");
router.post("/analyze", ...member, controller.analyze); router.get("/history", ...member, controller.history); router.post("/transcript", ...member, controller.getTranscript); router.get("/:analysis_id", ...member, controller.detail); router.delete("/:analysis_id", ...member, controller.remove);
export default router;
