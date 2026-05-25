//useState: quản lý trạng thái của component, useEffect: thực hiện các tác vụ phụ như gọi API
import { useEffect, useState } from "react";
//useNavigate: điều hướng giữa các trang, useParams: lấy tham số từ URL
import { useNavigate, useParams } from "react-router-dom";
import { getChiTietPhong,updatePhong,getPhongById } from "../api/phongApi";
import AddRoomModal from "../components/addRoomModal";

export default function RoomDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);// Lưu thông tin chi tiết phòng
  const [customers, setCustomers] = useState([]);// Lưu danh sách khách thuê trong phòng
  const [devices, setDevices] = useState([]);// Lưu danh sách thiết bị trong phòng
  const [showEditModal, setShowEditModal] = useState(false);// Điều khiển hiển thị modal sửa phòng

  const fetchRoomDetail = async () => {// Hàm tải chi tiết phòng từ API
  try {
    // Gọi API lấy chi tiết phòng theo id từ URL
    const res = await getChiTietPhong(id);
    const roomRes = await getPhongById(id);
    const roomInfo = roomRes.data;
    // Kiểm tra dữ liệu trả về có hợp lệ không
    const rows = Array.isArray(res.data) ? res.data : [];
    // Nếu không có dữ liệu nào, đặt room là null và xóa danh sách khách thuê và thiết bị
    if (rows.length === 0) {
      setRoom(null);
      setCustomers([]);
      setDevices([]);
      return;
    }
    // Lấy thông tin phòng từ dòng đầu tiên
    const first = rows[0];
    // Cập nhật state room với thông tin chi tiết phòng
    setRoom({
      MaPhong: roomInfo.MaPhong,
      TenPhong: roomInfo.TenPhong,
      GiaThue: roomInfo.GiaThue,
      SoNguoi: roomInfo.SoNguoi,  
      TinhTrangPhong: roomInfo.TinhTrang,
    });

    // Gom danh sách người thuê theo API hiện tại
    const uniqueCustomers = [];

    // Duyệt qua tất cả các dòng dữ liệu trả về từ API
    rows.forEach((item) => {
      if (!item.TenKhachHang) return;
      // Kiểm tra xem khách hàng đã tồn tại trong danh sách uniqueCustomers chưa
      const existed = uniqueCustomers.some(
        (customer) =>
          customer.TenKhachHang === item.TenKhachHang &&
          customer.SDT === item.SDT
      );
      // Nếu khách hàng chưa tồn tại, thêm vào danh sách uniqueCustomers
      if (!existed) {
        uniqueCustomers.push({
          TenKhachHang: item.TenKhachHang,
          SDT: item.SDT,
        });
      }
    });
    // Cập nhật state customers với danh sách khách thuê duy nhất
    setCustomers(uniqueCustomers);

    // Gom danh sách thiết bị theo API hiện tại
    const uniqueDevices = [];
    // Duyệt qua tất cả các dòng dữ liệu trả về từ API
    rows.forEach((item) => {
      if (!item.TenThietBi) return;
      // Kiểm tra xem thiết bị đã tồn tại trong danh sách uniqueDevices chưa
      const existed = uniqueDevices.some(
        (device) =>
          device.TenThietBi === item.TenThietBi &&
          device.SoSeri === item.SoSeri
      );
      // Nếu thiết bị chưa tồn tại, thêm vào danh sách uniqueDevices
      if (!existed) {
        uniqueDevices.push({
          TenThietBi: item.TenThietBi,
          SoSeri: item.SoSeri,
          TinhTrangThietBi: item.TinhTrangThietBi,
        });
      }
    });
    // Cập nhật state devices với danh sách thiết bị duy nhất
    setDevices(uniqueDevices);
  } catch (error) {
    console.error("Lỗi tải chi tiết phòng:", error);

    alert(
      error.response?.data?.error ||
        error.response?.data?.message ||
        "Lỗi tải chi tiết phòng"
    );
  }
};
  //useEffect để gọi hàm fetchRoomDetail khi component được render hoặc khi id thay đổi
  useEffect(() => {
    fetchRoomDetail();
  }, [id]);
  // Nếu không tìm thấy phòng, hiển thị thông báo lỗi
  if (!room) {
    return (
      <div className="min-h-screen bg-[#f4f7f5] px-12 py-10">
        <h1 className="text-3xl font-black text-[#09152f]">
          Không tìm thấy phòng
        </h1>
      </div>
    );
  }
  // Hàm chuyển đổi trạng thái phòng thành chuỗi hiển thị
  const getRoomStatus = (status) => {
    return Number(status) === 1 ? "Đang thuê" : "Phòng trống";
  };
  // Hàm chuyển đổi trạng thái thiết bị thành chuỗi hiển thị
  const getDeviceStatus = (status) => {
    if (Number(status) === 0) return "Hoạt động tốt";
    if (Number(status) === 1) return "Hỏng";
    if (Number(status) === 2) return "Đang sửa chữa";
    return "Không rõ";
  };
  // Hàm xử lý khi lưu phòng sau khi sửa
  const handleUpdateRoom = async (data) => {
    try {
      await updatePhong(room.MaPhong, {
        TenPhong: data.TenPhong,
        GiaThue: data.GiaThue,
        SoNguoi: data.SoNguoi,
        TinhTrang: data.TinhTrang,
      });

      alert("Cập nhật phòng thành công");

      setShowEditModal(false);
      await fetchRoomDetail();
    } catch (error) {
      console.error("Lỗi cập nhật phòng:", error);

      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Lỗi cập nhật phòng"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f5] px-12 py-10">
      <div className="flex justify-between items-center mb-6">
      <button
        onClick={() => navigate(-1)}
        className="bg-white text-[#09152f] px-8 py-4 rounded-2xl font-black shadow-sm hover:bg-gray-100 transition"
      >
        ← QUAY LẠI
      </button>

      <button
        onClick={() => setShowEditModal(true)}
        className="bg-green-600 text-white px-10 py-4 rounded-2xl font-black shadow-lg hover:bg-green-700 transition"
      >
        SỬA PHÒNG
      </button>
    </div>

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

         {customers.length > 0 ? (
  <div className="space-y-4">
    {customers.map((customer, index) => (
      <div
        key={`${customer.TenKhachHang}-${customer.SDT}-${index}`}
        className="bg-green-50 rounded-2xl p-6 flex justify-between items-center"
      >
        <div>
          <p className="text-2xl font-black text-[#09152f] uppercase">
            {customer.TenKhachHang}
          </p>

          <p className="text-gray-500 font-bold mt-3">
            ☎ {customer.SDT || "---"}
          </p>
        </div>

        <div className="text-right">
          <p className="text-green-600 font-black">
            NGƯỜI THUÊ #{index + 1}
          </p>

          <p className="text-gray-400 text-sm font-bold mt-2">
            Đang lưu trú
          </p>
        </div>
      </div>
    ))}
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
      {showEditModal && (
        <AddRoomModal
          setShowModal={setShowEditModal}
          addRoom={handleUpdateRoom}
          editRoom={{
            MaPhong: room.MaPhong,
            TenPhong: room.TenPhong,
            GiaThue: room.GiaThue || "",
            SoNguoi: room.SoNguoi || "",
            TinhTrang: room.TinhTrangPhong,
          }}
        />
      )}
    </div>
  );
}