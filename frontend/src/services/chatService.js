import { axiosInstance } from "../lib/axios";

export const chatService = {
  fetchChatUsers() {
    return axiosInstance.get("/messages/users");
  },

  fetchMessagesWithUser(receiverId) {
    return axiosInstance.get(`/messages/${receiverId}`);
  },


  sendMessageToUser(receiverId, messageData) {
    return axiosInstance.post(`/messages/send/${receiverId}`, messageData);
  },
};
