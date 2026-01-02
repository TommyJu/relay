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
  isConversationsLoading: false,
  currentConversationId: null,
  unreadUserIds: new Set(),

  getUnreadUserIds: async () => {
    try {
      set({ isConversationsLoading: true });
      const response = await chatService.getUnreadUserIds();
      set({ unreadUserIds: new Set(response.data || []) });
    } catch (error) {
      handleToastErrorMessage(error);
    } finally {
      set({ isConversationsLoading: false });
    }
  },

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

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const response = await chatService.sendMessageToUser(
        selectedUser._id,
        messageData
      );
      set({ messages: [...messages, response.data.newMessage] });
    } catch (error) {
      handleToastErrorMessage(error);
    }
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.on("newMessage", ({ newMessage, conversationId }) => {
      const { currentConversationId } = get();
      // Limits incoming messages to the currently selected user only
      let isNewMessageFromCurrentConversation =
        conversationId === currentConversationId;
      if (isNewMessageFromCurrentConversation) {
        set((state) => ({ messages: [...state.messages, newMessage] }));
      } else {
        // Add sender ID to unreadUserIds for new message notifications
        set((state) => {
          const newUnreadUserIds = new Set(state.unreadUserIds);
          newUnreadUserIds.add(newMessage.senderId);
          return { unreadUserIds: newUnreadUserIds };
        });
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: async (newSelectedUser) => {
    set({ selectedUser: newSelectedUser, isMessagesLoading: true });

    try {
      // Update current conversation Id
      const convoRes = await chatService.getConversation(newSelectedUser._id);
      const conversationId = convoRes.data._id;
      set({ currentConversationId: conversationId });

      // Retrieve messages
      const messagesRes = await chatService.fetchMessagesWithUser(
        newSelectedUser._id
      );
      set({ messages: messagesRes.data });

      // Remove the unread conversation locally
      set((state) => {
        const updatedUnreadUserIds = new Set(state.unreadUserIds);
        updatedUnreadUserIds.delete(newSelectedUser._id);
        return { unreadUserIds: updatedUnreadUserIds };
      });
      // Mark the conversation as read in the backend
      await chatService.markConversationAsRead(conversationId);
    } catch (error) {
      handleToastErrorMessage(error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
}));
