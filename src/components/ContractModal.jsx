import { useEffect, useState } from "react";

export default function ContractModal({
  customers,
  rooms,
  selectedCustomer,
  onSave,
  onClose
}) {
const today = new Date().toISOString().slice(0, 10);

const [form, setForm] = useState({
  MaKH: "",
  MaPhong: "",
  NgayTao: today,
  NgayKT: "",
  TienCoc: "",
  TrangThai: 1
});

  useEffect(() => {
    if (selectedCustomer) {
      setForm((prev) => ({
        ...prev,
        MaKH: selectedCustomer.MaKH
      }));
    }
  }, [selectedCustomer]);

  const emptyRooms = rooms.filter((room) => Number(room.TinhTrang) === 0);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.name === "TrangThai"
          ? Number(e.target.value)
          : e.target.value
    });
  };

  const handleSubmit = () => {
    if (!form.MaKH) {
      alert("Vui lòng chọn khách hàng");
      return;
    }

    if (!form.MaPhong) {
      alert("Vui lòng chọn phòng");
      return;
    }

    if (!form.NgayKT) {
      alert("Vui lòng chọn ngày kết thúc hợp đồng");
      return;
    }
  
      onSave({
      MaKH: Number(form.MaKH),
      MaPhong: Number(form.MaPhong),
      NgayKT: form.NgayKT,
      TienCoc: Number(form.TienCoc || 0),
      TrangThai: Number(form.TrangThai)
    });
  };

   return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-[36px] p-10 w-[620px] shadow-2xl">
        <h2 className="text-4xl font-black text-[#09152f] mb-8">
          TẠO HỢP ĐỒNG THUÊ NHÀ
        </h2>

        <div className="space-y-5">
          <select
            name="MaKH"
            value={form.MaKH}
            onChange={handleChange}
            disabled={!!selectedCustomer}
            className="w-full bg-[#f6f7f8] px-6 py-5 rounded-2xl outline-none font-semibold disabled:text-gray-400"
          >
            <option value="">Chọn khách hàng</option>

            {customers.map((customer) => (
              <option key={customer.MaKH} value={customer.MaKH}>
                {customer.HoTen} - {customer.SDT}
              </option>
            ))}
          </select>
          <select
            name="MaPhong"
            value={form.MaPhong}
            onChange={handleChange}
            className="w-full bg-[#f6f7f8] px-6 py-5 rounded-2xl outline-none font-semibold"
          >
            <option value="">Chọn phòng trống</option>

            {emptyRooms.map((room) => (
              <option key={room.MaPhong} value={room.MaPhong}>
                {room.TenPhong} - {Number(room.GiaThue).toLocaleString("vi-VN")}đ
              </option>
            ))}
          </select>

            <p className="text-gray-400 font-bold mb-2 ml-2">Ngày bắt đầu</p>
          <input
            type="date"
            name="NgayTao"
            value={form.NgayTao}
            onChange={handleChange}
            className="w-full bg-[#f6f7f8] px-6 py-5 rounded-2xl outline-none font-semibold"
          />
            <p className="text-gray-400 font-bold mb-2 ml-2">Ngày kết thúc</p>
          <input
            type="date"
            name="NgayKT"
            value={form.NgayKT}
            onChange={handleChange}
            className="w-full bg-[#f6f7f8] px-6 py-5 rounded-2xl outline-none font-semibold"
          />
          <input
            name="TienCoc"
            value={form.TienCoc}
            onChange={handleChange}
            placeholder="Tiền cọc"
            className="w-full bg-[#f6f7f8] px-6 py-5 rounded-2xl outline-none font-semibold"
          />

          <select
            name="TrangThai"
            value={form.TrangThai}
            onChange={handleChange}
            className="w-full bg-[#f6f7f8] px-6 py-5 rounded-2xl outline-none font-semibold"
          >
            <option value={1}>ĐANG HOẠT ĐỘNG</option>
            <option value={0}>CHƯA KÍCH HOẠT</option>
          </select>
        </div>

        <div className="flex gap-4 mt-10">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-green-600 text-white py-5 rounded-2xl font-black"
          >
            TẠO HỢP ĐỒNG
          </button>

          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-500 py-5 rounded-2xl font-black"
          >
            HỦY
          </button>
        </div>
      </div>
    </div>
  );
}