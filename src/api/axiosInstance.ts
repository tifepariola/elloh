import axios from "axios";

const api = axios.create({
  baseURL: "https://core-vncb.onrender.com/api/v1", // Base URL for all requests
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;