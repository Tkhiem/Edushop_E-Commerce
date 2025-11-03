import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

console.log("🔧 Axios Config:");
console.log("  - VITE_API_URL:", import.meta.env.VITE_API_URL);
console.log("  - Final baseURL:", API_URL);

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ...existing interceptors...

export default axiosInstance;
