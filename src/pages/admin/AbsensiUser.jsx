import React, { useState } from "react";
import { useGetDataUseradminabsensi } from "../../service/admin/Userabsensi";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";

export const AbsensiUser = () => {
  const navigate = useNavigate();

  // 1. States untuk Filter
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedName, setSelectedName] = useState("");

  const { data: absensiResponse, isLoading: loadingAbsensi } = useGetDataUseradminabsensi();

  const allAbsensi = absensiResponse?.data || [];

  // 2. Mendapatkan daftar nama unik untuk dropdown filter
  // Ini otomatis mengambil nama dari data yang ada
  const uniqueNames = [...new Set(allAbsensi.map((item) => item.user?.name))].filter(Boolean).sort();

  // 3. Logika Filtering Ganda (Bulan & Nama)
  const filteredAbsensi = allAbsensi.filter((abs) => {
    const matchMonth = selectedMonth === "" || (abs.date && abs.date.includes(`-${selectedMonth}-`));
    const matchName = selectedName === "" || abs.user?.name === selectedName;
    return matchMonth && matchName;
  });

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

  // 4. Fungsi Cetak PDF dengan Header Dinamis
  const downloadLaporanPDF = () => {
    try {
      if (filteredAbsensi.length === 0) {
        toast.error("Tidak ada data untuk dicetak.");
        return;
      }

      const doc = jsPDF({ orientation: "l", unit: "mm", format: "a4" });
      const namaBulan = getMonthName(selectedMonth);
      const namaKaryawan = selectedName || "Semua Karyawan";

      doc.setFontSize(18);
      doc.text("REKAPITULASI ABSENSI KARYAWAN", 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(100);
      // Header PDF menyesuaikan filter yang aktif
      doc.text(`Karyawan      : ${namaKaryawan}`, 14, 30);
      doc.text(`Periode        : ${namaBulan}`, 14, 35);
      doc.text(`Total Data     : ${filteredAbsensi.length} Records`, 14, 40);
      doc.text(`Tanggal Cetak  : ${new Date().toLocaleString("id-ID")}`, 14, 45);

      const tableColumn = ["No", "Nama Karyawan", "Email", "Tanggal", "Jam Masuk", "Status"];
      const tableRows = filteredAbsensi.map((abs, index) => [
        index + 1,
        abs.user?.name || "N/A",
        abs.user?.email || "-",
        abs.date || "-",
        abs.check_in ? new Date(abs.check_in).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "--:--",
        abs.status?.toUpperCase() || "-",
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 52,
        theme: "grid",
        headStyles: { fillColor: [79, 70, 229], halign: "center" },
        styles: { fontSize: 8, halign: "center" },
        columnStyles: {
          1: { halign: "left", cellWidth: 50 },
          2: { halign: "left", cellWidth: 60 },
        },
      });

      doc.save(`Absensi_${namaKaryawan}_${namaBulan}.pdf`);
    } catch (error) {
      console.error("Gagal cetak:", error);
      alert("Terjadi kesalahan saat memproses laporan PDF.");
    }
  };

  if (loadingAbsensi) {
    return (
      <div className="min-h-screen bg-[#28243d] flex items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#28243d] text-white font-sans p-4 lg:p-8">
      <div className="max-w-[1200px] mx-auto">
        <header className="mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Log <span className="text-indigo-400">Absensi</span>
            </h1>
            <p className="text-gray-400 mt-1 text-sm">Filter berdasarkan nama dan bulan untuk rekap spesifik.</p>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {/* FILTER NAMA */}
            <select
              value={selectedName}
              onChange={(e) => setSelectedName(e.target.value)}
              className="bg-[#312d4b] border border-gray-600 text-white text-sm rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all min-w-[160px]"
            >
              <option value="">Semua Karyawan</option>
              {uniqueNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>

            {/* FILTER BULAN */}
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="bg-[#312d4b] border border-gray-600 text-white text-sm rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
              <option value="">Semua Bulan</option>
              {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map((m) => (
                <option key={m} value={m}>
                  {getMonthName(m)}
                </option>
              ))}
            </select>

            <button onClick={() => navigate("/admin")} className="bg-[#312d4b] border border-gray-600 hover:border-indigo-500 px-5 py-2.5 rounded-xl font-semibold transition-all">
              👥 Users
            </button>

            <button onClick={downloadLaporanPDF} className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg active:scale-95">
              📄 Cetak PDF
            </button>
          </div>
        </header>

        <div className="bg-[#312d4b] rounded-2xl border border-gray-700 overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-gray-700 bg-[#353152] flex flex-wrap justify-between items-center gap-4">
            <div>
              <span className="text-gray-400 text-sm">Menampilkan: </span>
              <span className="font-bold text-indigo-300">{selectedName || "Semua Karyawan"}</span>
              <span className="mx-2 text-gray-600">|</span>
              <span className="font-bold text-indigo-300">{getMonthName(selectedMonth)}</span>
            </div>
            <span className="text-[10px] text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 font-bold uppercase tracking-wider">{filteredAbsensi.length} Data ditemukan</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-400 text-[10px] uppercase tracking-[0.2em] bg-[#2d2945]">
                  <th className="px-8 py-5">Karyawan</th>
                  <th className="px-8 py-5">Tanggal</th>
                  <th className="px-8 py-5">Jam Masuk</th>
                  <th className="px-8 py-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredAbsensi.length > 0 ? (
                  filteredAbsensi.map((abs, idx) => (
                    <tr key={abs._id || idx} className="hover:bg-white/5 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="font-semibold text-indigo-300">{abs.user?.name || "N/A"}</div>
                        <div className="text-[10px] text-gray-500 font-mono">{abs.user?.email || "-"}</div>
                      </td>
                      <td className="px-8 py-5 text-sm text-gray-300">{abs.date || "-"}</td>
                      <td className="px-8 py-5 text-sm">
                        <span className="text-gray-400 font-mono bg-black/20 px-2 py-1 rounded">{abs.check_in ? new Date(abs.check_in).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false }) : "--:--"}</span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <span
                          className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase border ${
                            abs.status?.toLowerCase() === "hadir" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                          }`}
                        >
                          {abs.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-8 py-20 text-center text-gray-500 text-sm italic">
                      Tidak ada data absensi untuk filter ini.
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
