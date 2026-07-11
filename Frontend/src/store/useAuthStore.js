import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../lib/config";

 const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  isUpdatingProfile: false,
  onlineUsers: [],
  lastSeenByUser: {},
  socket: null,
  checkAuth: async () => {
    set({ isCheckingAuth: true });

    const attemptCheck = async () => {
      return axiosInstance.get("/users/check", {
        timeout: 30000,
      });
    };

    try {
      const res = await attemptCheck();
      if (res.data?._id) {
        set({ authUser: res.data });
        get().connectSocket();
      } else {
        set({ authUser: null });
        get().disconnectSocket();
      }
    } catch (error) {
      const status = error?.response?.status;
      const isTimeout =
        error?.code === "ECONNABORTED" ||
        error?.message?.toLowerCase().includes("timeout");

      if (status === 401 || status === 403) {
        set({ authUser: null });
        get().disconnectSocket();
      } else if (isTimeout) {
        console.warn("checkAuth timed out; retrying once...");
        try {
          const retryRes = await attemptCheck();
          if (retryRes.data?._id) {
            set({ authUser: retryRes.data });
            get().connectSocket();
          } else {
            set({ authUser: null });
            get().disconnectSocket();
          }
        } catch (retryError) {
          const retryStatus = retryError?.response?.status;
          if (retryStatus === 401 || retryStatus === 403) {
            set({ authUser: null });
            get().disconnectSocket();
          }
        }
      } else {
        console.warn("checkAuth failed", error?.message || error);
      }
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/users/signup", data);

      set({ authUser: res.data });
      toast.success(res.data.message);
      get().connectSocket();
    } catch (error) {
      console.log("error in signup", error);
      toast.success(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/users/login", data);

      set({ authUser: res.data });
      toast.success(res.data.message);
      get().connectSocket();
    } catch (error) {
      console.log("error in login", error);
      toast.success(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      const res = await axiosInstance.post("/users/logout");

      set({ authUser: null });
      toast.success(res.data.message);
      get().disconnectSocket();
    } catch (error) {
      console.log("error in logout", error);
      toast.success(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/users/update-profile", data);
      const updatedUser = res.data;
      set({ authUser: updatedUser });
      toast.success(res.data.message);
    } catch (error) {
      console.log("error in updateProfile", error);
      toast.success(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    const userId = authUser?._id?.toString?.() || authUser?._id;

    if (!userId) return;

    const existingSocket = get().socket;
    if (existingSocket?.connected) return;

    if (existingSocket) {
      existingSocket.removeAllListeners();
      existingSocket.disconnect();
    }

    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      query: {
        userId,
      },
    });

    set({ socket });

    socket.on("connect", () => {
      socket.emit("presence:sync");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error", error?.message || error);
    });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds || [] });
    });

    socket.on("presenceUpdated", ({ onlineUsers, lastSeenByUser }) => {
      set({ onlineUsers: onlineUsers || [], lastSeenByUser: lastSeenByUser || {} });
    });

    socket.connect();
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
    set({ socket: null, onlineUsers: [], lastSeenByUser: {} });
  },
}));

export default useAuthStore;
