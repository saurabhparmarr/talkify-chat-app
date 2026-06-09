import axios from "axios";


export const axiosInstance = axios.create({
    baseURL: "https://talkify-chat-app-ce2b.onrender.com/api", 
    withCredentials: true,
});