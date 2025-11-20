import express from "express";
import { createServer } from "http";
import app from "./app";

// Export Express app for Vercel Serverless
export default app;

// Local development server
if (process.env.NODE_ENV !== "production") {
  const devApp = express();
  const server = createServer(devApp);

  // Prefix API routes with /api
  devApp.use("/api", app);

  const port = parseInt(process.env.PORT || "5050", 10);
  server.listen(port, () => {
    console.log("Dev server running on http://localhost:" + port);
  });
}
