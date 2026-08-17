import { env } from "../config/env.js";
import User from "../models/User.js";
import { verifyAccessToken } from "../utils/auth.js";

function tokenFromRequest(req) {
  const header = req.get("authorization") || "";
  return header.startsWith("Bearer ") ? header.slice(7) : null;
}

export function requireAuth(options = {}) {
  return async (req, res, next) => {
    const token = tokenFromRequest(req);
    if (!token) {
      if (options.optional) return next();
      return res.status(401).json({ msg: "Missing Authorization Header" });
    }
    try {
      const payload = verifyAccessToken(token);
      const user = await User.findOne({ id: Number(payload.sub) });
      if (!user || !user.is_active) return res.status(401).json({ msg: "Token has been revoked" });
      req.user = user;
      return next();
    } catch {
      if (options.optional) return next();
      return res.status(401).json({ msg: "Token has expired" });
    }
  };
}

export function rolesRequired(...roles) {
  return [requireAuth(), (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "User not found." });
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: "Forbidden. Insufficient permissions." });
    next();
  }];
}

export function jwtOrApiKeyRequired() {
  return requireAuth();
}

export function currentUser(req) { return req.user; }

