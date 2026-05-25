import { useEffect, useState } from "react";

export default function CustomerModal({ customer, onSave, onClose }) {
  const emptyForm = {
    HoTen: "",
    CCCD: "",
    SDT: "",
    TruocCCCD: null,
    SauCCCD: null,
    ThanNhan: {
      HoTen: "",
      SDT: "",
      QuanHe: "",
    },
  };

  const [form, setForm] = useState(emptyForm);
  const [showThanNhan, setShowThanNhan] = useState(false);

  useEffect(() => {
    if (customer) {
      setForm({
        HoTen: customer.HoTen || "",
        CCCD: customer.CCCD || "",
        SDT: customer.SDT || "",
        TruocCCCD: null,
        SauCCCD: null,
        ThanNhan: {
          HoTen: "",
          SDT: "",
          QuanHe: "",
        },
      });

      setShowThanNhan(false);
    } else {
      setForm(emptyForm);
      setShowThanNhan(false);
    }
  }, [customer]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.files[0],
    });
  };

  const handleThanNhanChange = (e) => {
      setForm({
        ...form,
        ThanNhan: {
          ...form.ThanNhan,
          [e.target.name]: e.target.value,
        },
      });
    };

    const handleSubmit = () => {
    if (!form.HoTen.trim()) {
      return alert("Vui lòng nhập họ tên cư dân");
    }

    if (!form.CCCD.trim()) {
      return alert("Vui lòng nhập CCCD");
    }

    if (!form.SDT.trim()) {
      return alert("Vui lòng nhập số điện thoại");
    }

    const formData = new FormData();

    formData.append("HoTen", form.HoTen.trim());
    formData.append("CCCD", form.CCCD.trim());
    formData.append("SDT", form.SDT.trim());

    if (form.TruocCCCD) {
      formData.append("TruocCCCD", form.TruocCCCD);
    }

    if (form.SauCCCD) {
      formData.append("SauCCCD", form.SauCCCD);
    }

    const thanNhanData = showThanNhan ? form.ThanNhan : null;

    onSave(formData, thanNhanData);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-6">
      <div className="bg-white rounded-[36px] p-10 w-[1000px] max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-black text-[#09152f]">
              {customer ? "CHỈNH SỬA CƯ DÂN" : "THÊM CƯ DÂN"}
            </h2>

            <p className="text-gray-400 font-bold mt-2">
              {customer
                ? "Cập nhật thông tin người thuê"
                : "Nhập thông tin người thuê và ảnh CCCD"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="bg-gray-100 text-gray-500 w-12 h-12 rounded-2xl font-black hover:bg-gray-200 transition"
          >
            ✕
          </button>
        </div>

        <div
          className={
            customer ? "grid grid-cols-1 gap-6" : "grid grid-cols-2 gap-8"
          }
        >
          {/* THÔNG TIN CƯ DÂN */}
          <div>
            <h3 className="text-xl font-black text-[#09152f] mb-5">
              THÔNG TIN CƯ DÂN
            </h3>

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

              <div>
                <p className="text-gray-400 font-bold mb-2 ml-2">
                  Ảnh CCCD mặt trước
                </p>

                <input
                  type="file"
                  name="TruocCCCD"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full bg-[#f6f7f8] px-6 py-5 rounded-2xl outline-none font-semibold"
                />
              </div>

              <div>
                <p className="text-gray-400 font-bold mb-2 ml-2">
                  Ảnh CCCD mặt sau
                </p>

                <input
                  type="file"
                  name="SauCCCD"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full bg-[#f6f7f8] px-6 py-5 rounded-2xl outline-none font-semibold"
                />
              </div>

              {customer && (
                <div className="bg-green-50 text-green-600 px-6 py-5 rounded-2xl font-bold text-sm">
                  Nếu không chọn ảnh mới, hệ thống sẽ giữ ảnh CCCD cũ.
                </div>
              )}
            </div>
          </div>

          {/* THÂN NHÂN */}
          {!customer && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-black text-[#09152f]">
                  THÔNG TIN THÂN NHÂN
                </h3>

                <label className="flex items-center gap-3 text-sm font-black text-green-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showThanNhan}
                    onChange={(e) => setShowThanNhan(e.target.checked)}
                    className="w-5 h-5"
                  />
                  THÊM THÂN NHÂN
                </label>
              </div>

              {showThanNhan ? (
                <div className="space-y-5">
                  <input
                    name="HoTen"
                    value={form.ThanNhan.HoTen}
                    onChange={handleThanNhanChange}
                    placeholder="Họ tên thân nhân"
                    className="w-full bg-[#f6f7f8] px-6 py-5 rounded-2xl outline-none font-semibold"
                  />

                  <input
                    name="SDT"
                    value={form.ThanNhan.SDT}
                    onChange={handleThanNhanChange}
                    placeholder="Số điện thoại thân nhân"
                    className="w-full bg-[#f6f7f8] px-6 py-5 rounded-2xl outline-none font-semibold"
                  />

                  <input
                    name="QuanHe"
                    value={form.ThanNhan.QuanHe}
                    onChange={handleThanNhanChange}
                    placeholder="Quan hệ: Cha, mẹ, anh, chị..."
                    className="w-full bg-[#f6f7f8] px-6 py-5 rounded-2xl outline-none font-semibold"
                  />
                </div>
              ) : (
                <div className="bg-[#f6f7f8] rounded-2xl p-8 text-gray-400 font-bold leading-relaxed">
                  Có thể thêm thân nhân ngay bây giờ hoặc bổ sung sau trong
                  trang chi tiết khách hàng.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-10">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-green-600 text-white py-5 rounded-2xl font-black hover:bg-green-700 transition"
          >
            LƯU
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