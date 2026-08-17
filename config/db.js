import mongoose from "mongoose";
import { env } from "./env.js";

let connectionState = "disconnected";
let listenersAttached = false;

function attachConnectionListeners() {
  if (listenersAttached) return;
  listenersAttached = true;

  mongoose.connection.on("connected", () => {
    connectionState = "connected";
  });
  mongoose.connection.on("error", (error) => {
    connectionState = "error";
    console.error(`Database connection error: ${error.message}`);
  });
  mongoose.connection.on("disconnected", () => {
    if (connectionState === "connected") {
      connectionState = "error";
      console.error("Database connection lost.");
    }
  });
}

export async function connectDB() {
  attachConnectionListeners();
  if (!env.mongoUri) {
    connectionState = "unconfigured";
    console.warn("MONGODB_URI is not configured; the API is running in degraded mode.");
    return null;
  }
  connectionState = "connecting";
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
  if (connectionState === "error" || connectionState === "unconfigured") return "error";
  if (readyState === 1 && connectionState === "connected") return "ok";
  return connectionState;
}

export default connectDB;
