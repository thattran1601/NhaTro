import { useEffect, useState } from "react";

export default function CustomerModal({
  customer,
  onSave,
  onClose
}) {
  const [form, setForm] = useState({
    HoTen: "",
    CCCD: "",
    SDT: "",
    AnhCCCD: ""
  });

  useEffect(() => {
    if (customer) {
      setForm({
        HoTen: customer.HoTen || "",
        CCCD: customer.CCCD || "",
        SDT: customer.SDT || "",
        AnhCCCD: customer.AnhCCCD || ""
      });
    }
  }, [customer]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-[36px] p-10 w-[560px] shadow-2xl">
        <h2 className="text-3xl font-black text-[#09152f] mb-8">
          {customer ? "CHỈNH SỬA CƯ DÂN" : "THÊM CƯ DÂN"}
        </h2>

        <div className="space-y-5">
          <input
            name="HoTen"
            value={form.HoTen}
            onChange={handleChange}
            placeholder="Họ tên"
            className="w-full bg-[#f6f7f8] px-6 py-5 rounded-2xl outline-none font-semibold"
          />

          <input
            name="CCCD"
            value={form.CCCD}
            onChange={handleChange}
            placeholder="CCCD"
            className="w-full bg-[#f6f7f8] px-6 py-5 rounded-2xl outline-none font-semibold"
          />

          <input
            name="SDT"
            value={form.SDT}
            onChange={handleChange}
            placeholder="Số điện thoại"
            className="w-full bg-[#f6f7f8] px-6 py-5 rounded-2xl outline-none font-semibold"
          />

          <input
            name="AnhCCCD"
            value={form.AnhCCCD}
            onChange={handleChange}
            placeholder="Link ảnh CCCD"
            className="w-full bg-[#f6f7f8] px-6 py-5 rounded-2xl outline-none font-semibold"
          />
        </div>

        <div className="flex gap-4 mt-10">
          <button
            onClick={() => onSave(form)}
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