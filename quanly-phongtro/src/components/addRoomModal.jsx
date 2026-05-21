import { useEffect, useState } from "react";

export default function AddRoomModal( {
    setShowModal,
    addRoom,
    editRoom
}) {
    const [room,setRoom] = useState({
        TenPhong: "",
        GiaThue: "",
        TinhTrang: 0
    })  
    useEffect(() => {
        if(editRoom)
            setRoom(editRoom)
    }, [editRoom])
    const handleSubmit = async () => {
        await addRoom(room)
        setShowModal(false)
    }
    
    return (
        <div className="fixed inset-0 bg-black/40  flex items-center justify-center">

            <div className="bg-white rounded-3x1 p-8 w-[500px]">

                <h2 className="text-3x1 font-bold mb-6">
                    {editRoom ? "Sửa phòng" : "Thêm phòng"}
                </h2>

                <div className="space-y-4">
                    <input
                        placeholder="Tên phòng"
                        className="w-full p-4 rounded-2x1 bg-gray-100 mb-4"
                        value={room.TenPhong}
                        onChange={(e) =>
                            setRoom({...room, TenPhong: e.target.value})
                        }
                    />               
                    <input
                        placeholder="Giá Thuê"
                        className="w-full p-4 rounded-2x1 bg-gray-100 mb-4"
                        value={room.GiaThue}
                        onChange={(e) =>
                            setRoom({...room, GiaThue: e.target.value})
                        }
                    />
                    <select
                        className="w-full p-4 rounded-2x1 bg-gray-100"
                        value={room.TinhTrang}
                        onChange={(e) =>
                            setRoom({...room, TinhTrang: Number(e.target.value)})
                        }
                    >
                        <option value="0">TRỐNG</option>
                        <option value="1">ĐÃ THUÊ</option>
                        <option value="2">BẢO TRÌ</option>
                    </select>
                </div>
                <div className="flex gap-4 mt-8">
                    <button
                        onClick={() => setShowModal(false)}
                        className="flex-1 bg-gray-200 py-4 rounded-2x1"
                        >
                        HỦY
                    </button>

                    <button
                        onClick={handleSubmit}
                        className="flex-1 bg-green-500 text-white py-4 rounded-2x1" 
                    >
                       Lưu
                    </button>
                </div>
            </div>
        </div>
    )
}