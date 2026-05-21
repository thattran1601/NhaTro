import axios from "axios"

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getAllPhong = () => {
  return API.get("/phong")  // Gọi đúng endpoint đã define trong baseURL
}

export const getPhongById = (id) => {
  return API.get(`/phong/${id}`)
}

export const createPhong = (data) => {
  return API.post("/phong", data)
}

export const updatePhong = (id, data) => {
  return API.put(`/phong/${id}`, data)
}

export const deletePhong = (id) => {
  return API.delete(`/phong/${id}`)
}

export const getChiTietPhong = (id) =>
  API.get(`/phong/${id}/chitiet`);

export default API