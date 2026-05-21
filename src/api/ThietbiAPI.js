import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const getAllThietbi = () => API.get("/thietbi");
export const getThietbiById = (MaTB) => API.get(`/thietbi/${MaTB}`);
export const createThietbi = (data) => API.post("/thietbi", data);
export const updateThietbi = (MaTB, data) => API.put(`/thietbi/${MaTB}`, data);
export const deleteThietbi = (MaTB) => API.delete(`/thietbi/${MaTB}`);
export const addThietBiToPhong = (data) => API.post("/thietbi/them-thiet-bi", data);
export const removeThietBiFromPhong = (data) => API.delete("/thietbi/xoa-thiet-bi", { data: data });