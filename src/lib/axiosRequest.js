"use client";
import { API } from "@/utils/config";
import axios from "axios";

const axiosRequest = axios.create({
  baseURL: API
});

// 🔐 Илова кардани токен ба ҳар запрос
axiosRequest.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ❌ Агар токен нодуруст ё 401 шавад — logout ва гузаштан ба login
axiosRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("access_token");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosRequest;
