import express from "express";
import { createServer } from "http";
import app from "./app";

// For Vercel serverless deployment, simply export the Express app
export default app;

// For local development, run as a regular HTTP server
if (process.env.NODE_ENV === "development" || !process.env.VERCEL) {
  const { setupVite, serveStatic, log } = await import("./vite");
  
  // Wrap the app with /api prefix for dev mode
  const devApp = express();
  devApp.use("/api", app);
  
  const server = createServer(devApp);

  // Setup Vite middleware in development
  if (process.env.NODE_ENV === "development") {
    await setupVite(devApp, server);
  } else {
    serveStatic(devApp);
  }

  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`[server] serving on port ${port}`);
  });
}
