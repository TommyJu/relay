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

  pinUser(userToAddId) {
    return axiosInstance.put(`/messages/users/pin-user/${userToAddId}`);
  },

  unpinUser(userToRemoveId) {
    return axiosInstance.delete(`/messages/users/unpin-user/${userToRemoveId}`);
  },

};
