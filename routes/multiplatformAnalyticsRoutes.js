import express from "express";
import * as controller from "../controllers/multiplatformAnalyticsController.js";
import { requireAuth } from "../middleware/auth.js";
const router = express.Router(); const auth = requireAuth();
export const accountRoutes = express.Router(); accountRoutes.get("/:account_id/growth", auth, controller.accountGrowth); accountRoutes.get("/:account_id/predictions", auth, controller.accountPredictions); accountRoutes.get("/:account_id/competitors", auth, controller.accountCompetitors);
export const competitorRoutes = express.Router(); competitorRoutes.post("/compare", auth, controller.compare);
export const postRoutes = express.Router(); postRoutes.get("/:post_id/analytics", auth, controller.postAnalytics); postRoutes.get("/:post_id/seo", auth, controller.postSeo); postRoutes.get("/:post_id/prediction", auth, controller.postPrediction);
export default router;
