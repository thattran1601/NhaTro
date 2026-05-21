export default function Hero({ setShowModal }) {
  return (
    <div className="bg-white rounded-3xl shadow-md p-8 mt-6 flex justify-between items-center">

      <div>

        <p className="text-gray-500 mt-6 text-lg">
          Quản lý phòng trọ hiện đại
        </p>
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="bg-green-500 text-white px-10 py-5 rounded-2xl text-lg font-semibold shadow-lg"
      >
        + THÊM PHÒNG
      </button>

    </div>
  );
}