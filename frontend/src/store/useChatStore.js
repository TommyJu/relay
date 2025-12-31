import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { chatService } from "../services/chatService";
import { handleToastErrorMessage } from "../lib/utils";
import toast from "react-hot-toast";

export const useChatStore = create((set, get) => ({
  messages: [],
  pinnedChatUsers: [],
  otherChatUsers: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getSidebarUsers: async () => {
    set({ isUsersLoading: true });

    try {
      const response = await chatService.fetchSidebarUsers();
      set({ pinnedChatUsers: response.data.pinnedUsers });
      set({ otherChatUsers: response.data.otherUsers });
    } catch (error) {
      handleToastErrorMessage(error);
    } finally {
      set({ isUsersLoading: false });
    }
  },
  pinUser: async (userToAddId) => {
    // optimistic update
    const { pinnedChatUsers, otherChatUsers } = get();

    const userToPin = otherChatUsers.find((u) => u._id === userToAddId);
    if (!userToPin) return;

    set({
      pinnedChatUsers: [userToPin, ...pinnedChatUsers],
      otherChatUsers: otherChatUsers.filter((u) => u._id !== userToAddId),
    });

    try {
      await chatService.pinUser(userToAddId);
      toast.success("User pinned successfully");
    } catch (error) {
      handleToastErrorMessage(error);
      // rollback on failure
      set({
        pinnedChatUsers,
        otherChatUsers,
      });
    }
  },

  unpinUser: async (userToRemoveId) => {
    const { pinnedChatUsers, otherChatUsers } = get();

    const userToUnpin = pinnedChatUsers.find((u) => u._id === userToRemoveId);
    if (!userToUnpin) return;

    // update the frontend state before the backend updates
    set({
      pinnedChatUsers: pinnedChatUsers.filter((u) => u._id !== userToRemoveId),
      otherChatUsers: [userToUnpin, ...otherChatUsers],
    });

    try {
      await chatService.unpinUser(userToRemoveId);
      toast.success("User unpinned successfully");
    } catch (error) {
      // rollback
      handleToastErrorMessage(error);
      set({
        pinnedChatUsers,
        otherChatUsers,
      });
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
      const isMessageFromSelectedUser =
        selectedUser._id === newMessage.senderId;
      if (!isMessageFromSelectedUser) return;

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
