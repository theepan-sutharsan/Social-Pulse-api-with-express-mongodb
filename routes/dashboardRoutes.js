import express from "express";
import * as controller from "../controllers/dashboardController.js";
import { rolesRequired } from "../middleware/auth.js";
const router = express.Router(); const member = rolesRequired("admin", "member");
router.get("/dashboard", ...member, controller.dashboard); router.get("/dashboard/pdf", ...member, controller.dashboardPdf);
export default router;
