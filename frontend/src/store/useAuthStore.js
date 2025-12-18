import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";


const BASE_URL = "http://localhost:5173";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    socket: null,

    checkAuth: async () => {
        try {
            const response = await axiosInstance.get("/auth/check-auth");
            set({ authUser: response.data });
            get().connectSocket();
        } catch (error) {
            set({ authUser: null });
            console.error("Error in checkAuth: ", error);
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });    
    
        try {
            const response = await axiosInstance.post("/auth/signup", data);
            set({ authUser: response.data });
            toast.success("Account created successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningUp: false }); 
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });

        try {
            const response = await axiosInstance.post("/auth/login", data);
            set({ authUser: response.data });
            toast.success("Logged in successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });

        try {
            const response = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: response.data });
            toast.success("Profile picture uploaded successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        // Prevents redundant socket connection
        if (!get.authUser || get.socket?.connected) return;

        const socket = io(BASE_URL);
        socket.connect();
    },

    disconnectSocket: () => {
        const socket = io(BASE_URL);
        socket.disconnect();
    }
}));