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
export const createKhachhang = (data) => {
    return API.post("/api/khachhang", data);
};
export const updateKhachhang = (id, data) => {
    return API.put(`/api/khachhang/${id}`, data);
};