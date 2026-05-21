import { useEffect, useState } from "react";

import {
  getAllThietbi,
  createThietbi,
  updateThietbi,
  deleteThietbi,
  addThietBiToPhong,
  removeThietBiFromPhong
} from "../api/ThietbiAPI";

import DeviceModal from "../components/DeviceModal";
import AssignDeviceModal from "../components/AssignDeviceModal";
import { getAllPhong } from "../api/PhongApi";

export default function DevicePage() {
  const [devices, setDevices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [assigning, setAssigning] = useState(null);
  const [active, setActive] = useState("ALL");
  const [rooms, setRooms] = useState([]);

  const fetchRooms = async () => {
  try {
    const res = await getAllPhong();

    setRooms(
      Array.isArray(res.data)
        ? res.data
        : []
    );
  } catch (error) {
    console.error("Failed to fetch rooms:", error);
    setRooms([]);
  }
};

  const fetchDevices = async () => {
    try {
      const res = await getAllThietbi();

      setDevices(
        Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (error) {
      console.error("Failed to fetch devices:", error);
      setDevices([]);
    }
  };

  useEffect(() => {
    fetchDevices();
    fetchRooms();
  }, []);

  const handleSave = async (data) => {
  try {
    if (editing) {
      await updateThietbi(editing.MaTB, {
        TenTB: data.TenTB,
        SoSeri: data.SoSeri,
        TinhTrang: data.TinhTrang,
        MaPhong: editing.MaPhong
      });
    } else {
      await createThietbi({
        TenTB: data.TenTB,
        SoSeri: data.SoSeri
      });
    }

    await fetchDevices();
    setShowModal(false);
    setEditing(null);
  } catch (error) {
    console.error(error);
    alert(
      error.response?.data?.error ||
      error.response?.data?.message ||
      "Lỗi lưu thiết bị"
    );
  }
};

  const handleDelete = async (MaTB) => {
  const ok = window.confirm("Bạn có chắc muốn xóa thiết bị này?");
  if (!ok) return;

  try {
    await deleteThietbi(MaTB);
    await fetchDevices();
  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.error ||
      error.response?.data?.message ||
      "Không thể xóa thiết bị"
    );
  }
};

  const handleAssign = async (data) => {
    try {
      await addThietBiToPhong({
        MaPhong: Number(data.MaPhong),
        MaTB: Number(data.MaTB),
        TinhTrang: Number(data.TinhTrang)
      });

      await fetchDevices();
      setShowAssignModal(false);
      setAssigning(null);
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Lỗi gán thiết bị"
      );
    }
  };

  const handleRemoveFromRoom = async (device) => {
  const ok = window.confirm("Bạn có chắc muốn gỡ thiết bị khỏi phòng?");
  if (!ok) return;

  try {
    await removeThietBiFromPhong({
      MaPhong: device.MaPhong,
      MaTB: device.MaTB
    });
    
    await fetchDevices();
  } catch (error) {
    console.error(error);
    alert(
      error.response?.data?.error ||
      error.response?.data?.message ||
      "Lỗi gỡ thiết bị khỏi phòng"
    );
  }
};

  const filteredDevices = devices.filter((device) => {
    if (active === "GOOD") return Number(device.TinhTrang) === 0;
    if (active === "BROKEN") return Number(device.TinhTrang) === 1;
    if (active === "REPAIR") return Number(device.TinhTrang) === 2;
    if (active === "UNASSIGNED") return device.MaPhong === null;

    return true;
  });

  const total = devices.length;

  const good = devices.filter(
    (d) => Number(d.TinhTrang) === 0
  ).length;

  const broken = devices.filter(
    (d) => Number(d.TinhTrang) === 1
  ).length;

  const repair = devices.filter(
    (d) => Number(d.TinhTrang) === 2
  ).length;

  const unassigned = devices.filter(
    (d) => d.MaPhong === null
  ).length;

  const getStatusText = (status) => {
    if (status === null || status === undefined) return "CHƯA GÁN";
    if (Number(status) === 0) return "HOẠT ĐỘNG TỐT";
    if (Number(status) === 1) return "HỎNG";
    if (Number(status) === 2) return "ĐANG SỬA CHỮA";
    return "KHÔNG RÕ";
  };

  const getStatusClass = (status) => {
    if (status === null || status === undefined) {
      return "bg-gray-50 text-gray-500 border-gray-200";
    }

    if (Number(status) === 0) {
      return "bg-green-50 text-green-600 border-green-200";
    }

    if (Number(status) === 1) {
      return "bg-red-50 text-red-600 border-red-200";
    }

    if (Number(status) === 2) {
      return "bg-orange-50 text-orange-600 border-orange-200";
    }

    return "bg-gray-50 text-gray-500 border-gray-200";
  };

  const getTabClass = (tab) => {
    return active === tab
      ? "bg-[#09152f] text-white px-8 py-4 rounded-2xl font-black"
      : "bg-[#f6f7f8] text-[#09152f] px-8 py-4 rounded-2xl font-black";
  };

  return (
    <div className="min-h-screen bg-[#f4f7f5] px-12 py-10">
      {/* HERO */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-5xl font-black italic text-[#09152f]">
            QUẢN LÝ
            <span className="text-green-600"> THIẾT BỊ</span>
          </h1>

          <p className="text-gray-400 font-black tracking-[0.35em] text-sm mt-5">
            HỆ THỐNG QUẢN LÝ THIẾT BỊ PHÒNG TRỌ
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => {
              setAssigning(null);
              setShowAssignModal(true);
            }}
            className="bg-green-600 text-white px-9 py-5 rounded-2xl font-black shadow-lg hover:bg-green-700 transition"
          >
            + GÁN PHÒNG
          </button>

          <button
            onClick={() => {
              setEditing(null);
              setShowModal(true);
            }}
            className="bg-[#09152f] text-white px-9 py-5 rounded-2xl font-black shadow-lg hover:bg-[#09152f]/90 transition"
          >
            + THÊM THIẾT BỊ
          </button>
        </div>
      </div>

      {/* FILTER */}
      <div className="bg-white rounded-[30px] p-5 shadow-sm mb-8">
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={() => setActive("ALL")}
            className={getTabClass("ALL")}
          >
            TẤT CẢ ({total})
          </button>

          <button
            onClick={() => setActive("GOOD")}
            className={getTabClass("GOOD")}
          >
            HOẠT ĐỘNG TỐT ({good})
          </button>

          <button
            onClick={() => setActive("BROKEN")}
            className={getTabClass("BROKEN")}
          >
            HỎNG ({broken})
          </button>

          <button
            onClick={() => setActive("REPAIR")}
            className={getTabClass("REPAIR")}
          >
            ĐANG SỬA CHỮA ({repair})
          </button>

          <button
            onClick={() => setActive("UNASSIGNED")}
            className={getTabClass("UNASSIGNED")}
          >
            CHƯA GÁN ({unassigned})
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[30px] overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 px-10 py-7 text-gray-400 font-black tracking-widest text-sm border-b">
          <div className="col-span-2">MÃ / SERIAL</div>
          <div className="col-span-3">TÊN THIẾT BỊ</div>
          <div className="col-span-2 text-center">TÌNH TRẠNG</div>
          <div className="col-span-2 text-center">PHÒNG</div>
          <div className="col-span-3 text-center">THAO TÁC</div>
        </div>

        {filteredDevices.length === 0 && (
          <div className="px-10 py-10 text-gray-400 font-bold">
            Không có thiết bị nào.
          </div>
        )}

        {filteredDevices.map((device) => (
          <div
            key={`${device.MaTB}-${device.MaPhong || "none"}`}
            className="grid grid-cols-12 px-10 py-6 items-center border-b last:border-b-0 hover:bg-[#f6f7f8] transition"
          >
            <div className="col-span-2">
              <span className="bg-gray-100 text-gray-500 px-5 py-3 rounded-xl font-black">
                {device.SoSeri || `TB-${device.MaTB}`}
              </span>
            </div>

            <div className="col-span-3">
              <h2 className="text-xl font-black text-[#09152f] uppercase">
                {device.TenTB}
              </h2>

              <p className="text-gray-400 text-sm font-bold mt-2">
                Mã thiết bị: #{device.MaTB}
              </p>
            </div>

            <div className="col-span-2 text-center">
              <span
                className={`inline-flex items-center gap-2 px-5 py-2 rounded-full border text-xs font-black ${getStatusClass(device.TinhTrang)}`}
              >
                ● {getStatusText(device.TinhTrang)}
              </span>
            </div>

            <div className="col-span-2 text-center">
              <span
                className={
                  device.MaPhong
                    ? "bg-green-50 text-green-600 px-5 py-3 rounded-xl font-black"
                    : "bg-gray-100 text-gray-400 px-5 py-3 rounded-xl font-black"
                }
              >
                {device.TenPhong || `Phòng #${device.MaPhong}` || "Chưa gán"}
              </span>
            </div>

            <div className="col-span-3 flex justify-center gap-3">
              <button
                onClick={() => {
                  setEditing(device);
                  setShowModal(true);
                }}
                className="bg-blue-50 text-blue-600 px-5 py-3 rounded-xl font-black hover:bg-blue-600 hover:text-white transition"
              >
                SỬA
              </button>

              {device.MaPhong ? (
                <button
                  onClick={() => handleRemoveFromRoom(device)}
                  className="bg-orange-50 text-orange-600 px-5 py-3 rounded-xl font-black hover:bg-orange-500 hover:text-white transition"
                >
                  GỠ
                </button>
              ) : (
                <button
                  onClick={() => {
                    setAssigning(device);
                    setShowAssignModal(true);
                  }}
                  className="bg-green-50 text-green-600 px-5 py-3 rounded-xl font-black hover:bg-green-600 hover:text-white transition"
                >
                  GÁN
                </button>
              )}

              <button
                onClick={() => handleDelete(device.MaTB)}
                className="bg-red-50 text-red-500 px-5 py-3 rounded-xl font-black hover:bg-red-500 hover:text-white transition"
              >
                XÓA
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <DeviceModal
          device={editing}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditing(null);
          }}
        />
      )}

       {showAssignModal && (
        <AssignDeviceModal
          device={assigning}
          rooms={rooms}
          onSave={handleAssign}
          onClose={() => {
            setShowAssignModal(false);
            setAssigning(null);
        }}
      />
    )}
    </div>
  );
}