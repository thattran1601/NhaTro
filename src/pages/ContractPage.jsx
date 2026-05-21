        {/* LEFT CUSTOMER CARD */}
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getHopdongByPhong } from "../api/HopdongApi";
import { getPhongById } from "../api/PhongApi";
import { getKhachhangById } from "../api/KhachhangApi";

export default function ContractPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [contract, setContract] = useState(null);
  const [room, setRoom] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchContractData = async () => {
    try {
      setLoading(true);

      const roomRes = await getPhongById(id);
      setRoom(roomRes.data);

      const contractRes = await getHopdongByPhong(id);

      const contracts = Array.isArray(contractRes.data.data)
        ? contractRes.data.data
        : [];

      if (contracts.length === 0) {
        setContract(null);
        setCustomer(null);
        return;
      }

      const latestContract = contracts[0];
      setContract(latestContract);

      if (latestContract.MaKH) {
        const customerRes = await getKhachhangById(latestContract.MaKH);
        setCustomer(customerRes.data.data);
      }
    } catch (error) {
      console.error("Lỗi tải hợp đồng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContractData();
  }, [id]);

  const formatMoney = (value) => {
    return Number(value || 0).toLocaleString("vi-VN") + "đ";
  };

  const formatDate = (value) => {
    if (!value) return "---";
    return new Date(value).toLocaleDateString("vi-VN");
  };

  const getMonthDiff = (start, end) => {
    if (!start || !end) return "---";

    const s = new Date(start);
    const e = new Date(end);

    const months =
      (e.getFullYear() - s.getFullYear()) * 12 +
      (e.getMonth() - s.getMonth());

    return months > 0 ? `${months} THÁNG` : "---";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f7f5] px-12 py-10">
        Đang tải hợp đồng...
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen bg-[#f4f7f5] px-12 py-10">
        <button
          onClick={() => navigate("/")}
          className="bg-white px-6 py-3 rounded-2xl font-bold mb-8"
        >
          ← Quay lại
        </button>

        <div className="bg-white rounded-[40px] p-12 shadow-sm">
          <h1 className="text-4xl font-black text-[#09152f]">
            Phòng này chưa có hợp đồng
          </h1>

          <p className="text-gray-400 mt-4 font-bold">
            Bạn cần tạo hợp đồng cho phòng trước khi xem trang hợp đồng.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7f5] px-12 py-10">
      <button
        onClick={() => navigate("/")}
        className="bg-white px-6 py-3 rounded-2xl font-bold mb-8"
      >
        ← Quay lại
      </button>

      {/* TITLE */}
      <div className="mb-12">
        <h1 className="text-5xl font-black italic text-[#09152f]">
          THỎA THUẬN
          <span className="text-green-600"> LƯU TRÚ</span>
        </h1>

        <p className="text-gray-400 tracking-[0.35em] font-black mt-4">
          SUNSHINE HOME DIGITAL CONTRACT MANAGEMENT
        </p>
      </div>

      <div className="grid grid-cols-12 gap-10">
        {/* LEFT CUSTOMER CARD */}
        <div className="col-span-4">
          <div className="bg-white rounded-[40px] p-10 shadow-sm min-h-[650px]">
            <div className="relative w-44 h-44 bg-[#f8faf9] rounded-[30px] mx-auto mb-10 flex items-center justify-center overflow-hidden">
              {customer?.AnhCCCD ? (
                <img
                  src={customer.AnhCCCD}
                  alt={customer.HoTen}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-6xl font-black text-green-600">
                  {customer?.HoTen?.charAt(0) || "K"}
                </span>
              )}

              <div className="absolute right-[-8px] bottom-[-8px] w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center text-white font-black shadow-xl">
                ✓
              </div>
            </div>

            <h2 className="text-3xl font-black italic text-center text-[#09152f]">
              {customer?.HoTen || "Chưa có khách hàng"}
            </h2>

            <p className="text-center text-gray-400 font-black mt-3">
              SUNSHINE HOME: KH-{contract.MaKH}
            </p>

            <div className="mt-12 space-y-6">
              <div className="bg-[#f8faf9] rounded-3xl p-6 flex items-center gap-5">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-green-600 font-black shadow-sm">
                  ☎
                </div>

                <div>
                  <p className="text-gray-400 font-black text-sm">
                    MÃ LIÊN HỆ
                  </p>

                  <p className="font-black text-xl mt-1">
                    {customer?.SDT || "---"}
                  </p>
                </div>
              </div>

              <div className="bg-[#f8faf9] rounded-3xl p-6 flex items-center gap-5">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-green-600 font-black shadow-sm">
                  @
                </div>

                <div>
                  <p className="text-gray-400 font-black text-sm">
                    CCCD
                  </p>

                  <p className="font-black text-xl mt-1">
                    {customer?.CCCD || "---"}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t mt-12 pt-8 grid grid-cols-2 gap-4">
              <button className="bg-[#f8faf9] py-4 rounded-2xl font-black">
                IN
              </button>

              <button className="bg-[#09152f] text-white py-4 rounded-2xl font-black">
                GIA HẠN
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT CONTRACT */}
        <div className="col-span-8">
          <div className="bg-white rounded-[40px] shadow-sm overflow-hidden">
            {/* HEADER */}
            <div className="px-10 py-8 border-b flex justify-between items-center">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-green-600 shadow-sm border">
                  🛡
                </div>

                <div>
                  <h2 className="text-3xl font-black italic text-[#09152f]">
                    HỢP ĐỒNG {room?.TenPhong}
                  </h2>

                  <p className="text-gray-400 font-black mt-2">
                    SỐ: HD-{String(contract.MaHD).padStart(5, "0")}
                  </p>
                </div>
              </div>

              <span
                className={
                  Number(contract.TrangThai) === 1
                    ? "bg-green-50 text-green-600 px-8 py-4 rounded-2xl font-black border border-green-200"
                    : "bg-orange-50 text-orange-600 px-8 py-4 rounded-2xl font-black border border-orange-200"
                }
              >
                {Number(contract.TrangThai) === 1
                  ? "ĐANG VẬN HÀNH"
                  : "CHƯA KÍCH HOẠT"}
              </span>
            </div>

            {/* BODY */}
            <div className="grid grid-cols-2 gap-10 p-10">
              {/* TIME */}
              <div>
                <p className="text-gray-400 font-black tracking-widest mb-8">
                  <span className="text-green-600">•</span> THỜI HẠN THỎA THUẬN
                </p>

                <div className="space-y-6">
                  <div className="bg-[#f8faf9] rounded-3xl p-6 flex justify-between items-center">
                    <span className="text-gray-400 font-black">
                      KHỞI ĐIỂM
                    </span>

                    <span className="font-black text-xl">
                      {formatDate(contract.NgayTao)}
                    </span>
                  </div>

                  <div className="bg-red-50 rounded-3xl p-6 flex justify-between items-center border border-red-100">
                    <span className="text-red-500 font-black">
                      NGÀY KẾT THÚC
                    </span>

                    <span className="font-black text-xl text-red-500">
                      {formatDate(contract.NgayKT)}
                    </span>
                  </div>

                  <div className="bg-[#f8faf9] rounded-3xl p-6 flex justify-between items-center">
                    <span className="text-gray-400 font-black">
                      KỲ HẠN
                    </span>

                    <span className="font-black text-xl">
                      {getMonthDiff(contract.NgayTao, contract.NgayKT)}
                    </span>
                  </div>
                </div>
              </div>

              {/* MONEY */}
              <div>
                <p className="text-gray-400 font-black tracking-widest mb-8">
                  <span className="text-green-600">•</span> ĐỊNH MỨC TÀI CHÍNH
                </p>

                <div className="space-y-6">
                  <div className="bg-green-50 rounded-3xl p-6 flex justify-between items-center border border-green-100">
                    <span className="text-green-600 font-black">
                      GIÁ THUÊ
                    </span>

                    <span className="font-black text-3xl text-green-600">
                      {formatMoney(room?.GiaThue)}
                    </span>
                  </div>

                  <div className="bg-[#f8faf9] rounded-3xl p-6 flex justify-between items-center border">
                    <span className="text-gray-400 font-black">
                      KÝ QUỸ
                    </span>

                    <span className="font-black text-3xl text-[#09152f]">
                      {formatMoney(contract.TienCoc)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

         
        </div>
      </div>
    </div>
  );
}