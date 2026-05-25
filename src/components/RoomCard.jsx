import { useNavigate } from "react-router-dom";
export default function RoomCard({ room , onEdit, onDelete, contracts = []}) {
  const navigate = useNavigate();
  const giaThue= Number(room?.GiaThue || 0);
  const getStatus = (room) => {
      if (Number(room.TinhTrang) === 2) {
        return {
          text: "BẢO TRÌ",
          className: "bg-orange-50 text-orange-600 border-orange-200",
        };
      }

      if (Number(room.TinhTrang) === 1) {
        return {
          text: "ĐÃ ĐẦY",
          className: "bg-red-50 text-red-600 border-red-200",
        };
      }

      return {
        text: "CÒN CHỖ",
        className: "bg-green-50 text-green-600 border-green-200",
      };
    };

  const getRoomCurrentPeople = (MaPhong) => {
    return contracts.filter(
      (contract) =>
        Number(contract.MaPhong) === Number(MaPhong) &&
        Number(contract.TrangThai) === 1
    ).length;
  };
  const currentPeople = getRoomCurrentPeople(room.MaPhong);
  const maxPeople = Number(room.SoNguoi || 0);
  const status = getStatus(room);

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

                <p className="text-gray-500 font-bold mb-8">
                  Số người: {currentPeople}/{maxPeople || "?"}
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
                {getStatus(room)?.text}
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
                  onClick={() => navigate(`/rooms/${room.MaPhong}/contracts`)}
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