import axios, { AxiosHeaders } from "axios";
import { deleteCookie, getCookie } from "./cookies";
import { API_BASE_URL } from "../constant";
 

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token =
    getCookie("admin_auth_token") ||
    getCookie("accessToken") ||
    getCookie("authToken");

  if (token) {
    config.headers = config.headers ?? new AxiosHeaders();
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      deleteCookie("admin_auth_token");
      deleteCookie("admin_refresh_token");
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
