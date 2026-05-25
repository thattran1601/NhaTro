import axios from "axios";
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
export const getAllKhachhang = () => {
    return API.get("/api/khachhang");
};
export const getKhachhangById = (id) => {
    return API.get(`/api/khachhang/${id}`);
};
export const createKhachhang = (formData) => {
  return API.post("/api/khachhang", formData);
};
export const updateKhachhang = (id, formData) => {
  return API.put(`/api/khachhang/${id}`, formData);
};