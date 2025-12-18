// Loads environment variables first so modules can use them safely.
import "./lib/env.js";

import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";


const app = express();
app.use(express.json());
app.use(cors(
    {
       origin: "http://localhost:5173",
       credentials: true 
    }
));
app.use(cookieParser());
// Expose the endpoints last to prevent CORS and null payload errors
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);



const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
    connectDB();
});
