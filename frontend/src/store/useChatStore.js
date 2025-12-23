import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { chatService } from "../services/chatService";
import { handleToastErrorMessage } from "../lib/utils";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });

    try {
      const response = await chatService.fetchChatUsers();
      set({ users: response.data });
    } catch (error) {
      handleToastErrorMessage(error);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (receiverId) => {
    set({ isMessagesLoading: true });

    try {
      const response = await chatService.fetchMessagesWithUser(receiverId);
      set({ messages: response.data });
    } catch (error) {
      handleToastErrorMessage(error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const response = await chatService.sendMessageToUser(
        selectedUser._id,
        messageData
      );
      set({ messages: [...messages, response.data] });
    } catch (error) {
      handleToastErrorMessage(error);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    socket.on("newMessage", (newMessage) => {
      // Limits incoming messages to the currently selected user only
      const isMessageFromSelectedUser = selectedUser._id === newMessage.senderId;
      if (!isMessageFromSelectedUser)
        return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (newSelectedUser) => {
    set({ selectedUser: newSelectedUser });
  },
}));
