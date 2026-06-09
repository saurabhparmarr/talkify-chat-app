import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { io } from "socket.io-client";

const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? `${window.location.protocol}//${window.location.hostname}:5000/api` : `${window.location.origin}/api`);
const SOCKET_BASE_URL =
  import.meta.env.VITE_SOCKET_URL ||
  (import.meta.env.DEV ? "http://127.0.0.1:5000" : window.location.origin);

const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  isUpdatingProfile: false,
  onlineUsers: [],
  socket: null,
  presenceMap: {},
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/users/check", { timeout: 6000 });
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      const status = error?.response?.status;
      if (status !== 401 && status !== 403) {
        console.warn("checkAuth failed", error?.message || error);
      }
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/users/signup", data);
      const { token, ...userData } = res.data;

      set({ authUser: userData });
      setAuthToken(token);
      toast.success(res.data.message);
      get().connectSocket();
    } catch (error) {
      console.log("error in signup", error);
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/users/login", data);
      const { token, ...userData } = res.data;

      set({ authUser: userData });
      setAuthToken(token);
      toast.success(res.data.message);
      get().connectSocket();
    } catch (error) {
      console.log("error in login", error);
      const message = error.code === "ERR_NETWORK"
        ? "Backend is not reachable. Make sure the server is running on port 5000."
        : error.response?.data?.message || "Login failed";
      toast.error(message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      const res = await axiosInstance.post("/users/logout");

      set({ authUser: null });
      setAuthToken(null);
      toast.success(res.data.message);
      get().disconnectSocket();
    } catch (error) {
      console.log("error in logout", error);
      toast.error(error.response?.data?.message || "Logout failed");
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
      toast.error(error.response?.data?.message || "Profile update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser, socket: existingSocket } = get();
    if (!authUser || existingSocket?.connected) return;

    const socket = io(SOCKET_BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });

    socket.connect();
    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    socket.on("userStatusChanged", (presence) => {
      set((state) => ({
        presenceMap: {
          ...state.presenceMap,
          [presence.userId]: {
            isOnline: presence.isOnline,
            lastSeen: presence.lastSeen,
          },
        },
      }));
    });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket?.connected) {
      socket.disconnect();
    }
    set({ socket: null, onlineUsers: [], presenceMap: {} });
  },
}));

export default useAuthStore;
