import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getKhachhangById } from "../api/KhachhangApi";
import { getAllHopdong } from "../api/HopdongApi";
import { getAllPhong } from "../api/phongApi";
import {
  getThanNhanByKhachHang,
  updateThanNhan,
  deleteThanNhan,
  createThanNhan,
} from "../api/ThannhanApi";
export default function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [contract, setContract] = useState(null);
  const [room, setRoom] = useState(null);

  const [relatives, setRelatives] = useState([]);
  const [editingRelative, setEditingRelative] = useState(null);
  const [relativeForm, setRelativeForm] = useState({
    HoTen: "",
    SDT: "",
    QuanHe: "",
  });
  const [showAddRelativeModal, setShowAddRelativeModal] = useState(false);
  const [newRelativeForm, setNewRelativeForm] = useState({
    HoTen: "",
    SDT: "",
    QuanHe: "",
  });

  const fetchDetail = async () => {
    try {
      const customerRes = await getKhachhangById(id);
      const contractsRes = await getAllHopdong();
      const roomsRes = await getAllPhong();

      const customerData = customerRes.data.data || customerRes.data;

      const contracts = Array.isArray(contractsRes.data.data)
        ? contractsRes.data.data
        : [];

      const rooms = Array.isArray(roomsRes.data)
        ? roomsRes.data
        : [];

      const currentContract = contracts.find(
        (item) =>
          Number(item.MaKH) === Number(id) &&
          Number(item.TrangThai) === 1
      );

      const currentRoom = currentContract
        ? rooms.find(
            (item) => Number(item.MaPhong) === Number(currentContract.MaPhong)
          )
        : null;

      setCustomer(customerData);
      setContract(currentContract || null);
      setRoom(currentRoom || null);
    } catch (error) {
      console.error("Lỗi tải chi tiết khách hàng:", error);
      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Lỗi tải chi tiết khách hàng"
      );
    }
  };

  const fetchRelatives = async () => {
  try {
    const res = await getThanNhanByKhachHang(id);

    setRelatives(
      Array.isArray(res.data.data)
        ? res.data.data
        : []
    );
  } catch (error) {
    console.error("Lỗi tải thân nhân:", error);
    setRelatives([]);
  }
};

  useEffect(() => {
    fetchDetail();
    fetchRelatives();
  }, [id]);

  const formatMoney = (value) => {
    return Number(value || 0).toLocaleString("vi-VN") + "đ";
  };

  const formatDate = (value) => {
    if (!value) return "---";
    return new Date(value).toLocaleDateString("vi-VN");
  };

  if (!customer) {
    return (
      <div className="min-h-screen bg-[#f4f7f5] px-12 py-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 bg-white text-[#09152f] px-6 py-3 rounded-2xl font-black shadow-sm hover:bg-gray-100 transition"
        >
          ← QUAY LẠI
        </button>

        <h1 className="text-3xl font-black text-[#09152f]">
          Không tìm thấy khách hàng
        </h1>
      </div>
    );
  }

  const handleEditRelative = (relative) => {
  setEditingRelative(relative);

  setRelativeForm({
    HoTen: relative.HoTen || "",
    SDT: relative.SDT || "",
    QuanHe: relative.QuanHe || "",
  });
};

const handleUpdateRelative = async () => {
  if (!relativeForm.HoTen) return alert("Vui lòng nhập họ tên thân nhân");
  if (!relativeForm.SDT) return alert("Vui lòng nhập số điện thoại thân nhân");

  try {
    await updateThanNhan(editingRelative.MaTN, relativeForm);

    alert("Cập nhật thân nhân thành công");

    setEditingRelative(null);
    setRelativeForm({
      HoTen: "",
      SDT: "",
      QuanHe: "",
    });

    await fetchRelatives();
  } catch (error) {
    console.error("Lỗi cập nhật thân nhân:", error);

    alert(
      error.response?.data?.message ||
        "Lỗi cập nhật thân nhân"
    );
  }
};

const handleDeleteRelative = async (MaTN) => {
  const ok = window.confirm("Bạn có chắc muốn xóa thân nhân này không?");
  if (!ok) return;

  try {
    await deleteThanNhan(MaTN);

    alert("Xóa thân nhân thành công");
    await fetchRelatives();
  } catch (error) {
    console.error("Lỗi xóa thân nhân:", error);

    alert(
      error.response?.data?.message ||
        "Lỗi xóa thân nhân"
    );
  }
};

const handleCreateRelative = async () => {
  if (!newRelativeForm.HoTen.trim()) {
    return alert("Vui lòng nhập họ tên thân nhân");
  }

  if (!newRelativeForm.SDT.trim()) {
    return alert("Vui lòng nhập số điện thoại thân nhân");
  }

  try {
    await createThanNhan({
      MaKH: Number(id),
      HoTen: newRelativeForm.HoTen,
      SDT: newRelativeForm.SDT,
      QuanHe: newRelativeForm.QuanHe,
    });

    alert("Thêm thân nhân thành công");

    setShowAddRelativeModal(false);
    setNewRelativeForm({
      HoTen: "",
      SDT: "",
      QuanHe: "",
    });

    await fetchRelatives();
  } catch (error) {
    console.error("Lỗi thêm thân nhân:", error);

    alert(
      error.response?.data?.message ||
        error.response?.data?.error ||
        "Lỗi thêm thân nhân"
    );
  }
};

  return (
    <div className="min-h-screen bg-[#f4f7f5] px-12 py-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 bg-white text-[#09152f] px-6 py-3 rounded-2xl font-black shadow-sm hover:bg-gray-100 transition"
      >
        ← QUAY LẠI
      </button>

      {/* HERO */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-600 px-5 py-2 rounded-full font-bold text-sm tracking-widest">
          <span>●</span>
          CHI TIẾT NGƯỜI THUÊ
        </div>

        <h1 className="text-5xl font-black mt-5 text-[#09152f] uppercase">
          {customer.HoTen}
        </h1>

        <p className="text-gray-400 font-bold tracking-widest mt-4">
          MÃ KHÁCH HÀNG: #{customer.MaKH}
        </p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* THÔNG TIN KHÁCH HÀNG */}
        <div className="col-span-5 bg-white rounded-[30px] p-8 shadow-sm">
          <h2 className="text-2xl font-black text-[#09152f] mb-6">
            THÔNG TIN ĐỊNH DANH
          </h2>

          <div className="space-y-5">
            <div className="bg-[#f6f7f8] rounded-2xl p-5">
              <p className="text-gray-400 font-bold text-sm">HỌ TÊN</p>
              <p className="text-xl font-black text-[#09152f]">
                {customer.HoTen}
              </p>
            </div>

            <div className="bg-[#f6f7f8] rounded-2xl p-5">
              <p className="text-gray-400 font-bold text-sm">SỐ ĐIỆN THOẠI</p>
              <p className="text-xl font-black text-[#09152f]">
                {customer.SDT || "---"}
              </p>
            </div>

            <div className="bg-[#f6f7f8] rounded-2xl p-5">
              <p className="text-gray-400 font-bold text-sm">CCCD</p>
              <p className="text-xl font-black text-[#09152f]">
                {customer.CCCD || "---"}
              </p>
            </div>
          </div>
        </div>

        {/* PHÒNG ĐANG THUÊ */}
        <div className="col-span-7 bg-white rounded-[30px] p-8 shadow-sm">
          <h2 className="text-2xl font-black text-[#09152f] mb-6">
            PHÒNG ĐANG THUÊ
          </h2>

          {room ? (
            <div className="bg-green-50 rounded-2xl p-6">
              <p className="text-3xl font-black text-[#09152f]">
                {room.TenPhong}
              </p>

              <p className="text-gray-500 font-bold mt-4">
                Giá thuê: {formatMoney(room.GiaThue)}
              </p>

              <p className="text-green-600 font-black mt-4">
                ĐANG LƯU TRÚ
              </p>

              <button
                onClick={() => navigate(`/rooms/${room.MaPhong}/detail`)}
                className="mt-6 bg-[#09152f] text-white px-6 py-4 rounded-2xl font-black"
              >
                XEM CHI TIẾT PHÒNG
              </button>
            </div>
          ) : (
            <div className="bg-gray-100 rounded-2xl p-6 text-gray-400 font-bold">
              Khách hàng này chưa có phòng đang thuê
            </div>
          )}
        </div>
      </div>

      {/* HỢP ĐỒNG */}
      <div className="bg-white rounded-[30px] p-8 shadow-sm mt-8">
        <h2 className="text-2xl font-black text-[#09152f] mb-6">
          THÔNG TIN HỢP ĐỒNG
        </h2>

        {contract ? (
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-3 bg-[#f6f7f8] rounded-2xl p-5">
              <p className="text-gray-400 font-bold text-sm">MÃ HỢP ĐỒNG</p>
              <p className="text-xl font-black text-[#09152f]">
                #{contract.MaHD}
              </p>
            </div>

            <div className="col-span-3 bg-[#f6f7f8] rounded-2xl p-5">
              <p className="text-gray-400 font-bold text-sm">NGÀY BẮT ĐẦU</p>
              <p className="text-xl font-black text-[#09152f]">
                {formatDate(contract.NgayTao)}
              </p>
            </div>

            <div className="col-span-3 bg-[#f6f7f8] rounded-2xl p-5">
              <p className="text-gray-400 font-bold text-sm">NGÀY KẾT THÚC</p>
              <p className="text-xl font-black text-[#09152f]">
                {formatDate(contract.NgayKT)}
              </p>
            </div>

            <div className="col-span-3 bg-[#f6f7f8] rounded-2xl p-5">
              <p className="text-gray-400 font-bold text-sm">TIỀN CỌC</p>
              <p className="text-xl font-black text-green-600">
                {formatMoney(contract.TienCoc)}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-gray-100 rounded-2xl p-6 text-gray-400 font-bold">
            Khách hàng này chưa có hợp đồng đang hoạt động
          </div>
        )}

        <div className="bg-white rounded-[30px] p-8 shadow-sm mt-8">
          <h2 className="text-2xl font-black text-[#09152f] mb-6">
            THÔNG TIN THÂN NHÂN
          </h2>

            <button
              onClick={() => setShowAddRelativeModal(true)}
              className="bg-green-600 text-white px-6 py-4 rounded-2xl font-black hover:bg-green-700 transition"
            >
              + THÊM THÂN NHÂN
            </button>

          {relatives.length > 0 ? (
            <div className="space-y-4">
              {relatives.map((relative) => (
                <div
                  key={relative.MaTN}
                  className="grid grid-cols-12 items-center bg-[#f6f7f8] rounded-2xl px-6 py-5"
                >
                  <div className="col-span-4">
                    <p className="text-lg font-black text-[#09152f]">
                      {relative.HoTen}
                    </p>
                    <p className="text-gray-400 text-sm font-bold mt-1">
                      Quan hệ: {relative.QuanHe || "---"}
                    </p>
                  </div>

                  <div className="col-span-4">
                    <p className="text-gray-500 font-bold">
                      ☎ {relative.SDT}
                    </p>
                  </div>

                  <div className="col-span-4 flex justify-end gap-3">
                    <button
                      onClick={() => handleEditRelative(relative)}
                      className="bg-blue-50 text-blue-600 px-5 py-3 rounded-2xl font-black hover:bg-blue-600 hover:text-white transition"
                    >
                      SỬA
                    </button>

                    <button
                      onClick={() => handleDeleteRelative(relative.MaTN)}
                      className="bg-red-50 text-red-600 px-5 py-3 rounded-2xl font-black hover:bg-red-600 hover:text-white transition"
                    >
                      XÓA
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-100 rounded-2xl p-6 text-gray-400 font-bold">
              Khách hàng này chưa có thông tin thân nhân
            </div>
          )}
        </div>
      </div>
      {editingRelative && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-[36px] p-10 w-[560px] shadow-2xl">
            <h2 className="text-3xl font-black text-[#09152f] mb-8">
              SỬA THÔNG TIN THÂN NHÂN
            </h2>

            <div className="space-y-5">
              <input
                name="HoTen"
                value={relativeForm.HoTen}
                onChange={(e) =>
                  setRelativeForm({
                    ...relativeForm,
                    HoTen: e.target.value,
                  })
                }
                placeholder="Họ tên thân nhân"
                className="w-full bg-[#f6f7f8] px-6 py-5 rounded-2xl outline-none font-semibold"
              />

              <input
                name="SDT"
                value={relativeForm.SDT}
                onChange={(e) =>
                  setRelativeForm({
                    ...relativeForm,
                    SDT: e.target.value,
                  })
                }
                placeholder="Số điện thoại"
                className="w-full bg-[#f6f7f8] px-6 py-5 rounded-2xl outline-none font-semibold"
              />

              <input
                name="QuanHe"
                value={relativeForm.QuanHe}
                onChange={(e) =>
                  setRelativeForm({
                    ...relativeForm,
                    QuanHe: e.target.value,
                  })
                }
                placeholder="Quan hệ"
                className="w-full bg-[#f6f7f8] px-6 py-5 rounded-2xl outline-none font-semibold"
              />
            </div>

            <div className="flex gap-4 mt-10">
              <button
                onClick={handleUpdateRelative}
                className="flex-1 bg-green-600 text-white py-5 rounded-2xl font-black"
              >
                LƯU
              </button>

              <button
                onClick={() => {
                  setEditingRelative(null);
                  setRelativeForm({
                    HoTen: "",
                    SDT: "",
                    QuanHe: "",
                  });
                }}
                className="flex-1 bg-gray-100 text-gray-500 py-5 rounded-2xl font-black"
              >
                HỦY
              </button>
            </div>
          </div>
        </div>
      )}
      {showAddRelativeModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-[36px] p-10 w-[560px] shadow-2xl">
            <h2 className="text-3xl font-black text-[#09152f] mb-8">
              THÊM THÂN NHÂN
            </h2>

            <div className="space-y-5">
              <input
                value={newRelativeForm.HoTen}
                onChange={(e) =>
                  setNewRelativeForm({
                    ...newRelativeForm,
                    HoTen: e.target.value,
                  })
                }
                placeholder="Họ tên thân nhân"
                className="w-full bg-[#f6f7f8] px-6 py-5 rounded-2xl outline-none font-semibold"
              />

              <input
                value={newRelativeForm.SDT}
                onChange={(e) =>
                  setNewRelativeForm({
                    ...newRelativeForm,
                    SDT: e.target.value,
                  })
                }
                placeholder="Số điện thoại thân nhân"
                className="w-full bg-[#f6f7f8] px-6 py-5 rounded-2xl outline-none font-semibold"
              />

              <input
                value={newRelativeForm.QuanHe}
                onChange={(e) =>
                  setNewRelativeForm({
                    ...newRelativeForm,
                    QuanHe: e.target.value,
                  })
                }
                placeholder="Quan hệ: Cha, mẹ, anh, chị..."
                className="w-full bg-[#f6f7f8] px-6 py-5 rounded-2xl outline-none font-semibold"
              />
            </div>

            <div className="flex gap-4 mt-10">
              <button
                onClick={handleCreateRelative}
                className="flex-1 bg-green-600 text-white py-5 rounded-2xl font-black"
              >
                LƯU
              </button>

              <button
                onClick={() => {
                  setShowAddRelativeModal(false);
                  setNewRelativeForm({
                    HoTen: "",
                    SDT: "",
                    QuanHe: "",
                  });
                }}
                className="flex-1 bg-gray-100 text-gray-500 py-5 rounded-2xl font-black"
              >
                HỦY
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}