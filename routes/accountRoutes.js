import express from "express";
import * as controller from "../controllers/accountController.js";
import { rolesRequired, requireAuth } from "../middleware/auth.js";
const router = express.Router(); const member = rolesRequired("admin", "member");
router.get("", ...member, controller.getAccounts); router.post("/youtube", ...member, controller.connectYoutube); router.get("/instagram/oauth-url", ...member, controller.instagramOAuth); router.get("/facebook/oauth-url", ...member, controller.facebookOAuth); router.get("/tiktok/oauth-url", ...member, controller.tiktokOAuth); router.get("/oauth-callback", requireAuth({ optional: true }), controller.oauthCallback); router.post("/oauth-callback", requireAuth({ optional: true }), controller.oauthCallback); router.delete("/:account_id", ...member, controller.deleteAccount); router.post("/:account_id/sync", ...member, controller.syncAccount); router.get("/export", ...rolesRequired("admin"), controller.exportAccounts);
export default router;
