import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getAllKhachhang,
  createKhachhang,
  updateKhachhang,
} from "../api/KhachhangApi";

import CustomerModal from "../components/CustomerModal";
import ContractModal from "../components/ContractModal";
import { getAllPhong } from "../api/phongApi";
import { createHopdong, getAllHopdong } from "../api/HopdongApi";
import { createThanNhan } from "../api/ThannhanApi";

export default function CustomerPage() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [rooms, setRooms] = useState([]);
  const [contracts, setContracts] = useState([]);

  const [showContractModal, setShowContractModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [roomFilter, setRoomFilter] = useState("ALL");

  const fetchData = async () => {
    try {
      const res = await getAllKhachhang();

      setCustomers(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      setCustomers([]);
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await getAllPhong();

      setRooms(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Lỗi tải phòng:", error);
      setRooms([]);
    }
  };

  const fetchContracts = async () => {
    try {
      const res = await getAllHopdong();

      setContracts(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (error) {
      console.error("Lỗi tải hợp đồng:", error);
      setContracts([]);
    }
  };

  useEffect(() => {
    fetchData();
    fetchRooms();
    fetchContracts();
  }, []);

  const getCustomerContract = (MaKH) => {
    return contracts.find(
      (contract) =>
        Number(contract.MaKH) === Number(MaKH) &&
        Number(contract.TrangThai) === 1
    );
  };

  const formatDate = (date) => {
    if (!date) return "---";
    return new Date(date).toLocaleDateString("vi-VN");
  };

  const filteredCustomers = customers.filter((customer) => {
    const contract = getCustomerContract(customer.MaKH);

    const matchStatus =
      statusFilter === "ALL" ||
      (statusFilter === "STAYING" && !!contract) ||
      (statusFilter === "LEFT" && !contract);

    const matchRoom =
      roomFilter === "ALL" ||
      Number(contract?.MaPhong) === Number(roomFilter);

    return matchStatus && matchRoom;
});

  const handleSave = async (data) => {
  try {
    const { ThanNhan, ...customerData } = data;

    if (editing) {
      await updateKhachhang(editing.MaKH, customerData);
    } else {
      const res = await createKhachhang(customerData);

      const newMaKH =
        res.data?.data?.MaKH ||
        res.data?.MaKH ||
        res.data?.insertId;

      if (ThanNhan?.HoTen && ThanNhan?.SDT && newMaKH) {
        await createThanNhan({
          MaKH: newMaKH,
          HoTen: ThanNhan.HoTen,
          SDT: ThanNhan.SDT,
          QuanHe: ThanNhan.QuanHe,
        });
      }
    }

    await fetchData();
    setShowModal(false);
    setEditing(null);
  } catch (error) {
    console.error("Lỗi lưu khách hàng:", error);

    alert(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Lỗi lưu khách hàng"
    );
  }
};

  const handleCreateContract = async (data) => {
    try {
      const res = await createHopdong({
        ...data,
        TrangThai: 1,
      });

      alert(res.data?.message || "Tạo hợp đồng thành công");

      setShowContractModal(false);
      setSelectedCustomer(null);

      await fetchRooms();
      await fetchContracts();
      await fetchData();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Lỗi tạo hợp đồng"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f5] px-12 py-10">
      {/* HERO */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-600 px-5 py-2 rounded-full font-bold text-sm tracking-widest">
            <span>●</span>
            CƠ SỞ DỮ LIỆU CƯ DÂN
          </div>

          <h1 className="text-5xl font-black mt-5">
            QUẢN LÝ
            <span className="text-green-600 italic ml-3">NGƯỜI THUÊ</span>
          </h1>

          <p className="text-gray-400 font-bold tracking-widest mt-4">
            HỆ THỐNG QUẢN LÝ ĐỊNH DANH VÀ LỊCH SỬ CƯ TRÚ
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => {
              setEditing(null);
              setShowModal(true);
            }}
            className="bg-green-600 text-white px-10 py-5 rounded-2xl font-black shadow-lg hover:bg-green-700 transition"
          >
            + THÊM CƯ DÂN
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="w-full">
        <div className="col-span-9 max-w-[1300px] mx-auto w-full">
          {/* FILTER BAR */}
          <div className="bg-white rounded-[28px] p-5 shadow-sm flex justify-between items-center">
            <div className="flex gap-4">
              <button
                onClick={() => setStatusFilter("ALL")}
                className={`px-8 py-4 rounded-2xl font-black ${
                  statusFilter === "ALL"
                    ? "bg-green-600 text-white"
                    : "bg-[#f6f7f8] text-gray-400"
                }`}
              >
                TẤT CẢ
              </button>

              <button
                onClick={() => setStatusFilter("STAYING")}
                className={`px-8 py-4 rounded-2xl font-black ${
                  statusFilter === "STAYING"
                    ? "bg-green-600 text-white"
                    : "bg-[#f6f7f8] text-gray-400"
                }`}
              >
                ĐANG LƯU TRÚ
              </button>

              <button
                onClick={() => setStatusFilter("LEFT")}
                className={`px-8 py-4 rounded-2xl font-black ${
                  statusFilter === "LEFT"
                    ? "bg-green-600 text-white"
                    : "bg-[#f6f7f8] text-gray-400"
                }`}
              >
                ĐÃ CHUYỂN ĐI
              </button>
            </div>

           <select
            value={roomFilter}
            onChange={(e) => setRoomFilter(e.target.value)}
            className="bg-[#f6f7f8] text-[#09152f] px-8 py-4 rounded-2xl font-black outline-none"
          >
            <option value="ALL">TẤT CẢ PHÒNG</option>

            {rooms.map((room) => (
              <option key={room.MaPhong} value={room.MaPhong}>
                {room.TenPhong}
              </option>
            ))}
          </select>
          </div>

          {/* TABLE HEADER */}
          <div className="grid grid-cols-12 px-10 mt-8 mb-5 text-gray-400 font-black tracking-widest text-sm items-center">
            <div className="col-span-5">THÔNG TIN ĐỊNH DANH</div>
            <div className="col-span-3 text-center">LIÊN HỆ</div>
            <div className="col-span-2 text-center">NGÀY NHẬP HỘ</div>
            <div className="col-span-2 text-center">THAO TÁC</div>
          </div>

          {/* CUSTOMER ROWS */}
          <div className="space-y-5">
            {filteredCustomers.map((customer) => {
              const contract = getCustomerContract(customer.MaKH);

              return (
                <div
                  key={customer.MaKH}
                  className="bg-white rounded-[30px] px-10 py-7 shadow-sm grid grid-cols-12 items-center hover:shadow-md transition"
                >
                  {/* INFO */}
                  <div className="col-span-5 flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-2xl font-black text-green-600 shadow-sm">
                      {customer.HoTen?.charAt(0) || "K"}
                    </div>

                    <div>
                      <h2 className="text-xl font-black text-[#09152f] uppercase">
                        {customer.HoTen}
                      </h2>

                      <p className="text-gray-400 text-sm font-bold mt-2">
                        ID: #{customer.MaKH} &nbsp;•&nbsp;
                        {contract ? " ĐANG LƯU TRÚ" : " CHƯA LƯU TRÚ"}
                      </p>
                    </div>
                  </div>

                  {/* CONTACT */}
                  <div className="col-span-3">
                    <p className="text-lg font-bold text-[#24354f]">
                      ☎ {customer.SDT}
                    </p>

                    <p className="text-gray-400 text-sm font-bold mt-2">
                      🪪 {customer.CCCD}
                    </p>
                  </div>

                  {/* DATE */}
                  <div className="col-span-2 text-center">
                    <p className="font-black text-[#09152f]">
                      {formatDate(contract?.NgayTao)}
                    </p>

                    <p className="text-gray-400 text-xs font-bold tracking-widest">
                      NGÀY NHẬP HỘ
                    </p>
                  </div>

                  {/* ACTION */}
                  <div className="col-span-2 flex justify-center gap-3">
                    <button
                      onClick={() =>
                        navigate(`/customers/${customer.MaKH}/detail`)
                      }
                      className="bg-blue-50 text-blue-600 px-5 py-4 rounded-2xl font-black hover:bg-blue-600 hover:text-white transition"
                    >
                      XEM
                    </button>

                    <button
                      onClick={() => {
                        setEditing(customer);
                        setShowModal(true);
                      }}
                      className="border border-green-300 bg-green-50 text-green-600 px-5 py-4 rounded-2xl font-black hover:bg-green-600 hover:text-white transition"
                    >
                      SỬA
                    </button>

                    {!contract ? (
                      <button
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setShowContractModal(true);
                        }}
                        className="bg-[#09152f] text-white px-5 py-4 rounded-2xl font-black hover:bg-[#09152f]/90 transition"
                      >
                        TẠO HĐ
                      </button>
                    ) : (
                      <span className="bg-gray-100 text-gray-400 px-5 py-4 rounded-2xl font-black">
                        ĐÃ CÓ HĐ
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {showModal && (
          <CustomerModal
            customer={editing}
            onSave={handleSave}
            onClose={() => {
              setShowModal(false);
              setEditing(null);
            }}
          />
        )}

        {showContractModal && (
          <ContractModal
            customers={customers}
            rooms={rooms}
            contracts={contracts}
            selectedCustomer={selectedCustomer}
            onSave={handleCreateContract}
            onClose={() => {
              setShowContractModal(false);
              setSelectedCustomer(null);
            }}
          />
        )}
      </div>
    </div>
  );
}