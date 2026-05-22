import { useEffect, useMemo, useState } from "react";

export default function ContractModal({
  customers = [],
  rooms = [],
  contracts = [],
  selectedCustomer,
  onSave,
  onClose,
}) {
  const today = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    MaKH: "",
    MaPhong: "",
    NgayTao: today,
    NgayKT: "",
    TienCoc: "",
    TrangThai: 1,
  });

  useEffect(() => {
    if (selectedCustomer) {
      setForm((prev) => ({
        ...prev,
        MaKH: selectedCustomer.MaKH,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        MaKH: "",
      }));
    }
  }, [selectedCustomer]);

  const getActiveContractCountByRoom = (MaPhong) => {
    return contracts.filter(
      (contract) =>
        Number(contract.MaPhong) === Number(MaPhong) &&
        Number(contract.TrangThai) === 1
    ).length;
  };

  const availableRooms = useMemo(() => {
    return rooms.filter((room) => {
      const soNguoiToiDa = Number(room.SoNguoi || 0);
      const soNguoiHienTai = getActiveContractCountByRoom(room.MaPhong);

      if (Number(room.TinhTrang) === 2) return false;

      if (soNguoiToiDa <= 0) return true;

      return soNguoiHienTai < soNguoiToiDa;
    });
  }, [rooms, contracts]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    if (!form.MaKH) return alert("Vui lòng chọn khách hàng");
    if (!form.MaPhong) return alert("Vui lòng chọn phòng");
    if (!form.NgayTao) return alert("Vui lòng chọn ngày bắt đầu");
    if (!form.NgayKT) return alert("Vui lòng chọn ngày kết thúc");

    if (form.NgayKT < form.NgayTao) {
      return alert("Ngày kết thúc phải sau ngày bắt đầu");
    }

    onSave({
      MaKH: Number(form.MaKH),
      MaPhong: Number(form.MaPhong),
      NgayTao: form.NgayTao,
      NgayKT: form.NgayKT,
      TienCoc: Number(form.TienCoc || 0),
      TrangThai: 1,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-6">
      <div className="bg-white rounded-[36px] p-10 w-[720px] max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-600 px-5 py-2 rounded-full font-black text-xs tracking-widest mb-4">
              <span>●</span>
              HỢP ĐỒNG
            </div>

            <h2 className="text-4xl font-black text-[#09152f]">
              TẠO HỢP ĐỒNG THUÊ
            </h2>

            <p className="text-gray-400 font-bold mt-3 tracking-widest">
              CHỌN KHÁCH HÀNG VÀ PHÒNG CÒN CHỖ
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-500 font-black hover:bg-gray-200 transition"
          >
            ✕
          </button>
        </div>

        <div className="space-y-5">
          <select
            name="MaKH"
            value={form.MaKH}
            onChange={handleChange}
            disabled={!!selectedCustomer}
            className="w-full bg-[#f6f7f8] px-6 py-5 rounded-2xl outline-none font-bold text-[#09152f] disabled:text-gray-400"
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
            className="w-full bg-[#f6f7f8] px-6 py-5 rounded-2xl outline-none font-bold text-[#09152f]"
          >
            <option value="">Chọn phòng còn chỗ</option>

            {availableRooms.map((room) => {
              const current = getActiveContractCountByRoom(room.MaPhong);
              const max = Number(room.SoNguoi || 0);

              return (
                <option key={room.MaPhong} value={room.MaPhong}>
                  {room.TenPhong} - {current}/{max || "?"} người
                </option>
              );
            })}
          </select>

          {availableRooms.length === 0 && (
            <div className="bg-red-50 text-red-500 px-6 py-5 rounded-2xl font-bold">
              Hiện không có phòng nào còn chỗ để tạo hợp đồng.
            </div>
          )}

          <div>
            <p className="text-gray-400 font-bold mb-2 ml-2">Ngày bắt đầu</p>
            <input
              type="date"
              name="NgayTao"
              value={form.NgayTao}
              onChange={handleChange}
              className="w-full bg-[#f6f7f8] px-6 py-5 rounded-2xl outline-none font-bold text-[#09152f]"
            />
          </div>

          <div>
            <p className="text-gray-400 font-bold mb-2 ml-2">Ngày kết thúc</p>
            <input
              type="date"
              name="NgayKT"
              value={form.NgayKT}
              onChange={handleChange}
              className="w-full bg-[#f6f7f8] px-6 py-5 rounded-2xl outline-none font-bold text-[#09152f]"
            />
          </div>

          <div className="relative">
            <input
              type="number"
              name="TienCoc"
              value={form.TienCoc}
              onChange={handleChange}
              placeholder="Tiền cọc"
              className="w-full bg-[#f6f7f8] px-6 py-5 pr-20 rounded-2xl outline-none font-bold text-[#09152f]"
            />

            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-green-600 font-black">
              VNĐ
            </span>
          </div>

          <select
            name="TrangThai"
            value={form.TrangThai}
            onChange={handleChange}
            className="w-full bg-[#f6f7f8] px-6 py-5 rounded-2xl outline-none font-bold text-[#09152f]"
          >
            <option value={1}>ĐANG HOẠT ĐỘNG</option>
            <option value={0}>CHƯA HOẠT ĐỘNG</option>
          </select>
        </div>

        <div className="flex gap-4 mt-10">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-green-600 text-white py-5 rounded-2xl font-black hover:bg-green-700 transition"
          >
            TẠO HỢP ĐỒNG
          </button>

          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-500 py-5 rounded-2xl font-black hover:bg-gray-200 transition"
          >
            HỦY
          </button>
        </div>
      </div>
    </div>
  );
}