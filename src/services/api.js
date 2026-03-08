import axios from "axios";

const fallbackBaseURL = import.meta.env.PROD
  ? "https://p2-e3ci.onrender.com/api/v1"
  : "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || fallbackBaseURL,
  withCredentials: true,
  timeout: 15000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    error.message =
      error?.response?.data?.message ||
      error?.message ||
      "Unexpected network error. Please try again.";
    return Promise.reject(error);
  },
);

export default api;
