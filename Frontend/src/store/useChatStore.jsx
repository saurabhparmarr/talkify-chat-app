import toast from "react-hot-toast";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../lib/axios";
import useAuthStore from "./useAuthStore";

const useChatStore = create(
  persist(
    (set, get) => ({
      users: [],
      messages: [],
      selectedUser: null,
      isUsersLoading: false,
      isMessagesLoading: false,
      typingUsers: [],
      isSendingMessage: false,

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
        const { selectedUser, messages, isSendingMessage } = get();
        if (isSendingMessage || !selectedUser?._id) return;

        set({ isSendingMessage: true });

        try {
          const res = await axiosInstance.post(
            `/messages/send/${selectedUser._id}`,
            messageData
          );

          const exists = messages.some((m) => m._id === res.data._id);

          if (!exists) {
            set({ messages: [...messages, res.data] });
          }

          return res.data;
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to send message");
          throw error;
        } finally {
          set({ isSendingMessage: false });
        }
      },


      subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.off("message");
        socket.on("message", (message) => {
          const { selectedUser, messages } = get();

          const isChatMessage =
            message.senderId === selectedUser._id ||
            message.receiverId === selectedUser._id;

          if (!isChatMessage) return;

          const exists = messages.some((m) => m._id === message._id);

          if (!exists) {
            set({ messages: [...messages, message] });
          }
        });
      },

      subscribeToTyping: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.off("typing");
        socket.off("stopTyping");

        socket.on("typing", ({ senderId, receiverId }) => {
          const { selectedUser, typingUsers } = get();
          const authUser = useAuthStore.getState().authUser;

          const isRelevantEvent =
            authUser?._id === receiverId && selectedUser?._id === senderId;

          if (!isRelevantEvent) return;

          if (typingUsers.includes(senderId)) return;
          set({ typingUsers: [...typingUsers, senderId] });
        });

        socket.on("stopTyping", ({ senderId, receiverId }) => {
          const { selectedUser, typingUsers } = get();
          const authUser = useAuthStore.getState().authUser;

          const isRelevantEvent =
            authUser?._id === receiverId && selectedUser?._id === senderId;

          if (!isRelevantEvent) return;

          set({ typingUsers: typingUsers.filter((id) => id !== senderId) });
        });
      },

      unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket?.off("message");
      },

      unsubscribeFromTyping: () => {
        const socket = useAuthStore.getState().socket;
        socket?.off("typing");
        socket?.off("stopTyping");
        set({ typingUsers: [] });
      },

      setSelectedUser: (selectedUser) => {
        set({ selectedUser, typingUsers: [] });
      },
    }),
    {
      name: "talkify-chat-store",
      partialize: (state) => ({ selectedUser: state.selectedUser }),
    }
  )
);

export default useChatStore;
