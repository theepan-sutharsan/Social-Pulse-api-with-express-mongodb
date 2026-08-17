import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGODB_URI || "",
  jwtSecret: process.env.JWT_SECRET_KEY || "dev-secret-change-me",
  jwtExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES || "1440m",
  secretKey: process.env.SECRET_KEY || "dev-secret-change-me",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  passwordResetMaxAge: Number(process.env.PASSWORD_RESET_TOKEN_MAX_AGE || 3600),
  corsOrigins: process.env.CORS_ORIGINS || "*",
  youtubeApiKey: process.env.YOUTUBE_API_KEY || "",
  metaAppId: process.env.META_APP_ID || "",
  metaAppSecret: process.env.META_APP_SECRET || "",
  metaRedirectUri: process.env.META_REDIRECT_URI || "http://localhost:5000/api/accounts/oauth-callback",
  tiktokClientKey: process.env.TIKTOK_CLIENT_KEY || "",
  tiktokClientSecret: process.env.TIKTOK_CLIENT_SECRET || "",
  tiktokRedirectUri: process.env.TIKTOK_REDIRECT_URI || "http://localhost:5000/api/accounts/oauth-callback",
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || "",
  googleApiKey: process.env.GOOGLE_API_KEY || "",
  geminiBaseUrl: process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta",
  geminiModel: process.env.GEMINI_MODEL || "gemini-flash-latest",
  whisperModel: process.env.WHISPER_MODEL || "small",
  audienceMaxComments: Number(process.env.AUDIENCE_MAX_COMMENTS || 10000),
  audienceCommentBatchSize: Number(process.env.AUDIENCE_COMMENT_BATCH_SIZE || 150),
  debug: process.env.DEBUG === "1" || process.env.NODE_ENV === "development"
};

export function corsOrigin() {
  if (env.corsOrigins === "*") return true;
  return env.corsOrigins.split(",").map((value) => value.trim().replace(/\/$/, "")).filter(Boolean);
}
