import { useEffect, useState } from "react";

export default function AssignDeviceModal({
  device,
  rooms,
  onSave,
  onClose
}) {
  const [form, setForm] = useState({
    MaPhong: "",
    MaTB: "",
    TinhTrang: 0
  });

  useEffect(() => {
    if (device) {
      setForm({
        MaPhong: "",
        MaTB: device.MaTB,
        TinhTrang: 0
      });
    }
  }, [device]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.name === "TinhTrang"
          ? Number(e.target.value)
          : e.target.value
    });
  };

  const handleSubmit = () => {
    if (!form.MaPhong) {
      alert("Vui lòng chọn phòng");
      return;
    }

    if (!form.MaTB) {
      alert("Vui lòng chọn thiết bị");
      return;
    }

    onSave({
      MaPhong: Number(form.MaPhong),
      MaTB: Number(form.MaTB),
      TinhTrang: Number(form.TinhTrang)
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-[36px] p-10 w-[560px] shadow-2xl">

        <h2 className="text-4xl font-black text-[#09152f] mb-8">
          GÁN THIẾT BỊ VÀO PHÒNG
        </h2>

        {device && (
          <div className="bg-green-50 text-green-700 rounded-2xl p-5 mb-6 font-bold">
            Thiết bị: {device.TenTB} — Mã #{device.MaTB}
          </div>
        )}

        <div className="space-y-5">

          {/* SELECT PHÒNG */}
          <select
            name="MaPhong"
            value={form.MaPhong}
            onChange={handleChange}
            className="w-full bg-[#f6f7f8] px-6 py-5 rounded-2xl outline-none font-semibold"
          >
            <option value="">
              Chọn phòng
            </option>

            {rooms.map((room) => (
              <option
                key={room.MaPhong}
                value={room.MaPhong}
              >
                {room.TenPhong} - {Number(room.GiaThue).toLocaleString("vi-VN")}đ
              </option>
            ))}
          </select>

          {/* MÃ THIẾT BỊ */}
          <input
            name="MaTB"
            value={form.MaTB}
            onChange={handleChange}
            placeholder="Mã thiết bị"
            disabled={!!device}
            className="w-full bg-[#f6f7f8] px-6 py-5 rounded-2xl outline-none font-semibold disabled:text-gray-400"
          />

          {/* SELECT TÌNH TRẠNG */}
          <select
            name="TinhTrang"
            value={form.TinhTrang}
            onChange={handleChange}
            className="w-full bg-[#f6f7f8] px-6 py-5 rounded-2xl outline-none font-semibold"
          >
            <option value={0}>HOẠT ĐỘNG TỐT</option>
            <option value={1}>HỎNG</option>
            <option value={2}>ĐANG SỬA CHỮA</option>
          </select>

        </div>

        <div className="flex gap-4 mt-10">

          <button
            onClick={handleSubmit}
            className="flex-1 bg-green-600 text-white py-5 rounded-2xl font-black"
          >
            GÁN
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