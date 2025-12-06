import mongoose from "mongoose";

// Connects to the MongoDB database using the connection string defined in environment variables.
export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected: ${connection.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
};