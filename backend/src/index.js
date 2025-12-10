// Loads environment variables first so modules can use them safely.
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";


/* 
Sets up the Express application
*/
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors(
    {
       origin: "http://localhost:5173",
       credentials: true 
    }
));
app.use("/api/auth", authRoutes);
app.use("/api/users", messageRoutes);

// Starts the server using an environment variable for the port number.
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
    // Connects to the MongoDB database on server startup.
    connectDB();
});