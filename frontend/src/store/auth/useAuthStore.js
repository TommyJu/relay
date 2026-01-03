import { create } from "zustand";
import toast from "react-hot-toast";
import { handleToastErrorMessage } from "../../lib/utils";
import { authService } from "../../services/authService"
import { createSocket } from "../../lib/socket"



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
            const response = await authService.checkAuth();
            set({ authUser: response.data });
            get().connectSocket();
        } catch (error) {
            set({ authUser: null });
            if (error.status === 401) {
                console.info("User is not authenticated.");
            } else {
                console.error("Error in checkAuth: ", error);
            };
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
            handleToastErrorMessage(error);
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
            handleToastErrorMessage(error);
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
            handleToastErrorMessage(error);
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });

        try {
            const response = await authService.updateProfile(data);
            set({ authUser: response.data });
            toast.success("Profile picture uploaded successfully");
        } catch (error) {
            handleToastErrorMessage(error);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser } = get();

        // Prevents redundant socket connection
        if (!authUser || get().socket?.connected) return;

        const socket = createSocket(authUser);
        socket.connect();
        set({socket: socket});

        // Configure socket to refresh online users when needed
        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    },

    disconnectSocket: () => {
        const { socket } = get();
        if (socket?.connected) {
            socket.disconnect();
        };
    },

}));