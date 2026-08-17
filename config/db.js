import mongoose from "mongoose";
import { env } from "./env.js";

let connectionState = "disconnected";

export async function connectDB() {
  if (!env.mongoUri) {
    connectionState = "unconfigured";
    console.warn("MONGODB_URI is not configured; the API is running in degraded mode.");
    return null;
  }
  try {
    await mongoose.connect(env.mongoUri);
    connectionState = "connected";
    console.log("Connected to MongoDB.");
    return mongoose.connection;
  } catch (error) {
    connectionState = "error";
    console.error(`Database connection error: ${error.message}`);
    return null;
  }
}

export function getDatabaseStatus() {
  const readyState = mongoose.connection.readyState;
  if (readyState === 1) return "ok";
  return connectionState === "unconfigured" ? "error" : connectionState;
}

export default connectDB;
