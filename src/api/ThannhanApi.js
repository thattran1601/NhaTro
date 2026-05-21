import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getThanNhanByKhachHang = (maKH) => {
  return API.get(`/api/thannhan/khachhang/${maKH}`);
};

export const createThanNhan = (data) => {
  return API.post("/api/thannhan", data);
};

export const updateThanNhan = (id, data) => {
  return API.put(`/api/thannhan/${id}`, data);
};

export const deleteThanNhan = (id) => {
  return API.delete(`/api/thannhan/${id}`);
};