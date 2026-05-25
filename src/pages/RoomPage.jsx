import { useEffect, useState } from "react"
import RoomCard from "../components/RoomCard"
import AddRoomModal from "../components/addRoomModal"
import { getAllHopdong } from "../api/HopdongApi";

import {
  getAllPhong,
  createPhong,
  updatePhong,
  deletePhong
} from "../api/phongApi"

import { getAllThietbi } from "../api/ThietbiAPI";

export default function App() {
//Khai báo state và các hàm xử lý
  const [rooms, setRooms] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [active, setActive] = useState("ALL")
  const [editRoom, setEditRoom] = useState(null)
  const [devices, setDevices] = useState([])
  const [contracts, setContracts] = useState([])
  const tabs = [
        "ALL",
        "EMPTY",
        "RENTED",
        "MAINTAIN"
]

  // Hàm lấy danh sách phòng từ API
  const fetchRooms = async () => {
    try {
      const res = await getAllPhong()

      console.log("API:", res.data)

      setRooms(
        Array.isArray(res.data)
          ? res.data
          : []
      )

    } catch (error) {
      console.log(error)
      setRooms([])
    }
  }
  // Hàm lấy danh sách thiết bị từ API
  const fetchDevices = async () => {
    try {
      const res = await getAllThietbi();
      setDevices(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Lỗi tải thiết bị:", error);
      setDevices([]);
    }
  };
  // Hàm lấy danh sách hợp đồng từ API
  const fetchContracts = async () => {
  try {
    const res = await getAllHopdong();

    setContracts(
      Array.isArray(res.data.data)
        ? res.data.data
        : []
    );
  } catch (error) {
    console.error("Lỗi tải hợp đồng:", error);
    setContracts([]);
  }
};
  //useEffect gọi API khi mở trang
  useEffect(() => {
    fetchRooms();
    fetchDevices();
    fetchContracts();
  }, [])
  // Hàm thêm hoặc cập nhật phòng
   const addRoom = async (room) => {
  try {
    if (editRoom) {
      await updatePhong(editRoom.MaPhong, {
        TenPhong: room.TenPhong,
        GiaThue: room.GiaThue,
        TinhTrang: room.TinhTrang,
        SoNguoi: room.SoNguoi,
      });

      setEditRoom(null);
    } else {
      await createPhong({
        TenPhong: room.TenPhong,
        GiaThue: room.GiaThue,
        SoNguoi: room.SoNguoi,
        DanhSachThietBi: room.DanhSachThietBi,
      });
    }

    await fetchRooms();
    await fetchDevices();
  } catch (error) {
    console.error("Lỗi lưu phòng:", error);

    alert(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Lỗi lưu phòng"
    );
  }
};
// Hàm xóa phòng
  const removeRoom = async (id) => {
    await deletePhong(id)// Gọi API xóa phòng
    fetchRooms()// Tải lại danh sách phòng sau khi xóa
  }
  // Hàm xử lý khi nhấn nút sửa phòng
  const handleEdit = (room) => {
    setEditRoom(room)// Set phòng cần sửa vào state
    setShowModal(true)// Hiển thị modal
  }
  // Hàm lọc danh sách phòng theo trạng thái (tất cả, trống, đã thuê, bảo trì)
  const filteredRooms = Array.isArray(rooms)
    ? rooms.filter((room) => {
        if (active === "EMPTY")
          return Number(room.TinhTrang) === 0

        if (active === "RENTED")
          return Number(room.TinhTrang) === 1

        if (active === "MAINTAIN")
          return Number(room.TinhTrang) === 2

        return true
      })
    : []

  return (
    <div className="min-h-screen bg-[#eef2ef] px-12 py-8">
      
      <div className="bg-white rounded-3xl shadow-md p-8 mt-6 flex justify-between items-center">

      <div>

         <h1 className="text-5xl font-black mt-5">
            QUẢN LÝ
            <span className="text-green-600 italic ml-3">PHÒNG</span>
          </h1>
          <p className="text-gray-400 font-black tracking-[0.35em] text-sm mt-5">
            HỆ THỐNG QUẢN LÝ PHÒNG TRỌ
          </p>
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="bg-green-500 text-white px-10 py-5 rounded-3xl text-lg font-semibold shadow-lg"
      >
        + THÊM PHÒNG
      </button>

    </div>

      <div className="bg-white rounded-4xl p-4 mt-14 gap-5 shadow-sm">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActive(tab)}
                    className={`px-8 py-4 rounded-2xl font-semibold transition-all
                         ${
                        active === tab
                            ? "bg-green-50 text-green-500"
                            : "text-gray-500"
                    }`}
                    >
                    {tab =="ALL"&& "TẤT CẢ"}
                    {tab =="RENTED"&& "ĐÃ THUÊ"}
                    {tab =="EMPTY"&& "TRỐNG"}
                    {tab =="MAINTAIN"&& "BẢO TRÌ"}
                </button>
            ))}
        </div>

      <div className="grid grid-cols-4 gap-8 mt-14">
      {/* Hiển thị danh sách phòng đã được lọc */}
       {filteredRooms.map((room) => (
        <RoomCard
          key={room.MaPhong}
          room={room}
          contracts={contracts}
          onEdit={handleEdit}
          onDelete={removeRoom}
        />
      ))}

      </div>

     {showModal && (
        <AddRoomModal
          setShowModal={setShowModal}
          addRoom={addRoom}
          editRoom={editRoom}
          devices={devices}
        />
      )}

    </div>
  )
}