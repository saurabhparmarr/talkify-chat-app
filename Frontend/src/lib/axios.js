import axios from "axios";
import { API_URL } from "./config";

export const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || "";
    const isAuthCheck = url.includes("/users/check");

    if ((status === 401 || status === 403) && isAuthCheck) {
      return Promise.resolve({
        data: null,
        status,
        statusText: error?.response?.statusText || "Unauthorized",
        headers: error?.response?.headers || {},
        config: error?.config,
      });
    }

    return Promise.reject(error);
  }
);
