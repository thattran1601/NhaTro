import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/DangnhapApi";

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.username.trim()) {
      return alert("Vui lòng nhập username");
    }

    if (!form.password.trim()) {
      return alert("Vui lòng nhập password");
    }

    try {
      setLoading(true);

      const res = await loginUser({
        username: form.username,
        password: form.password,
      });

      if (res.data.success) {
        localStorage.setItem("user", JSON.stringify(res.data.data));

        alert(res.data.message || "Đăng nhập thành công");

        navigate("/");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);

      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Đăng nhập thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f5] flex items-center justify-center px-6">
      <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[40px] shadow-2xl overflow-hidden">
        {/* LEFT */}
        <div className="bg-[#09152f] p-12 text-white flex flex-col justify-between min-h-[620px]">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 px-5 py-3 rounded-full font-black text-sm tracking-widest">
              <span className="text-green-400">●</span>
              NHA TRO MANAGEMENT
            </div>

            <h1 className="text-5xl font-black mt-10 leading-tight">
              QUẢN LÝ
              <span className="text-green-400 block italic">
                PHÒNG TRỌ
              </span>
            </h1>

            <p className="text-white/50 font-bold mt-6 leading-relaxed">
              Hệ thống quản lý phòng, cư dân, thiết bị và hợp đồng thuê trọ.
            </p>
          </div>

        </div>

        {/* RIGHT */}
        <div className="p-12 flex flex-col justify-center">
          <div className="mb-10">
            <h2 className="text-4xl font-black text-[#09152f]">
              ĐĂNG NHẬP
            </h2>

            <p className="text-gray-400 font-bold mt-3">
              Nhập tài khoản để truy cập hệ thống
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-black text-gray-400 tracking-widest mb-3">
                USERNAME
              </label>

              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Nhập username"
                className="w-full bg-[#f6f7f8] px-6 py-5 rounded-2xl outline-none font-bold text-[#09152f] focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-black text-gray-400 tracking-widest mb-3">
                PASSWORD
              </label>

              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Nhập password"
                  className="w-full bg-[#f6f7f8] px-6 py-5 pr-28 rounded-2xl outline-none font-bold text-[#09152f] focus:ring-2 focus:ring-green-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-green-600 font-black text-sm"
                >
                  {showPassword ? "ẨN" : "HIỆN"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-5 rounded-2xl font-black shadow-lg hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? "ĐANG ĐĂNG NHẬP..." : "ĐĂNG NHẬP"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}