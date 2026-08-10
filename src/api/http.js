import axios from "axios";

export const API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:5000/api"
  : "https://thetavega-po-backend.onrender.com/api";

const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("po_access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("po_access_token");
      localStorage.removeItem("po_user");

      window.dispatchEvent(
        new Event("po-auth-expired")
      );
    }

    return Promise.reject(error);
  }
);

export default http;