import axios from "axios";

const devApiBaseUrl = `${window.location.protocol}//${window.location.hostname}:5000/api`;
const productionApiBaseUrl = `${window.location.origin}/api`;

const apiBaseUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? devApiBaseUrl : productionApiBaseUrl);

export const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  timeout: 10000,
});
