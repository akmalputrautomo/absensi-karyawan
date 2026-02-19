import React, { useState } from "react";
import { useGetDataUser } from "../../service/auth/me.user";
import { CookieKeys, CookieStorage } from "../../utils/cookies";
import { useNavigate } from "react-router-dom";
import { UseAbsenUser } from "../../service/main/absen";
import { useGetDataHistory } from "../../service/main/historyabsen";

// IMPORT PDF TOOLS
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";

export const HomePage = () => {
  const navigate = useNavigate();

  // State untuk filter bulan (default: "" berarti semua bulan)
  const [selectedMonth, setSelectedMonth] = useState("");

  // --- LOGIKA PENGECEKAN WEEKEND ---
  // const today = new Date();
  // const dayOfWeek = today.getDay();
  // const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  // 1. Data Fetching
  const { data: userResponse, isLoading: userLoading } = useGetDataUser();
  const { data: userHistoryResponse, isLoading: historyLoading, refetch: updateTabel } = useGetDataHistory();
  const { mutate: kirimAbsen, isLoading: prosesAbsen } = UseAbsenUser();

  // 2. Mapping & Filtering Data
  const user = userResponse?.data?.user;
  const rawHistory = userHistoryResponse?.data?.riwayat || [];
  // const rawHistory1 = userHistoryResponse?.data || [];

  const filteredHistory = rawHistory.filter((item) => {
    if (selectedMonth === "") return true;
    return item.date && item.date.includes(`-${selectedMonth}-`);
  });

  const countHadir = filteredHistory.filter((h) => h.status?.toLowerCase() === "hadir").length;
  const countTerlambat = filteredHistory.filter((h) => h.status?.toLowerCase() === "terlambat").length;

  const getMonthName = (monthNumber) => {
    const months = {
      "01": "Januari",
      "02": "Februari",
      "03": "Maret",
      "04": "April",
      "05": "Mei",
      "06": "Juni",
      "07": "Juli",
      "08": "Agustus",
      "09": "September",
      10: "Oktober",
      11: "November",
      12: "Desember",
    };
    return months[monthNumber] || "Semua Periode";
  };

  const downloadLaporanPDF = () => {
    const totalRecords = countHadir + countTerlambat;
    try {
      if (filteredHistory.length === 0) {
        toast.error("Tidak ada data untuk bulan ini.");
        return;
      }
      const doc = jsPDF();
      const namaBulan = getMonthName(selectedMonth);
      doc.setFontSize(18);
      doc.text("LAPORAN ABSENSI KARYAWAN", 14, 20);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Nama Karyawan : ${user?.name || "-"}`, 14, 30);
      doc.text(`Periode Laporan: ${namaBulan}`, 14, 35);
      doc.text(`Tanggal Cetak  : ${new Date().toLocaleString("id-ID")}`, 14, 40);
      doc.text(`Total Kehadiran: ${totalRecords} (Hadir: ${countHadir}, Terlambat: ${countTerlambat})`, 14, 50);

      const tableColumn = ["No", "Tanggal", "Jam Masuk", "Status"];
      const tableRows = filteredHistory.map((item, index) => [
        index + 1,
        item.date || "-",
        item.check_in ? new Date(item.check_in).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "-",
        item.status?.toUpperCase() || "-",
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 55,
        theme: "grid",
        headStyles: { fillColor: [79, 70, 229] },
        styles: { halign: "center" },
      });
      doc.save(`Laporan_Absensi_${user?.name}_${namaBulan}.pdf`);
    } catch (error) {
      console.error("PDF Error:", error);
      alert("Gagal membuat laporan.");
    }
  };

  const handleLogout = () => {
    CookieStorage.remove(CookieKeys.AuthToken);
    navigate("/login");
  };

  if (userLoading || historyLoading) return <div className="min-h-screen bg-[#28243d] flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#28243d] text-white font-sans p-4 lg:p-8">
      <div className="max-w-[1200px] mx-auto">
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">
              Halo, <span className="text-indigo-400">{user?.name}</span>!
            </h1>
            <p className="text-gray-400 text-sm italic">{user?.email}</p>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="bg-[#312d4b] border border-gray-600 text-white text-sm rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">Pilih Bulan (Semua)</option>
              {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map((m) => (
                <option key={m} value={m}>
                  {getMonthName(m)}
                </option>
              ))}
            </select>

            {/* TOMBOL ABSENSI (Hanya muncul jika bukan Weekend) */}
            <button
              disabled={prosesAbsen}
              onClick={() => {
                kirimAbsen(
                  {},
                  {
                    onSuccess: () => {
                      updateTabel();
                      // toast.success("Absen berhasil!");
                    },
                    onError: () => {
                      // Menampilkan pesan error dari backend (termasuk error weekend)
                      // toast.error(error.response?.data?.message || "Gagal absen");
                    },
                  },
                );
              }}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 px-5 py-2.5 rounded-lg font-semibold shadow-lg transition-all active:scale-95"
            >
              {prosesAbsen ? "Memproses..." : "Absen Masuk"}
            </button>

            {/* BLOK KONDISIONAL UNTUK WEEKEND DIHAPUS */}
            {/* Kode berikut dihapus:
            {!isWeekend ? (
              <button>...</button>
            ) : (
              <div>Libur Akhir Pekan</div>
            )}
            */}
            <button onClick={downloadLaporanPDF} className="bg-[#312d4b] border border-gray-600 hover:border-indigo-400 px-5 py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2">
              📄 Cetak PDF
            </button>

            {user?.is_admin === true && (
              <button onClick={() => navigate("/admin")} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg active:scale-95 flex items-center gap-2">
                🛡️ Panel Admin
              </button>
            )}

            <button onClick={handleLogout} className="text-red-400 border border-red-500/50 px-5 py-2.5 rounded-lg hover:bg-red-600 hover:text-white transition-all">
              Log out
            </button>
          </div>
        </header>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#312d4b] p-6 rounded-2xl border border-gray-700">
            <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Hadir ({getMonthName(selectedMonth)})</p>
            <h3 className="text-3xl font-bold text-green-400">
              {countHadir + countTerlambat} <span className="text-sm font-normal text-gray-500">Hari</span>
            </h3>
          </div>
          <div className="bg-[#312d4b] p-6 rounded-2xl border border-gray-700">
            <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Terlambat ({getMonthName(selectedMonth)})</p>
            <h3 className="text-3xl font-bold text-orange-400">
              {countTerlambat} <span className="text-sm font-normal text-gray-500">Kali</span>
            </h3>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-[#312d4b] rounded-2xl border border-gray-700 overflow-hidden shadow-xl">
          <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-[#353152]">
            <h3 className="font-bold text-lg">Riwayat: {getMonthName(selectedMonth)}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-[10px] uppercase tracking-[0.2em] bg-[#2d2945]">
                  <th className="px-6 py-4">Tanggal</th>
                  <th className="px-6 py-4">Jam Masuk</th>
                  <th className="px-4 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((item, index) => (
                    <tr key={index} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-sm">{item.date}</td>
                      <td className="px-6 py-4 text-sm">{item.check_in ? new Date(item.check_in).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "-"}</td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`px-3 py-1 rounded text-[10px] font-bold border ${item.status?.toLowerCase() === "hadir" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-orange-500/10 text-orange-400 border-orange-500/20"}`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-10 text-center text-gray-500 italic">
                      Data tidak ditemukan untuk periode ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
