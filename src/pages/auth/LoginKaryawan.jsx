import React, { useState } from "react";
import { Link } from "react-router-dom";
import { UseLoginUser } from "../../service/auth/login_user";
import toast from "react-hot-toast";

export const LoginKaryawan = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  // Mengambil status isPending agar tombol bisa loading
  const { mutate: LoginMutation } = UseLoginUser();

  const handleInput = (e) => {
    const { id, value } = e.target;
    if (id === "email") setemail(value);
    if (id === "password") setpassword(value);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Semua field wajib di isi");
    LoginMutation({
      email: email,
      password: password,
    });
  };

  return (
    <div className="min-h-screen bg-[#28243d] flex items-center justify-center p-6 font-sans">
      <div className="max-w-[1200px] w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* SISI KIRI: ILUSTRASI */}
        <div className="hidden lg:flex flex-col items-center justify-center relative">
          <div className="absolute w-80 h-80 border-2 border-gray-700 rounded-full opacity-20"></div>
          <div className="absolute top-10 left-10 bg-[#312d4b] p-4 rounded-xl shadow-lg border border-gray-700 w-44 transform -rotate-6 z-20">
            <p className="text-gray-400 text-[10px] uppercase tracking-widest">Access Level</p>
            <h3 className="text-white text-lg font-bold">Karyawan</h3>
            <div className="flex items-center gap-1 mt-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-green-400 text-[10px] font-semibold">System Online</span>
            </div>
          </div>
          <img src="https://demos.pixinvent.com/vuexy-html-admin-template/assets/img/illustrations/auth-login-illustration-dark.png" alt="Login Illustration" className="w-[480px] z-10" />
        </div>

        {/* SISI KANAN: FORM */}
        <div className="bg-[#312d4b] p-10 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-[450px] mx-auto relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-600 rounded-full blur-[80px] opacity-20"></div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-xl">K</span>
            </div>
            <h1 className="text-white text-xl font-bold">ABSENSI KARYAWAN</h1>
          </div>

          <h2 className="text-white text-2xl font-semibold mb-2">Selamat Datang! 👋</h2>
          <p className="text-gray-400 text-sm mb-6">Silakan masuk ke akun karyawan Anda.</p>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-widest mb-2 block font-medium">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={handleInput}
                placeholder="karyawan@amaw.com"
                className="w-full bg-[#28243d] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-indigo-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-widest mb-2 block font-medium">Password</label>
              <div className="relative">
                <input
                  value={password}
                  id="password"
                  onChange={handleInput}
                  type={showPassword ? "text" : "password"}
                  placeholder="········"
                  className="w-full bg-[#28243d] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-indigo-500 outline-none transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-lg transition-all active:scale-[0.98]">Masuk</button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Belum punya akun?{" "}
            <Link to="/register" className="text-indigo-400 font-semibold">
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
