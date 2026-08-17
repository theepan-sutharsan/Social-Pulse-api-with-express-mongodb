import express from "express";
import * as controller from "../controllers/adminUserController.js";
import { rolesRequired } from "../middleware/auth.js";
const router = express.Router(); const admin = rolesRequired("admin");
router.get("", ...admin, controller.getAllUsers); router.get("/export", ...admin, controller.exportUsers); router.get("/:user_id", ...admin, controller.getUser); router.put("/:user_id", ...admin, controller.updateUser); router.post("/:user_id/deactivate", ...admin, controller.deactivateUser);
export default router;
