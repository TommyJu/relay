// Loads environment variables first so modules can use them safely.
import "./lib/env.js";

import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import path from "path";


// Increase payload size for image uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const isProduction = process.env.NODE_ENV === "production";

const allowedOrigin =
  isProduction
    ? "https://relay.azurewebsites.net"
    : "http://localhost:5173";
app.use(cors(
    {
       origin: allowedOrigin,
       credentials: true 
    }
));

app.use(cookieParser());

// Expose the endpoints last to prevent CORS and null payload errors
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Serve React build static files to the browser through http endpoints
if (isProduction) {
  const __dirname = path.resolve();
  const distPath = path.join(__dirname, "../frontend/dist");

  app.use(express.static(distPath));

  // SPA fallback (Express v5 compatible)
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
    connectDB();
});
