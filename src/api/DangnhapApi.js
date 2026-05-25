import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const loginUser = (data) => {
  return API.post("/api/user/login", data);
};