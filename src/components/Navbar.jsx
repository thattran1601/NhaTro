import { NavLink } from "react-router-dom";

export default function Navbar() {
  const navItem = ({ isActive }) =>
    `
    px-8 py-4 rounded-2xl font-black tracking-widest text-sm
    transition-all duration-300 ease-in-out
    flex items-center gap-2
    ${
      isActive
        ? "bg-green-600 text-white shadow-lg shadow-green-200 scale-[1.03]"
        : "bg-[#f6f7f8] text-gray-500 hover:bg-green-50 hover:text-green-600 hover:shadow-md hover:-translate-y-0.5"
    }
  `;

  return (
    <div className="sticky top-0 z-40 px-8 py-5 bg-[#f4f7f5]/80 backdrop-blur-xl">
      <div className="bg-white rounded-[28px] shadow-sm px-8 py-5 flex justify-between items-center border border-gray-100">
        {/* LOGO */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center font-black text-xl shadow-sm">
            🏠
          </div>

          <div>
            <h1 className="text-2xl font-black text-[#09152f] leading-none">
              QUẢN LÝ
              <span className="text-green-600 ml-2">PHÒNG TRỌ</span>
            </h1>
          </div>
        </div>

        {/* MENU */}
        <div className="flex gap-4 bg-[#f6f7f8] p-2 rounded-[24px]">
          <NavLink to="/" className={navItem}>
            <span>▦</span>
            PHÒNG
          </NavLink>

          <NavLink to="/customers" className={navItem}>
            <span>●</span>
            CƯ DÂN
          </NavLink>

          <NavLink to="/devices" className={navItem}>
            <span>▣</span>
            THIẾT BỊ
          </NavLink>
        </div>
      </div>
    </div>
  );
}