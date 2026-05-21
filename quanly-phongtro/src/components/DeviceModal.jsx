import { useEffect, useState } from "react";

export default function DeviceModal({
  device,
  onSave,
  onClose
}) {
  const [form, setForm] = useState({
    TenTB: "",
    SoSeri: "",
    TinhTrang: 0,
    MaPhong: null
  });

  useEffect(() => {
    if (device) {
      setForm({
        TenTB: device.TenTB || "",
        SoSeri: device.SoSeri || "",
        TinhTrang: Number(device.TinhTrang ?? 0),
        MaPhong: device.MaPhong || null
      });
    } else {
      setForm({
        TenTB: "",
        SoSeri: "",
        TinhTrang: 0,
        MaPhong: null
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
    if (!form.TenTB.trim()) {
      alert("Vui lòng nhập tên thiết bị");
      return;
    }

    if (!form.SoSeri.trim()) {
      alert("Vui lòng nhập số seri");
      return;
    }

    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-[36px] p-10 w-[560px] shadow-2xl">

        <h2 className="text-4xl font-black text-[#09152f] mb-8">
          {device ? "SỬA THIẾT BỊ" : "THÊM THIẾT BỊ"}
        </h2>

        <div className="space-y-5">

          <input
            name="TenTB"
            value={form.TenTB}
            onChange={handleChange}
            placeholder="Tên thiết bị"
            className="w-full bg-[#f6f7f8] px-6 py-5 rounded-2xl outline-none font-semibold"
          />

          <input
            name="SoSeri"
            value={form.SoSeri}
            onChange={handleChange}
            placeholder="Số seri"
            className="w-full bg-[#f6f7f8] px-6 py-5 rounded-2xl outline-none font-semibold"
          />

          {device && device.MaPhong && (
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
          )}

          {device && !device.MaPhong && (
            <div className="bg-gray-100 text-gray-500 px-6 py-5 rounded-2xl font-bold">
              Thiết bị chưa gán phòng nên chưa có tình trạng.
            </div>
          )}

        </div>

        <div className="flex gap-4 mt-10">

          <button
            onClick={handleSubmit}
            className="flex-1 bg-green-600 text-white py-5 rounded-2xl font-black"
          >
            LƯU
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