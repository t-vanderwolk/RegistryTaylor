import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("tm_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
