const isDev = import.meta.env.DEV;

export const API_URL =
  import.meta.env.VITE_API_URL ||
  (isDev
    ? "http://localhost:3000/api"
    : "https://talkify-chat-app-ce2b.onrender.com/api");

export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  (isDev
    ? "http://localhost:3000"
    : "https://talkify-chat-app-ce2b.onrender.com");
