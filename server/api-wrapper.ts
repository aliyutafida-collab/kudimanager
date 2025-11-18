import { type Express } from "express";
import app from "../api/app";

/**
 * Wrapper to mount the API app at /api prefix for development
 * In production/Vercel, the routes are mounted directly without prefix
 */
export function mountApiRoutes(devApp: Express): void {
  devApp.use("/api", app);
}
