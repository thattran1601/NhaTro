import axios from "axios"

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getAllPhong = () => {
  return API.get("/api/phong")  // Gọi đúng endpoint đã define trong baseURL
}

export const getPhongById = (id) => {
  return API.get(`/api/phong/${id}`)
}

export const createPhong = (data) => {
  return API.post("/api/phong", data)
}

export const updatePhong = (id, data) => {
  return API.put(`/api/phong/${id}`, data)
}

export const deletePhong = (id) => {
  return API.delete(`/api/phong/${id}`)
}

export const getChiTietPhong = (id) =>
  API.get(`/api/phong/chitietphong/${id} `);

export default API