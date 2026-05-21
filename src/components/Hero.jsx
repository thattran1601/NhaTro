export default function Hero({ setShowModal }) {
  return (
    <div className="bg-white rounded-3xl shadow-md p-8 mt-6 flex justify-between items-center">

      <div>

         <h1 className="text-5xl font-black mt-5 text-[#09152f]">
            QUẢN LÝ
            <span className="text-green-600 italic ml-3">PHÒNG</span>
          </h1>
          <p className="text-gray-400 font-black tracking-[0.35em] text-sm mt-5">
            HỆ THỐNG QUẢN LÝ PHÒNG TRỌ
          </p>
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="bg-green-500 text-white px-10 py-5 rounded-3xl text-lg font-semibold shadow-lg"
      >
        + THÊM PHÒNG
      </button>

    </div>
  );
}