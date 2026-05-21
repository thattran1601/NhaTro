import axios from "axios";
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
export const getAllHopdong = () => {
    return API.get("/api/hopdong");
}
export const getHopdongByPhong = (maPhong) => {
    return API.get(`/hopdong/phong/${maPhong}`);
}   
export const createHopdong = (data) => {
    return API.post("/api/hopdong", data);
}
export const updateHopdong = (id, data) => {
    return API.put(`/api/hopdong/${id}`, data);
}