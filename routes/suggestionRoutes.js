import express from "express";
import * as controller from "../controllers/suggestionController.js";
import { rolesRequired } from "../middleware/auth.js";
const router = express.Router(); const member = rolesRequired("admin", "member");
router.post("", ...member, controller.generate); router.get("", ...member, controller.list); router.get("/export", ...member, controller.exportSuggestions); router.get("/:suggestion_id", ...member, controller.get); router.delete("/:suggestion_id", ...member, controller.remove); router.get("/:suggestion_id/pdf", ...member, controller.exportOne);
export default router;
