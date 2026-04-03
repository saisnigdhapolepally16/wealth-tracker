import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor: Add JWT token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor: Handle errors, token expiry, and retries
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    if (!config || !config.retry) {
      config.retry = 0;
    }

    // Retry only for network errors or 5xx server errors
    if (
      config.retry < 3 &&
      (!error.response || error.response.status >= 500)
    ) {
      config.retry += 1;
      const delay = 1000 * Math.pow(2, config.retry - 1); // Exponential backoff

      console.log(`Retrying request (${config.retry}/3) after ${delay}ms`);

      await new Promise(resolve => setTimeout(resolve, delay));
      return API(config);
    }

    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }

    if (error.response?.status === 429) {
      // Rate limit error
      console.error("Rate limited. Please try again later.");
    }

    return Promise.reject(error);
  }
);

export default API;