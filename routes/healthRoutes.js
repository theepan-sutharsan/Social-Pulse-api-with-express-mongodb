import express from "express";
import { getDatabaseStatus } from "../config/db.js";
const router = express.Router();
router.get("/health", (_req, res) => { const db = getDatabaseStatus(); return res.status(db === "ok" ? 200 : 503).json({ status: db === "ok" ? "ok" : "degraded", db, app: "Social Pulse API", version: "1.0.0" }); }); router.get("/", (_req, res) => res.json({ message: "Welcome to Social Pulse API v1.0.0" }));
export default router;
