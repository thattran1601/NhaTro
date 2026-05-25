import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getHopdongByPhong, renewHopdong } from "../api/HopdongApi";
import { getPhongById } from "../api/phongApi";
import { getKhachhangById } from "../api/KhachhangApi";

export default function ContractPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [contracts, setContracts] = useState([]);// Danh sách hợp đồng của phòng
  const [room, setRoom] = useState(null);// Thông tin phòng
  const [customersMap, setCustomersMap] = useState({});// Bản đồ khách hàng theo MaKH để dễ truy xuất khi hiển thị hợp đồng
  const [loading, setLoading] = useState(true);// Trạng thái tải dữ liệu
  const [showRenewModal, setShowRenewModal] = useState(false);// Trạng thái hiển thị modal gia hạn hợp đồng
  const [renewContract, setRenewContract] = useState(null);// Hợp đồng đang được chọn để gia hạn
  const [renewEndDate, setRenewEndDate] = useState("");// Ngày kết thúc mới khi gia hạn hợp đồng

  // Hàm tải dữ liệu hợp đồng và thông tin phòng, khách hàng liên quan
  const fetchContractData = async () => {
    try {
      setLoading(true);

      const roomRes = await getPhongById(id);
      setRoom(roomRes.data);

      const contractRes = await getHopdongByPhong(id);

      const contractList = Array.isArray(contractRes.data.data)
        ? contractRes.data.data
        : [];

      setContracts(contractList);

      if (contractList.length === 0) {
        setCustomersMap({});
        return;
      }

      const uniqueCustomerIds = [
        ...new Set(
          contractList
            .filter((contract) => contract.MaKH)
            .map((contract) => contract.MaKH)
        ),
      ];

      const customerResults = await Promise.all(
        uniqueCustomerIds.map(async (maKH) => {
          try {
            const customerRes = await getKhachhangById(maKH);

            return {
              MaKH: maKH,
              data: customerRes.data?.data || null,
            };
          } catch (error) {
            console.error(`Lỗi tải khách hàng ${maKH}:`, error);

            return {
              MaKH: maKH,
              data: null,
            };
          }
        })
      );

      const map = {};

      customerResults.forEach((item) => {
        map[item.MaKH] = item.data;
      });

      setCustomersMap(map);
    } catch (error) {
      console.error("Lỗi tải hợp đồng:", error);
      setContracts([]);
      setCustomersMap({});
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

    if (isNaN(s.getTime()) || isNaN(e.getTime())) return "---";
    if (e <= s) return "---";

    let months =
      (e.getFullYear() - s.getFullYear()) * 12 +
      (e.getMonth() - s.getMonth());

    // Nếu ngày kết thúc nhỏ hơn ngày bắt đầu thì chưa đủ tròn tháng
    if (e.getDate() < s.getDate()) {
      months -= 1;
    }

    return months > 0 ? `${months} THÁNG` : "DƯỚI 1 THÁNG";
  };

  const getStatusBadge = (status) => {
    if (Number(status) === 1) {
      return {
        text: "ĐANG HIỆU LỰC",
        className:
          "bg-green-50 text-green-600 border border-green-200",
      };
    }

    return {
      text: "KHÔNG HOẠT ĐỘNG",
      className:
        "bg-orange-50 text-orange-600 border border-orange-200",
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f7f5] px-12 py-10">
        Đang tải hợp đồng...
      </div>
    );
  }

  if (contracts.length === 0) {
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

  const activeContracts = contracts.filter(
    (contract) => Number(contract.TrangThai) === 1
  );

  const handleOpenRenew = (contract) => {
  setRenewContract(contract);
  setRenewEndDate("");
  setShowRenewModal(true);
};

const handleRenewContract = async () => {
  if (!renewContract) {
    return alert("Không tìm thấy hợp đồng cần gia hạn");
  }

  if (!renewEndDate) {
    return alert("Vui lòng chọn ngày kết thúc mới");
  }

  const oldEndDate = new Date(renewContract.NgayKT);
  const newEndDate = new Date(renewEndDate);

  if (newEndDate <= oldEndDate) {
    return alert("Ngày kết thúc mới phải lớn hơn ngày kết thúc hiện tại");
  }

  try {
    const res = await renewHopdong({
      MaHD: renewContract.MaHD,
      NgayKT: renewEndDate,
    });

    alert(res.data?.message || "Gia hạn hợp đồng thành công");

    setShowRenewModal(false);
    setRenewContract(null);
    setRenewEndDate("");

    await fetchContractData();
  } catch (error) {
    console.error("Lỗi gia hạn hợp đồng:", error);

    alert(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Lỗi gia hạn hợp đồng"
    );
  }
};

  return (
    <div className="min-h-screen bg-[#f4f7f5] px-12 py-10">
      <button
        onClick={() => navigate("/")}
        className="bg-white px-6 py-3 rounded-2xl font-bold mb-8"
      >
        ← Quay lại
      </button>

      <div className="mb-12">
        <h1 className="text-5xl font-black italic text-[#09152f]">
          DANH SÁCH
          <span className="text-green-600"> HỢP ĐỒNG</span>
        </h1>

        <p className="text-gray-400 tracking-[0.35em] font-black mt-4">
          PHÒNG {room?.TenPhong || `#${id}`} • {activeContracts.length}/
          {room?.SoNguoi || "?"} NGƯỜI ĐANG THUÊ
        </p>
      </div>

      <div className="space-y-10">
        {contracts.map((contract, index) => {
          const customer = customersMap[contract.MaKH];
          const status = getStatusBadge(contract.TrangThai);

          return (
            <div
              key={contract.MaHD || `${contract.MaKH}-${index}`}
              className="grid grid-cols-12 gap-10"
            >
              {/* LEFT CUSTOMER CARD */}
              <div className="col-span-4">
                <div className="bg-white rounded-[40px] p-10 shadow-sm h-full">
                  <div className="relative w-36 h-36 bg-[#f8faf9] rounded-[30px] mx-auto mb-8 flex items-center justify-center overflow-hidden">
                    {customer?.TruocCCCD ? (
                      <img
                        src={`${
                          import.meta.env.VITE_API_URL
                        }/../uploads/cccd/${customer.TruocCCCD}`}
                        alt={customer.HoTen}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-6xl font-black text-green-600">
                        {customer?.HoTen?.charAt(0) || "K"}
                      </span>
                    )}

                    <div className="absolute right-[-8px] bottom-[-8px] w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center text-white font-black shadow-xl">
                      {index + 1}
                    </div>
                  </div>

                  <h2 className="text-2xl font-black italic text-center text-[#09152f] uppercase">
                    {customer?.HoTen || "Chưa có khách hàng"}
                  </h2>

                  <p className="text-center text-gray-400 font-black mt-3">
                    KH-{contract.MaKH}
                  </p>

                  <div className="mt-10 space-y-5">
                    <div className="bg-[#f8faf9] rounded-3xl p-5 flex items-center gap-5">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-green-600 font-black shadow-sm">
                        ☎
                      </div>

                      <div>
                        <p className="text-gray-400 font-black text-sm">
                          SỐ ĐIỆN THOẠI
                        </p>

                        <p className="font-black text-lg mt-1">
                          {customer?.SDT || "---"}
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#f8faf9] rounded-3xl p-5 flex items-center gap-5">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-green-600 font-black shadow-sm">
                        @
                      </div>

                      <div>
                        <p className="text-gray-400 font-black text-sm">
                          CCCD
                        </p>

                        <p className="font-black text-lg mt-1">
                          {customer?.CCCD || "---"}
                        </p>
                      </div>
                                    
                    </div>
                    
                  </div>
                </div>
              </div>

              {/* RIGHT CONTRACT CARD */}
              <div className="col-span-8">
                <div className="bg-white rounded-[40px] shadow-sm overflow-hidden">
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
                  <div className="flex items-center gap-3">
                    <span
                      className={`${status.className} px-8 py-4 rounded-2xl font-black`}
                    >
                      {status.text}
                    </span>

                    {Number(contract.TrangThai) === 1 && (
                      <button
                        onClick={() => handleOpenRenew(contract)}
                        className="bg-blue-50 text-blue-600 px-8 py-4 rounded-2xl font-black hover:bg-blue-600 hover:text-white transition"
                      >
                        GIA HẠN
                      </button>
                    )}
                  </div>
                  </div>

                  <div className="grid grid-cols-2 gap-10 p-10">
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
              {showRenewModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-6">
                  <div className="bg-white rounded-[36px] p-10 w-[560px] shadow-2xl">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-5 py-2 rounded-full font-black text-xs tracking-widest mb-4">
                          <span>●</span>
                          GIA HẠN HỢP ĐỒNG
                        </div>

                        <h2 className="text-3xl font-black text-[#09152f]">
                          HỢP ĐỒNG HD-
                          {String(renewContract?.MaHD || "").padStart(5, "0")}
                        </h2>

                        <p className="text-gray-400 font-bold mt-3">
                          Chọn ngày kết thúc mới cho hợp đồng
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setShowRenewModal(false);
                          setRenewContract(null);
                          setRenewEndDate("");
                        }}
                        className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-500 font-black hover:bg-gray-200 transition"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="space-y-5">
                      <div className="bg-[#f6f7f8] rounded-2xl p-5">
                        <p className="text-gray-400 font-black text-sm">
                          NGÀY BẮT ĐẦU HỢP ĐỒNG MỚI
                        </p>

                        <p className="text-xl font-black text-[#09152f] mt-2">
                          {formatDate(renewContract?.NgayKT)}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-black text-gray-400 tracking-widest mb-3">
                          NGÀY KẾT THÚC HỢP ĐỒNG MỚI
                        </label>

                        <input
                          type="date"
                          value={renewEndDate}
                          onChange={(e) => setRenewEndDate(e.target.value)}
                          className="w-full bg-[#f6f7f8] px-6 py-5 rounded-2xl outline-none font-bold text-[#09152f]"
                        />
                      </div>

                      <div className="bg-orange-50 rounded-2xl p-5">
                        <p className="text-orange-600 font-bold text-sm leading-relaxed">
                          Lưu ý: Hệ thống chỉ cho phép gia hạn trong vòng 7 ngày trước hạn
                          hoặc sau khi hợp đồng đã hết hạn.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-10">
                      <button
                        onClick={handleRenewContract}
                        className="flex-1 bg-blue-600 text-white py-5 rounded-2xl font-black hover:bg-blue-700 transition"
                      >
                        XÁC NHẬN GIA HẠN
                      </button>

                      <button
                        onClick={() => {
                          setShowRenewModal(false);
                          setRenewContract(null);
                          setRenewEndDate("");
                        }}
                        className="flex-1 bg-gray-100 text-gray-500 py-5 rounded-2xl font-black hover:bg-gray-200 transition"
                      >
                        HỦY
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}