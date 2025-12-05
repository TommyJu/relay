import express from "express";
import authRoutes from "./routes/auth.route.js"

/* 
Sets up the application to use the express middleware
for the API endpoints.
*/
const app = express();

app.use("/api/auth", authRoutes);

// Starts the server on port 5001
app.listen(5001, () => {
    console.log("server is running on port 5001");
});