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


// Access __dirname for ESM
const __dirname = path.resolve();

app.use(express.json());

const isProduction = process.env.NODE_ENV === "production";

const allowedOrigins =
  isProduction
    ? ["https://relay.azurewebsites.net"]
    : ["http://localhost:5173"];
app.use(cors(
    {
       origin: allowedOrigins,
       credentials: true 
    }
));
app.use(cookieParser());
// Expose the endpoints last to prevent CORS and null payload errors
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Serve React build static files to the browser through http endpoints
if (isProduction) {
  const distPath = path.resolve(__dirname, "../frontend/dist");

  app.use(express.static(distPath));

  // SPA fallback (Express v5 compatible)
  app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
    connectDB();
});
