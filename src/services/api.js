import axios from "axios";

const fallbackBaseURL = "https://p2-e3ci.onrender.com/api/v1";
const envBaseURL = String(import.meta.env.VITE_API_BASE_URL || "").trim();
const isLocalApi = /localhost|127\.0\.0\.1/i.test(envBaseURL);
const resolvedBaseURL =
  import.meta.env.PROD && isLocalApi
    ? fallbackBaseURL
    : envBaseURL || fallbackBaseURL;

const api = axios.create({
  baseURL: resolvedBaseURL,
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
