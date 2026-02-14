import React, { useState } from "react";
import { Link } from "react-router-dom";
import { UseCreateUser } from "../../service/auth/register_user";
import toast from "react-hot-toast";

export const RegisterKaryawan = () => {
  const [name, setname] = useState("");
  const [no_hp, setno_hp] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Panggil hook-nya. Saya asumsikan namanya useCreateUser di file aslinya
  const { mutate: Regis } = UseCreateUser();

  const handleInput = (e) => {
    const { id, value } = e.target;
    if (id === "name") setname(value);
    if (id === "email") setemail(value);
    if (id === "password") setpassword(value);
    if (id === "no_hp") setno_hp(value);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!name || !email || !password || !no_hp) return toast.error("Semua Field Wajib di Isi");
    Regis({
      name: name,
      email: email,
      password: password,
      no_hp: no_hp,
    });
  };

  return (
    <div className="min-h-screen bg-[#28243d] flex items-center justify-center p-6 font-sans">
      <div className="max-w-[1200px] w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* SISI KIRI: ILUSTRASI (Order 2 agar di kanan pada desktop) */}
        <div className="hidden lg:flex flex-col items-center justify-center relative lg:order-2">
          <div className="absolute w-96 h-96 border-2 border-indigo-500/10 rounded-full opacity-20"></div>
          <img src="https://demos.pixinvent.com/vuexy-html-admin-template/assets/img/illustrations/auth-register-illustration-dark.png" alt="Register Illustration" className="w-[500px] z-10" />
        </div>

        {/* SISI KANAN: FORM (Order 1) */}
        <div className="bg-[#312d4b] p-10 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-[500px] mx-auto relative overflow-hidden lg:order-1">
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-600 rounded-full blur-[80px] opacity-20"></div>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-xl">K</span>
            </div>
            <h1 className="text-white text-xl font-bold">DAFTAR</h1>
          </div>

          <h2 className="text-white text-2xl font-semibold mb-2">Buat Akun 🚀</h2>
          <p className="text-gray-400 text-sm mb-6">Lengkapi data untuk bergabung ke sistem.</p>

          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-widest mb-1 block">Nama Lengkap</label>
              <input type="text" onChange={handleInput} id="name" value={name} placeholder="John Doe" className="w-full bg-[#28243d] border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 outline-none" />
            </div>
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-widest mb-1 block">Email</label>
              <input
                onChange={handleInput}
                id="email"
                value={email}
                type="email"
                placeholder="karyawan@amaw.com"
                className="w-full bg-[#28243d] border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-widest mb-1 block">No Telfon</label>
              <input onChange={handleInput} id="no_hp" value={no_hp} type="no_hp" placeholder="025161546546" className="w-full bg-[#28243d] border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 outline-none" />
            </div>
            <div>
              <label className="text-gray-400 text-xs uppercase tracking-widest mb-1 block">Password</label>
              <div className="relative">
                <input
                  onChange={handleInput}
                  id="password"
                  value={password}
                  type={showPassword ? "text" : "password"}
                  placeholder="········"
                  className="w-full bg-[#28243d] border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 outline-none font-mono"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              <p className="mt-2 text-[10px] text-gray-400 italic font-light leading-snug">
                <span className="text-indigo-400 font-bold">*</span> Min. 8 karakter, 1 huruf besar, 1 angka, & 1 karakter spesial.
              </p>
            </div>
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-lg mt-4 transition-all active:scale-[0.98]">Daftar Sekarang</button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Sudah punya akun?{" "}
            <Link to="/login" className="text-indigo-400 font-semibold">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
