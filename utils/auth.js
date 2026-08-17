import crypto from "node:crypto";
import { env } from "../config/env.js";

const base64url = (value) => Buffer.from(value).toString("base64url");
const parseTtl = (value) => { const match = String(value).match(/^(\d+)([smhd])?$/); if (!match) return 86400; const factor = { s: 1, m: 60, h: 3600, d: 86400, undefined: 1 }[match[2]]; return Number(match[1]) * factor; };
function sign(payload, secret, ttl) { const now = Math.floor(Date.now() / 1000), body = { ...payload, iat: now, exp: now + ttl }; const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" })); const encoded = `${header}.${base64url(JSON.stringify(body))}`; const signature = crypto.createHmac("sha256", secret).update(encoded).digest("base64url"); return `${encoded}.${signature}`; }
function verify(token, secret) { const [header, body, signature] = String(token).split("."); if (!header || !body || !signature) throw new Error("invalid token"); const expected = crypto.createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url"); if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) throw new Error("invalid token"); const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")); if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) { const error = new Error("expired"); error.name = "TokenExpiredError"; throw error; } return payload; }

export function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  return new Promise((resolve, reject) => crypto.scrypt(password, salt, 64, (error, key) => error ? reject(error) : resolve(`scrypt$${salt.toString("hex")}$${key.toString("hex")}`)));
}

export async function checkPassword(password, stored) {
  if (!stored) return false;
  if (stored.startsWith("scrypt$")) {
    // New Node hashes use a random salt encoded before the digest when created below.
    const [, salt, digest] = stored.split("$");
    if (!salt || !digest) return false;
    const key = await new Promise((resolve, reject) => crypto.scrypt(password, Buffer.from(salt, "hex"), 64, (error, value) => error ? reject(error) : resolve(value)));
    return crypto.timingSafeEqual(Buffer.from(digest, "hex"), key);
  }
  // Werkzeug's legacy hashes are deliberately accepted when migrating an existing database.
  const match = stored.match(/^pbkdf2:sha256:(\d+)\$(.+)\$(.+)$/);
  if (match) {
    const [, rounds, salt, expected] = match;
    const key = crypto.pbkdf2Sync(password, salt, Number(rounds), 32, "sha256").toString("hex");
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(key));
  }
  return false;
}

export function signAccessToken(user) {
  return sign({ sub: String(user.id), role: user.role }, env.jwtSecret, parseTtl(env.jwtExpiresIn));
}

export function signPasswordResetToken(user) {
  const fingerprint = crypto.createHash("sha256").update(user.password).digest("hex");
  return sign({ purpose: "password-reset", user_id: user.id, email: user.email, password_fingerprint: fingerprint }, env.secretKey, env.passwordResetMaxAge);
}

export function verifyPasswordResetToken(token) {
  return verify(token, env.secretKey);
}

export function verifyAccessToken(token) { return verify(token, env.jwtSecret); }
