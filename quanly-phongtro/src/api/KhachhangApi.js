import axios from "axios";
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
export const getAllKhachhang = () => {
    return API.get("/khachhang");
};
export const getKhachhangById = (id) => {
    return API.get(`/khachhang/${id}`);
};
export const createKhachhang = (data) => {
    return API.post("/khachhang", data);
};
export const updateKhachhang = (id, data) => {
    return API.put(`/khachhang/${id}`, data);
};