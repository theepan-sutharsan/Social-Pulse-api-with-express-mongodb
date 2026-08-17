import express from "express";
import * as controller from "../controllers/alertController.js";
import { rolesRequired } from "../middleware/auth.js";
const router = express.Router(); const member = rolesRequired("member");
router.get("", ...member, controller.getAlerts); router.patch("/:alert_id/read", ...member, controller.markAlertRead);
export default router;
