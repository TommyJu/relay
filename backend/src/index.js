import express from "express";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

/* 
Sets up the Express application
*/
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);

// Starts the server using an environment variable for the port number.
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
    // Connects to the MongoDB database on server startup.
    connectDB();
});