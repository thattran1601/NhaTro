import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getKhachhangById } from "../api/KhachhangApi";
import { getAllHopdong } from "../api/Hopdongapi";
import { getAllPhong } from "../api/Phongapi";

export default function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [contract, setContract] = useState(null);
  const [room, setRoom] = useState(null);

  const fetchDetail = async () => {
    try {
      const customerRes = await getKhachhangById(id);
      const contractsRes = await getAllHopdong();
      const roomsRes = await getAllPhong();

      const customerData = customerRes.data.data || customerRes.data;

      const contracts = Array.isArray(contractsRes.data.data)
        ? contractsRes.data.data
        : [];

      const rooms = Array.isArray(roomsRes.data)
        ? roomsRes.data
        : [];

      const currentContract = contracts.find(
        (item) =>
          Number(item.MaKH) === Number(id) &&
          Number(item.TrangThai) === 1
      );

      const currentRoom = currentContract
        ? rooms.find(
            (item) => Number(item.MaPhong) === Number(currentContract.MaPhong)
          )
        : null;

      setCustomer(customerData);
      setContract(currentContract || null);
      setRoom(currentRoom || null);
    } catch (error) {
      console.error("Lỗi tải chi tiết khách hàng:", error);
      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Lỗi tải chi tiết khách hàng"
      );
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const formatMoney = (value) => {
    return Number(value || 0).toLocaleString("vi-VN") + "đ";
  };

  const formatDate = (value) => {
    if (!value) return "---";
    return new Date(value).toLocaleDateString("vi-VN");
  };

  if (!customer) {
    return (
      <div className="min-h-screen bg-[#f4f7f5] px-12 py-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 bg-white text-[#09152f] px-6 py-3 rounded-2xl font-black shadow-sm hover:bg-gray-100 transition"
        >
          ← QUAY LẠI
        </button>

        <h1 className="text-3xl font-black text-[#09152f]">
          Không tìm thấy khách hàng
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7f5] px-12 py-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 bg-white text-[#09152f] px-6 py-3 rounded-2xl font-black shadow-sm hover:bg-gray-100 transition"
      >
        ← QUAY LẠI
      </button>

      {/* HERO */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-600 px-5 py-2 rounded-full font-bold text-sm tracking-widest">
          <span>●</span>
          CHI TIẾT NGƯỜI THUÊ
        </div>

        <h1 className="text-5xl font-black mt-5 text-[#09152f] uppercase">
          {customer.HoTen}
        </h1>

        <p className="text-gray-400 font-bold tracking-widest mt-4">
          MÃ KHÁCH HÀNG: #{customer.MaKH}
        </p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* THÔNG TIN KHÁCH HÀNG */}
        <div className="col-span-5 bg-white rounded-[30px] p-8 shadow-sm">
          <h2 className="text-2xl font-black text-[#09152f] mb-6">
            THÔNG TIN ĐỊNH DANH
          </h2>

          <div className="space-y-5">
            <div className="bg-[#f6f7f8] rounded-2xl p-5">
              <p className="text-gray-400 font-bold text-sm">HỌ TÊN</p>
              <p className="text-xl font-black text-[#09152f]">
                {customer.HoTen}
              </p>
            </div>

            <div className="bg-[#f6f7f8] rounded-2xl p-5">
              <p className="text-gray-400 font-bold text-sm">SỐ ĐIỆN THOẠI</p>
              <p className="text-xl font-black text-[#09152f]">
                {customer.SDT || "---"}
              </p>
            </div>

            <div className="bg-[#f6f7f8] rounded-2xl p-5">
              <p className="text-gray-400 font-bold text-sm">CCCD</p>
              <p className="text-xl font-black text-[#09152f]">
                {customer.CCCD || "---"}
              </p>
            </div>
          </div>
        </div>

        {/* PHÒNG ĐANG THUÊ */}
        <div className="col-span-7 bg-white rounded-[30px] p-8 shadow-sm">
          <h2 className="text-2xl font-black text-[#09152f] mb-6">
            PHÒNG ĐANG THUÊ
          </h2>

          {room ? (
            <div className="bg-green-50 rounded-2xl p-6">
              <p className="text-3xl font-black text-[#09152f]">
                {room.TenPhong}
              </p>

              <p className="text-gray-500 font-bold mt-4">
                Giá thuê: {formatMoney(room.GiaThue)}
              </p>

              <p className="text-green-600 font-black mt-4">
                ĐANG LƯU TRÚ
              </p>

              <button
                onClick={() => navigate(`/rooms/${room.MaPhong}/detail`)}
                className="mt-6 bg-[#09152f] text-white px-6 py-4 rounded-2xl font-black"
              >
                XEM CHI TIẾT PHÒNG
              </button>
            </div>
          ) : (
            <div className="bg-gray-100 rounded-2xl p-6 text-gray-400 font-bold">
              Khách hàng này chưa có phòng đang thuê
            </div>
          )}
        </div>
      </div>

      {/* HỢP ĐỒNG */}
      <div className="bg-white rounded-[30px] p-8 shadow-sm mt-8">
        <h2 className="text-2xl font-black text-[#09152f] mb-6">
          THÔNG TIN HỢP ĐỒNG
        </h2>

        {contract ? (
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-3 bg-[#f6f7f8] rounded-2xl p-5">
              <p className="text-gray-400 font-bold text-sm">MÃ HỢP ĐỒNG</p>
              <p className="text-xl font-black text-[#09152f]">
                #{contract.MaHD}
              </p>
            </div>

            <div className="col-span-3 bg-[#f6f7f8] rounded-2xl p-5">
              <p className="text-gray-400 font-bold text-sm">NGÀY BẮT ĐẦU</p>
              <p className="text-xl font-black text-[#09152f]">
                {formatDate(contract.NgayTao)}
              </p>
            </div>

            <div className="col-span-3 bg-[#f6f7f8] rounded-2xl p-5">
              <p className="text-gray-400 font-bold text-sm">NGÀY KẾT THÚC</p>
              <p className="text-xl font-black text-[#09152f]">
                {formatDate(contract.NgayKT)}
              </p>
            </div>

            <div className="col-span-3 bg-[#f6f7f8] rounded-2xl p-5">
              <p className="text-gray-400 font-bold text-sm">TIỀN CỌC</p>
              <p className="text-xl font-black text-green-600">
                {formatMoney(contract.TienCoc)}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-gray-100 rounded-2xl p-6 text-gray-400 font-bold">
            Khách hàng này chưa có hợp đồng đang hoạt động
          </div>
        )}
      </div>
    </div>
  );
}