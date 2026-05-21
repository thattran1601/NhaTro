import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getAllThietbi = () => API.get("/api/thietbi");
export const getThietbiById = (MaTB) => API.get(`/api/thietbi/${MaTB}`);
export const createThietbi = (data) => API.post("/api/thietbi", data);
export const updateThietbi = (MaTB, data) => API.put(`/api/thietbi/${MaTB}`, data);
export const deleteThietbi = (MaTB) => API.delete(`/api/thietbi/${MaTB}`);
export const addThietBiToPhong = (data) => API.post("/api/thietbi/them-thiet-bi", data);
export const removeThietBiFromPhong = (data) => API.delete("/api/thietbi/xoa-thiet-bi", { data: data });