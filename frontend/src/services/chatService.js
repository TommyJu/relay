import { axiosInstance } from "../lib/axios";

export const chatService = {
  fetchSidebarUsers() {
    return axiosInstance.get("/messages/users/sidebar");
  },

  fetchMessagesWithUser(receiverId) {
    return axiosInstance.get(`/messages/${receiverId}`);
  },


  sendMessageToUser(receiverId, messageData) {
    return axiosInstance.post(`/messages/send/${receiverId}`, messageData);
  },

};
