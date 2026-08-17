import dns from "node:dns";
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

function isSrvDnsFailure(error) {
  return env.mongoUri.startsWith("mongodb+srv://") && /querySrv|queryTxt|ECONNREFUSED|ETIMEOUT/i.test(error?.message || "");
}

function usePublicDnsFallback() {
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
  console.warn("Atlas SRV lookup failed with the system DNS resolver; retrying with public DNS.");
}

export async function connectDB() {
  attachConnectionListeners();
  if (!env.mongoUri) {
    connectionState = "unconfigured";
    console.warn("MONGODB_URI is not configured; the API is running in degraded mode.");
    return null;
  }
  connectionState = "connecting";
  const options = { serverSelectionTimeoutMS: 10000 };
  try {
    try {
      await mongoose.connect(env.mongoUri, options);
    } catch (error) {
      if (!isSrvDnsFailure(error)) throw error;
      usePublicDnsFallback();
      await mongoose.connect(env.mongoUri, options);
    }
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
