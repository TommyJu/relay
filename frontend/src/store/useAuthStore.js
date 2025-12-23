import { create } from "zustand";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { BACKEND_BASE_URL } from "../config/url";
import { handleApiError } from "../lib/utils";
import { authService } from "../services/authService"



export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const response = authService.checkAuth();
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
            const response = await authService.signup(data);
            set({ authUser: response.data });
            toast.success("Account created successfully");
            get().connectSocket();
        } catch (error) {
            handleApiError(error);
        } finally {
            set({ isSigningUp: false }); 
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });

        try {
            const response = await authService.login(data);
            set({ authUser: response.data });
            toast.success("Logged in successfully");
            get().connectSocket();
        } catch (error) {
            handleApiError(error);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await authService.logout();
            set({ authUser: null });
            toast.success("Logged out successfully");
            get().disconnectSocket();
        } catch (error) {
            handleApiError(error);
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });

        try {
            const response = await authService.updateProfile(data);
            set({ authUser: response.data });
            toast.success("Profile picture uploaded successfully");
        } catch (error) {
            handleApiError(error);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser } = get();

        // Prevents redundant socket connection
        if (!authUser || get().socket?.connected) return;

        const socket = io(BACKEND_BASE_URL, 
            {
                auth: {
                    userId: authUser._id
                }
            }
        );
        socket.connect();
        
        set({socket: socket});

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    },

    disconnectSocket: () => {
        if (get().socket?.connected) {
            get().socket.disconnect();
            set({ socket: null });
        };
    },

}));