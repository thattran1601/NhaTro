import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getChiTietPhong } from "../api/Phongapi";

export default function RoomDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [devices, setDevices] = useState([]);

  const fetchRoomDetail = async () => {
    try {
      const res = await getChiTietPhong(id);

      const rows = Array.isArray(res.data) ? res.data : [];

      if (rows.length === 0) {
        setRoom(null);
        setCustomer(null);
        setDevices([]);
        return;
      }

      const first = rows[0];

      setRoom({
        MaPhong: first.MaPhong,
        TenPhong: first.TenPhong,
        TinhTrangPhong: first.TinhTrangPhong,
      });

      setCustomer(
        first.TenKhachHang
          ? {
              TenKhachHang: first.TenKhachHang,
              SDT: first.SDT,
            }
          : null
      );

      const deviceList = rows
        .filter((item) => item.TenThietBi)
        .map((item, index) => ({
          id: index,
          TenThietBi: item.TenThietBi,
          SoSeri: item.SoSeri,
          TinhTrangThietBi: item.TinhTrangThietBi,
        }));

      setDevices(deviceList);
    } catch (error) {
      console.error("Lỗi tải chi tiết phòng:", error);
      alert(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Lỗi tải chi tiết phòng"
      );
    }
  };

  useEffect(() => {
    fetchRoomDetail();
  }, [id]);

  if (!room) {
    return (
      <div className="min-h-screen bg-[#f4f7f5] px-12 py-10">
        <h1 className="text-3xl font-black text-[#09152f]">
          Không tìm thấy phòng
        </h1>
      </div>
    );
  }

  const getRoomStatus = (status) => {
    return Number(status) === 1 ? "Đang thuê" : "Phòng trống";
  };

  const getDeviceStatus = (status) => {
    if (Number(status) === 0) return "Hoạt động tốt";
    if (Number(status) === 1) return "Hỏng";
    if (Number(status) === 2) return "Đang sửa chữa";
    return "Không rõ";
  };

  return (
    <div className="min-h-screen bg-[#f4f7f5] px-12 py-10">
      <button
            onClick={() => navigate(-1)}
            className="mb-6 bg-white text-[#09152f] px-6 py-3 rounded-2xl font-black shadow-sm hover:bg-gray-100 transition"
          >
            ← QUAY LẠI
          </button>

      <div className="mb-10">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-600 px-5 py-2 rounded-full font-bold text-sm tracking-widest">
          <span>●</span>
          CHI TIẾT PHÒNG
        </div>

        <h1 className="text-5xl font-black mt-5 text-[#09152f]">
          {room.TenPhong}
        </h1>

        <p className="text-gray-400 font-bold tracking-widest mt-4">
          TRẠNG THÁI: {getRoomStatus(room.TinhTrangPhong)}
        </p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-5 bg-white rounded-[30px] p-8 shadow-sm">
          <h2 className="text-2xl font-black text-[#09152f] mb-6">
            THÔNG TIN PHÒNG
          </h2>

          <div className="space-y-5">
            <div className="bg-[#f6f7f8] rounded-2xl p-5">
              <p className="text-gray-400 font-bold text-sm">MÃ PHÒNG</p>
              <p className="text-xl font-black text-[#09152f]">
                #{room.MaPhong}
              </p>
            </div>

            <div className="bg-[#f6f7f8] rounded-2xl p-5">
              <p className="text-gray-400 font-bold text-sm">TÊN PHÒNG</p>
              <p className="text-xl font-black text-[#09152f]">
                {room.TenPhong}
              </p>
            </div>

            <div className="bg-[#f6f7f8] rounded-2xl p-5">
              <p className="text-gray-400 font-bold text-sm">TÌNH TRẠNG</p>
              <p
                className={`text-xl font-black ${
                  Number(room.TinhTrangPhong) === 1
                    ? "text-red-500"
                    : "text-green-600"
                }`}
              >
                {getRoomStatus(room.TinhTrangPhong)}
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-7 bg-white rounded-[30px] p-8 shadow-sm">
          <h2 className="text-2xl font-black text-[#09152f] mb-6">
            NGƯỜI THUÊ
          </h2>

          {customer ? (
            <div className="bg-green-50 rounded-2xl p-6">
              <p className="text-2xl font-black text-[#09152f]">
                {customer.TenKhachHang}
              </p>

              <p className="text-gray-500 font-bold mt-3">
                ☎ {customer.SDT}
              </p>
            </div>
          ) : (
            <div className="bg-gray-100 rounded-2xl p-6 text-gray-400 font-bold">
              Phòng này chưa có người thuê
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-[30px] p-8 shadow-sm mt-8">
        <h2 className="text-2xl font-black text-[#09152f] mb-6">
          THIẾT BỊ TRONG PHÒNG
        </h2>

        {devices.length > 0 ? (
          <div className="space-y-4">
            {devices.map((device) => (
              <div
                key={device.id}
                className="grid grid-cols-12 items-center bg-[#f6f7f8] rounded-2xl px-6 py-5"
              >
                <div className="col-span-5">
                  <p className="text-lg font-black text-[#09152f]">
                    {device.TenThietBi}
                  </p>
                </div>

                <div className="col-span-4">
                  <p className="text-gray-500 font-bold">
                    Seri: {device.SoSeri}
                  </p>
                </div>

                <div className="col-span-3 text-right">
                  <span className="bg-white px-5 py-3 rounded-xl font-black text-gray-500">
                    {getDeviceStatus(device.TinhTrangThietBi)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-100 rounded-2xl p-6 text-gray-400 font-bold">
            Phòng này chưa có thiết bị
          </div>
        )}
      </div>
    </div>
  );
}