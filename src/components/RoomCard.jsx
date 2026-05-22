import { useNavigate } from "react-router-dom";
export default function RoomCard({ room , onEdit, onDelete}) {
  const navigate = useNavigate();
  const giaThue= Number(room?.GiaThue || 0);
  const getStatus= () => {
    if(room?.TinhTrang === 0) return "Trống"
    if(room?.TinhTrang === 1) return "Đã thuê"
    return "Bảo trì"
  }
    return (
         <div className="bg-white rounded-[32px] p-5 shadow-sm hover:-translate-y-2 transition-all">

            <img
                src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
                className="w-full h-80 object-cover rounded-[28px]"
                alt={room.TenPhong}
            />
            <div className="flex justify-between mt-6 items-center">
              
              <h2 className="text-4xl font-black">
                {room.TenPhong || "Chưa có tên phòng"}
                </h2>

              <div className="text-right">
                <p className="text-gray-400 text-xs">
                  GIÁ NIÊM YẾT
                </p>

                <p className="text-green-500 font-bold text-xl">
                  {giaThue.toLocaleString("vi-VN")}đ
                </p>
              </div>

            </div>

            <div className="flex justify-between mt-5 text-gray-400 text-sm">

              <span>
                Mã: {room.MaPhong}
              </span>

              <span
                className={`font-semibold ${
                  room.TinhTrang === 0
                    ? "text-green-500"
                    : room.TinhTrang === 1
                    ? "text-blue-500"
                    : "text-orange-500"
                }`}
              >
                {getStatus()}
              </span>

            </div>

            <div className="flex gap-3 mt-5">

              <button
                onClick={() => navigate(`/rooms/${room.MaPhong}/detail`)}
                className="flex-1 bg-[#eef4ff] text-blue-600 py-4 rounded-2xl font-black hover:bg-blue-600 hover:text-white transition shadow-sm"
              >
                CHI TIẾT PHÒNG
              </button>

              {Number(room.TinhTrang) === 1 ? (
                <button
                  onClick={() => navigate(`/rooms/${room.MaPhong}/contract`)}
                className="flex-1 bg-[#eef4ff] text-black-600 py-4 rounded-2xl font-black hover:bg-orange-500 hover:text-white transition shadow-sm"

                >
                  HỢP ĐỒNG
                </button>
              ) : (
                <button
                  onClick={() => {
                    const ok = window.confirm("Bạn có chắc muốn xóa phòng này không?");
                    if (ok) onDelete(room.MaPhong);
                  }}
                  className="flex-1 bg-red-50 text-red-500 py-4 rounded-2xl font-black hover:bg-red-600 hover:text-white transition shadow-sm"
                >
                  XÓA
                </button>
              )}

            </div>

          </div>
    )
}