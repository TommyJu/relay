import { create } from "zustand";
import { axiosInstance } from "../lib/axios";


// Defines global state and functions for user authentication.
export const useAuthStore = create((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    checkAuth: async () => {
        try {
            const response = await axiosInstance.get("/auth/check");
            set({ authUser: response.data });
        } catch (error) {
            set({ authUser: null });
            console.error("Error in checkAuth: ", error.message);
        } finally {
            set({ isCheckingAuth: false });
        }
    },
}));