import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import useAuthStore from "./useAuthStore";

const useChatStore = create((set, get) => ({
  users: [],
  messages: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },


  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );

      const exists = messages.some(m => m._id === res.data._id);

      if (!exists) {
        set({ messages: [...messages, res.data] });
      }

    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  },


  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("message", (message) => {
      const { selectedUser, messages } = get();

      const isChatMessage =
        message.senderId === selectedUser._id ||
        message.receiverId === selectedUser._id;

      if (!isChatMessage) return;

    
      const exists = messages.some(m => m._id === message._id);

      if (!exists) {
        set({ messages: [...messages, message] });
      }
    });
  },


  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("message");
  },

  // 🔹 Select User
  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
  },
}));

export default useChatStore;