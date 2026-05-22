import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import FilterTabs from "../components/FilterTabs"
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

  const [rooms, setRooms] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [active, setActive] = useState("ALL")
  const [editRoom, setEditRoom] = useState(null)
  const [devices, setDevices] = useState([])
  const [contracts, setContracts] = useState([])

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

  const fetchDevices = async () => {
    try {
      const res = await getAllThietbi();
      setDevices(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Lỗi tải thiết bị:", error);
      setDevices([]);
    }
  };

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

  useEffect(() => {
    fetchRooms();
    fetchDevices();
    fetchContracts();
  }, [])

   const addRoom = async (room) => {
  try {
    if (editRoom) {
      await updatePhong(editRoom.MaPhong, {
        TenPhong: room.TenPhong,
        GiaThue: room.GiaThue,
        TinhTrang: room.TinhTrang,
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
  const removeRoom = async (id) => {
    await deletePhong(id)
    fetchRooms()
  }
  
  const handleEdit = (room) => {
    setEditRoom(room)
    setShowModal(true)
  }
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
      
      <Hero setShowModal={setShowModal} />

      <FilterTabs
        active={active}
        setActive={setActive}
      />

      <div className="grid grid-cols-4 gap-8 mt-14">

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