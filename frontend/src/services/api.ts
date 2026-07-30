import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Your backend URL
});

// Interceptor to add the auth token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;