import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://p2-e3ci.onrender.com/api/v1",
  withCredentials: true,
  timeout: 15000
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    error.message =
      error?.response?.data?.message ||
      error?.message ||
      "Unexpected network error. Please try again.";
    return Promise.reject(error);
  }
);

export default api;
