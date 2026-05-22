import { useEffect, useState } from "react";

export default function AddRoomModal({
  setShowModal,
  addRoom,
  editRoom,
  devices = [],
}) {
  const [form, setForm] = useState({
    TenPhong: "",
    GiaThue: "",
    SoNguoi: "",
    TinhTrang: 0,
    DanhSachThietBi: [],
  });

  useEffect(() => {
    if (editRoom) {
      setForm({
        TenPhong: editRoom.TenPhong || "",
        GiaThue: editRoom.GiaThue || "",
        SoNguoi: editRoom.SoNguoi || "",
        TinhTrang: Number(editRoom.TinhTrang ?? 0),
        DanhSachThietBi: [],
      });
    } else {
      setForm({
        TenPhong: "",
        GiaThue: "",
        SoNguoi: "",
        TinhTrang: 0,
        DanhSachThietBi: [],
      });
    }
  }, [editRoom]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: name === "TinhTrang" ? Number(value) : value,
    });
  };

  const handleToggleDevice = (MaTB) => {
    setForm((prev) => {
      const existed = prev.DanhSachThietBi.includes(MaTB);

      return {
        ...prev,
        DanhSachThietBi: existed
          ? prev.DanhSachThietBi.filter((id) => id !== MaTB)
          : [...prev.DanhSachThietBi, MaTB],
      };
    });
  };

  const handleSubmit = () => {
    if (!form.TenPhong.trim()) {
      return alert("Vui lòng nhập tên phòng");
    }

    if (!form.GiaThue || Number(form.GiaThue) <= 0) {
      return alert("Vui lòng nhập giá thuê hợp lệ");
    }

    if (!form.SoNguoi || Number(form.SoNguoi) <= 0) {
      return alert("Vui lòng nhập số người");
    }

    addRoom({
      TenPhong: form.TenPhong,
      GiaThue: Number(form.GiaThue),
      SoNguoi: Number(form.SoNguoi),
      TinhTrang: Number(form.TinhTrang),
      DanhSachThietBi: form.DanhSachThietBi,
    });

    setShowModal(false);
  };

  const availableDevices = devices.filter((device) => !device.MaPhong);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-6">
      <div className="bg-white w-[980px] max-h-[90vh] overflow-y-auto rounded-[36px] shadow-2xl p-10">
        <div className="flex justify-between items-start mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-600 px-5 py-2 rounded-full font-black text-xs tracking-widest mb-4">
              <span>●</span>
              PHÒNG TRỌ
            </div>

            <h2 className="text-4xl font-black text-[#09152f]">
              {editRoom ? "SỬA THÔNG TIN PHÒNG" : "THÊM PHÒNG MỚI"}
            </h2>

            <p className="text-gray-400 font-bold mt-3 tracking-widest">
              QUẢN LÝ PHÒNG VÀ THIẾT BỊ ĐI KÈM
            </p>
          </div>

          <button
            onClick={() => setShowModal(false)}
            className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-500 font-black hover:bg-gray-200 transition"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-black text-[#09152f] mb-5">
              THÔNG TIN PHÒNG
            </h3>

            <div className="space-y-5">
              <input
                name="TenPhong"
                value={form.TenPhong}
                onChange={handleChange}
                placeholder="Tên phòng, ví dụ: Phòng 101"
                className="w-full bg-[#f6f7f8] px-6 py-5 rounded-2xl outline-none font-bold text-[#09152f]"
              />

              <div className="relative">
                <input
                  name="GiaThue"
                  type="number"
                  value={form.GiaThue}
                  onChange={handleChange}
                  placeholder="Giá thuê, ví dụ: 3500000"
                  className="w-full bg-[#f6f7f8] px-6 py-5 pr-16 rounded-2xl outline-none font-bold text-[#09152f]"
                />

                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-green-600 font-black">
                  VNĐ
                </span>
              </div>

              <input
                name="SoNguoi"
                type="number"
                value={form.SoNguoi}
                onChange={handleChange}
                placeholder="Số người tối đa, ví dụ: 2"
                className="w-full bg-[#f6f7f8] px-6 py-5 rounded-2xl outline-none font-bold text-[#09152f]"
              />

              <select
                name="TinhTrang"
                value={form.TinhTrang}
                onChange={handleChange}
                className="w-full bg-[#f6f7f8] px-6 py-5 rounded-2xl outline-none font-bold text-[#09152f]"
              >
                <option value={0}>TRỐNG</option>
                <option value={1}>ĐÃ THUÊ</option>
                <option value={2}>BẢO TRÌ</option>
              </select>

              <div className="bg-green-50 rounded-3xl p-6">
                <p className="text-green-700 font-black">Ghi chú</p>
                <p className="text-green-600 font-bold text-sm mt-2 leading-relaxed">
                  Khi thêm phòng mới, nên để trạng thái là “Trống”. Trạng thái
                  “Đã thuê” thường được cập nhật khi tạo hợp đồng.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-black text-[#09152f] mb-5">
              THIẾT BỊ GÁN VÀO PHÒNG
            </h3>

            {!editRoom ? (
              <>
                {availableDevices.length > 0 ? (
                  <div className="space-y-3 max-h-[460px] overflow-y-auto pr-2">
                    {availableDevices.map((device) => {
                      const checked = form.DanhSachThietBi.includes(
                        device.MaTB
                      );

                      return (
                        <button
                          key={device.MaTB}
                          type="button"
                          onClick={() => handleToggleDevice(device.MaTB)}
                          className={`w-full flex justify-between items-center rounded-3xl p-5 border-2 transition ${
                            checked
                              ? "bg-green-50 border-green-500"
                              : "bg-[#f6f7f8] border-transparent"
                          }`}
                        >
                          <div className="text-left">
                            <p className="font-black text-[#09152f]">
                              {device.TenTB}
                            </p>

                            <p className="text-sm font-bold text-gray-400 mt-1">
                              Seri: {device.SoSeri} • Mã thiết bị: #
                              {device.MaTB}
                            </p>
                          </div>

                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-black ${
                              checked
                                ? "bg-green-600 text-white"
                                : "bg-white text-gray-300"
                            }`}
                          >
                            ✓
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-[#f6f7f8] rounded-3xl p-8 text-gray-400 font-bold leading-relaxed">
                    Hiện không có thiết bị nào chưa được gán phòng.
                  </div>
                )}
              </>
            ) : (
              <div className="bg-[#f6f7f8] rounded-3xl p-8 text-gray-400 font-bold leading-relaxed">
                Khi sửa phòng, việc thêm hoặc gỡ thiết bị nên thực hiện tại
                trang chi tiết phòng hoặc trang quản lý thiết bị.
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-5 mt-10">
          <button
            onClick={() => setShowModal(false)}
            className="flex-1 bg-gray-100 text-gray-500 py-5 rounded-2xl font-black hover:bg-gray-200 transition"
          >
            HỦY
          </button>

          <button
            onClick={handleSubmit}
            className="flex-1 bg-green-600 text-white py-5 rounded-2xl font-black shadow-lg hover:bg-green-700 transition"
          >
            {editRoom ? "CẬP NHẬT" : "LƯU PHÒNG"}
          </button>
        </div>
      </div>
    </div>
  );
}