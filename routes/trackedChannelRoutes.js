import express from "express";
import * as controller from "../controllers/trackedChannelController.js";
import { rolesRequired } from "../middleware/auth.js";
const router = express.Router(); const member = rolesRequired("admin", "member");
router.get("", ...member, controller.getTrackedChannels); router.post("", ...member, controller.createTrackedChannel); router.get("/export", ...member, controller.exportTrackedChannels); router.post("/import", ...member, controller.importTrackedChannels); router.get("/:channel_id", ...member, controller.getTrackedChannel); router.delete("/:channel_id", ...member, controller.deleteTrackedChannel); router.post("/:channel_id/sync", ...member, controller.syncTrackedChannel);
export default router;
