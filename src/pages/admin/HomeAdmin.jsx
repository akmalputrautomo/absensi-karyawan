import React from "react";
import { useGetDataUseradmin } from "../../service/admin/Users";
import { useNavigate } from "react-router-dom";
import { CookieKeys, CookieStorage } from "../../utils/cookies";

// 1. IMPORT PDF TOOLS
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const HomeAdmin = () => {
  const navigate = useNavigate();

  // Fetching Data User
  const { data: usersResponse, isLoading: loadingUsers } = useGetDataUseradmin();

  // Mapping Data
  const allUsers = usersResponse?.data || [];

  // 2. FUNGSI DOWNLOAD PDF DAFTAR USER
  const downloadUserPDF = () => {
    try {
      if (allUsers.length === 0) {
        alert("Tidak ada data user untuk dicetak.");
        return;
      }

      const doc = jsPDF();

      // Header Laporan
      doc.setFontSize(18);
      doc.text("DAFTAR KARYAWAN / USER", 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Total Terdaftar: ${allUsers.length} User`, 14, 28);
      doc.text(`Tanggal Cetak: ${new Date().toLocaleString("id-ID")}`, 14, 33);

      // Mapping Kolom dan Baris
      const tableColumn = ["No", "Nama Karyawan", "Email", "Status"];
      const tableRows = allUsers.map((u, index) => [index + 1, u.name || "N/A", u.email || "-", "AKTIF"]);

      // Generate Table
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 40,
        theme: "grid",
        headStyles: { fillColor: [79, 70, 229], halign: "center" }, // Indigo
        styles: { fontSize: 9, halign: "left" },
        columnStyles: {
          0: { halign: "center", cellWidth: 15 },
          3: { halign: "center" },
        },
      });

      doc.save(`Daftar_User_Absensi_${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error("Gagal cetak PDF:", error);
      alert("Terjadi kesalahan saat membuat PDF.");
    }
  };

  const handleLogout = () => {
    CookieStorage.remove(CookieKeys.AuthToken);
    navigate("/login");
  };

  const goToAbsensi = () => {
    navigate("/adminabsensi");
  };
  const goTohome = () => {
    navigate("/");
  };

  if (loadingUsers) {
    return (
      <div className="min-h-screen bg-[#28243d] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="animate-pulse tracking-widest text-sm text-gray-400">MEMUAT DATA...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#28243d] text-white font-sans p-4 lg:p-8">
      <div className="max-w-[1000px] mx-auto">
        {/* HEADER */}
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Admin <span className="text-indigo-400">Panel</span>
            </h1>
            <p className="text-gray-400 mt-2 text-sm">Manajemen akun dan kontrol akses karyawan.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={goToAbsensi} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg active:scale-95 flex items-center gap-2">
              📊 Data Absensi
            </button>
            <button onClick={handleLogout} className="bg-red-600/20 text-red-400 border border-red-500/50 hover:bg-red-600 hover:text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95">
              Keluar
            </button>
            <button
              onClick={goTohome}
              className="bg-green-600/20 text-green-400 border border-green-500/50 hover:bg-green-600 hover:text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95 flex items-center gap-2"
            >
              🏠 Home
            </button>
          </div>

          <div className="bg-[#312d4b] px-6 py-3 rounded-2xl border border-gray-700 shadow-lg text-center min-w-[150px]">
            <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-1">Total Karyawan</p>
            <h3 className="text-2xl font-bold text-indigo-400">
              {allUsers.length} <span className="text-xs font-normal text-white">User</span>
            </h3>
          </div>
        </header>

        {/* TABLE SECTION */}
        <div className="bg-[#312d4b] rounded-2xl border border-gray-700 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-gray-700 bg-[#353152] flex justify-between items-center">
            <h3 className="font-bold text-lg">Daftar Akun Karyawan</h3>
            {/* BUTTON CETAK PDF */}
            <button onClick={downloadUserPDF} className="text-xs bg-[#2d2945] hover:border-indigo-500 border border-gray-600 px-4 py-2 rounded-lg transition-all font-semibold flex items-center gap-2 active:scale-95">
              <span>📄</span> Cetak PDF
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-400 text-[10px] uppercase tracking-[0.2em] bg-[#2d2945]">
                  <th className="px-8 py-5">Informasi User</th>
                  <th className="px-8 py-5 text-center">Email</th>
                  <th className="px-8 py-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {allUsers.length > 0 ? (
                  allUsers.map((u, idx) => (
                    <tr key={u._id || idx} className="hover:bg-white/5 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center font-bold text-indigo-400 uppercase">{u.name?.charAt(0) || "U"}</div>
                          <div>
                            <div className="font-semibold text-gray-200 group-hover:text-indigo-300 transition-colors">{u.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-center">
                        <code className="text-[10px] bg-black/30 px-2 py-1 rounded text-gray-400">{u.email}</code>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Aktif</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-8 py-20 text-center text-gray-500 text-sm italic">
                      Tidak ada data user yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <footer className="mt-12 py-6 border-t border-gray-800 text-center">
          <p className="text-gray-500 text-[10px] tracking-widest uppercase">Admin Management Panel • Amaw Absensi</p>
        </footer>
      </div>
    </div>
  );
};
