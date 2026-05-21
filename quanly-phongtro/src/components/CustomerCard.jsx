import Navbar from "../components/Navbar";
export default function CustomerCard({ 
    customer,
    onEdit,
    onCreateContract
 }) {
    return (
        <div className="bg-white rounded-2xl shadow p-6 flex justify-between items-center hover:shadow-lg transition">
            <div>
                <h2 className="font-bold text -xl text-gray-800">
                    {customer.HoTen}
                </h2>
                <p className="text-gray-600">CCCD: {customer.CCCD}</p>
                <p className="text-gray-600">SĐT: {customer.SDT}</p>
            </div>
            <button
                onClick={() => onEdit(customer)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
                Sửa
            </button>
            <button
                onClick={() => onCreateContract(customer)}
                className="bg-[#09152f] text-white px-5 py-3 rounded-2xl font-black"
            >
                TẠO HỢP ĐỒNG
            </button>
        </div>
    );
}
