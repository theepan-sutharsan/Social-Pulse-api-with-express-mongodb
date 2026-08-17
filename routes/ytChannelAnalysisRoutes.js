import express from "express";
import * as controller from "../controllers/ytChannelAnalysisController.js";
import { rolesRequired } from "../middleware/auth.js";
const router = express.Router(); const member = rolesRequired("admin", "member");
router.post("/start", ...member, controller.start); router.get("/history", ...member, controller.history); router.get("/:run_id", ...member, controller.detail); router.delete("/:run_id", ...member, controller.remove);
export default router;
