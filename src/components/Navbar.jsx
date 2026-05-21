import { NavLink } from "react-router-dom";

export default function Navbar() {
  const active =
    "bg-green-500 text-white px-8 py-4 rounded-2xl font-semibold shadow";

  const normal =
    "bg-gray-100 px-8 py-4 rounded-2xl font-semibold";

  return (
    <div className="bg-white rounded-3xl shadow-md px-10 py-6 flex justify-between items-center">

      <div>
         <h1 className="text-2xl font-black mt-5 text-[#09152f]">
          QUẢN LÝ
          <span className="text-green-500 ml-2">
            PHÒNG TRỌ 
          </span>
        </h1>
      </div>

      <div className="flex gap-4">

        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? active : normal
          }
        >
          PHÒNG
        </NavLink>

        <NavLink
          to="/customers"
          className={({ isActive }) =>
            isActive ? active : normal
          }
        >
          CƯ DÂN
        </NavLink>

        <NavLink
          to="/devices"
          className={({ isActive }) =>
            isActive ? active : normal
          }
        >
          THIẾT BỊ
        </NavLink>

      </div>
    </div>
  );
}