import { useState } from "react";
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
  const [selectedMonth, setSelectedMonth] = useState("");

  // Data Fetching
  const { data: userResponse, isLoading: userLoading } = useGetDataUser();
  const { data: userHistoryResponse, isLoading: historyLoading, refetch: updateTabel } = useGetDataHistory();
  const { mutate: kirimAbsen, isLoading: prosesAbsen } = UseAbsenUser();

  // Mapping & Filtering Data
  const user = userResponse?.data?.user;
  const rawHistory = userHistoryResponse?.data?.riwayat || [];

  const filteredHistory = rawHistory.filter((item) => {
    if (selectedMonth === "") return true;
    return item.date && item.date.includes(`-${selectedMonth}-`);
  });

  // Statistik
  const countHadir = filteredHistory.filter((h) => h.status?.toLowerCase() === "hadir").length;
  const countTerlambat = filteredHistory.filter((h) => h.status?.toLowerCase() === "terlambat").length;
  const totalAbsen = countHadir + countTerlambat;

  // Format tanggal
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

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
    try {
      if (filteredHistory.length === 0) {
        toast.error("Tidak ada data untuk periode ini.");
        return;
      }

      const doc = jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const namaBulan = getMonthName(selectedMonth);
      const today = new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      // Header dengan gradient effect
      doc.setFillColor(79, 70, 229);
      doc.rect(0, 0, 210, 35, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("LAPORAN ABSENSI KARYAWAN", 105, 20, { align: "center" });

      // Info Karyawan
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");

      let yPosition = 45;

      // Kotak info karyawan
      doc.setFillColor(245, 247, 250);
      doc.roundedRect(14, yPosition - 5, 182, 25, 3, 3, "F");

      doc.setFont("helvetica", "bold");
      doc.text("DATA KARYAWAN", 20, yPosition);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Nama: ${user?.name || "-"}`, 20, yPosition + 7);
      doc.text(`Email: ${user?.email || "-"}`, 20, yPosition + 14);
      doc.text(`Periode: ${namaBulan}`, 120, yPosition + 7);
      doc.text(`Cetak: ${today}`, 120, yPosition + 14);

      // Statistik Ringkas
      yPosition = 80;
      doc.setFillColor(79, 70, 229, 0.1);
      doc.roundedRect(14, yPosition - 5, 182, 20, 3, 3, "F");

      doc.setFontSize(9);
      doc.setTextColor(79, 70, 229);
      doc.setFont("helvetica", "bold");
      doc.text("RINGKASAN", 20, yPosition);

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`Total Kehadiran: ${totalAbsen} Hari`, 20, yPosition + 10);
      doc.text(`Hadir: ${countHadir} Hari`, 80, yPosition + 10);
      doc.text(`Terlambat: ${countTerlambat} Kali`, 130, yPosition + 10);

      // Table
      const tableColumn = ["No", "Tanggal", "Jam Masuk", "Status"];
      const tableRows = filteredHistory.map((item, index) => [
        index + 1,
        formatDate(item.date),
        item.check_in
          ? new Date(item.check_in).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          : "-",
        item.status?.toUpperCase() || "-",
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 110,
        theme: "striped",
        headStyles: {
          fillColor: [79, 70, 229],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          halign: "center",
        },
        styles: {
          fontSize: 9,
          cellPadding: 5,
          halign: "center",
        },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 60 },
          2: { cellWidth: 40 },
          3: { cellWidth: 40 },
        },
        alternateRowStyles: {
          fillColor: [245, 247, 250],
        },
      });

      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Halaman ${i} dari ${pageCount} - Dicetak menggunakan Sistem Absensi`, 105, 285, { align: "center" });
      }

      doc.save(`Laporan_Absensi_${user?.name}_${namaBulan}.pdf`);
      toast.success("Laporan PDF berhasil dibuat!");
    } catch (error) {
      console.error("PDF Error:", error);
      toast.error("Gagal membuat laporan.");
    }
  };

  const handleAbsen = () => {
    kirimAbsen(
      {},
      {
        onSuccess: () => {
          updateTabel();
          toast.success("Absen berhasil dicatat!");
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || "Gagal absen");
        },
      },
    );
  };

  const handleLogout = () => {
    CookieStorage.remove(CookieKeys.AuthToken);
    navigate("/login");
  };

  if (userLoading || historyLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1625] to-[#2a2542] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 animate-pulse">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1625] to-[#2a2542] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header dengan Greeting */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold">
                Selamat datang kembali, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{user?.name}</span>
              </h1>
              <p className="text-gray-400 mt-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                {user?.email} • {user?.is_admin ? "Administrator" : "Karyawan"}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {/* Filter Bulan */}
              <div className="relative">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="appearance-none bg-[#312d4b] border border-purple-500/20 text-white rounded-xl px-4 py-2.5 pr-10 text-sm focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                >
                  <option value="">Semua Bulan</option>
                  {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map((m) => (
                    <option key={m} value={m}>
                      {getMonthName(m)}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">📅</div>
              </div>

              {/* Tombol Absen */}
              <button
                disabled={prosesAbsen}
                onClick={handleAbsen}
                className={`
                  px-6 py-2.5 rounded-xl font-semibold transition-all 
                  flex items-center gap-2 shadow-lg active:scale-95
                  ${prosesAbsen ? "bg-gray-600 cursor-not-allowed" : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"}
                `}
              >
                {prosesAbsen ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Memproses...
                  </>
                ) : (
                  <>
                    <span>📝</span>
                    Absen Masuk
                  </>
                )}
              </button>

              {/* Tombol Cetak PDF */}
              <button onClick={downloadLaporanPDF} className="bg-[#312d4b] hover:bg-[#3d3759] border border-purple-500/20 px-6 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 active:scale-95">
                <span>📄</span>
                Cetak PDF
              </button>

              {/* Tombol Admin (jika admin) */}
              {user?.is_admin && (
                <button
                  onClick={() => navigate("/admin")}
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 px-6 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg active:scale-95"
                >
                  <span>⚙️</span>
                  Admin Panel
                </button>
              )}

              {/* Tombol Logout */}
              <button onClick={handleLogout} className="bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600 hover:text-white px-6 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 active:scale-95">
                <span>🚪</span>
                Keluar
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Kehadiran */}
          <div className="bg-[#312d4b] rounded-2xl border border-purple-500/20 p-6 hover:border-indigo-500/50 transition-all group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Kehadiran</p>
                <h3 className="text-3xl font-bold text-white">
                  {totalAbsen}
                  <span className="text-sm font-normal text-gray-500 ml-2">Hari</span>
                </h3>
                <p className="text-xs text-gray-500 mt-2">Periode: {getMonthName(selectedMonth)}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">📊</div>
            </div>
          </div>

          {/* Hadir */}
          <div className="bg-[#312d4b] rounded-2xl border border-purple-500/20 p-6 hover:border-green-500/50 transition-all group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Hadir Tepat Waktu</p>
                <h3 className="text-3xl font-bold text-green-400">
                  {countHadir}
                  <span className="text-sm font-normal text-gray-500 ml-2">Hari</span>
                </h3>
                <div className="w-full bg-gray-700 h-1.5 rounded-full mt-3">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: totalAbsen ? `${(countHadir / totalAbsen) * 100}%` : "0%" }}></div>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-600/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">✅</div>
            </div>
          </div>

          {/* Terlambat */}
          <div className="bg-[#312d4b] rounded-2xl border border-purple-500/20 p-6 hover:border-orange-500/50 transition-all group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Terlambat</p>
                <h3 className="text-3xl font-bold text-orange-400">
                  {countTerlambat}
                  <span className="text-sm font-normal text-gray-500 ml-2">Kali</span>
                </h3>
                <div className="w-full bg-gray-700 h-1.5 rounded-full mt-3">
                  <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: totalAbsen ? `${(countTerlambat / totalAbsen) * 100}%` : "0%" }}></div>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-orange-600/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">⚠️</div>
            </div>
          </div>
        </div>

        {/* Info Filter Aktif */}
        {selectedMonth && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm text-gray-400">Filter aktif:</span>
            <span className="bg-indigo-600/20 text-indigo-300 px-3 py-1 rounded-full text-xs border border-indigo-500/30 flex items-center gap-1">
              <span>📅</span>
              {getMonthName(selectedMonth)}
            </span>
          </div>
        )}

        {/* Tabel Riwayat Absensi */}
        <div className="bg-[#312d4b] rounded-2xl border border-purple-500/20 overflow-hidden">
          {/* Header Tabel */}
          <div className="px-6 py-4 border-b border-purple-500/20 bg-[#2d2945] flex justify-between items-center">
            <h3 className="font-bold text-white flex items-center gap-2">
              <span>📋</span>
              Riwayat Absensi
            </h3>
            <span className="text-xs bg-indigo-600/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30">{filteredHistory.length} Data</span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#25213b]">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">No</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Jam Masuk</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/10">
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((item, index) => (
                    <tr key={index} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4 text-sm text-gray-300">{index + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-300">{item.date}</span>
                          {item.date === new Date().toISOString().split("T")[0] && <span className="bg-blue-500/20 text-blue-300 text-[10px] px-2 py-0.5 rounded-full">Hari Ini</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-black/30 text-gray-300 px-3 py-1.5 rounded-lg text-xs font-mono">
                          {item.check_in
                            ? new Date(item.check_in).toLocaleTimeString("id-ID", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              })
                            : "--:--"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`
                            px-3 py-1.5 rounded-lg text-xs font-bold border
                            ${item.status?.toLowerCase() === "hadir" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-orange-500/10 text-orange-400 border-orange-500/20"}
                          `}
                        >
                          {item.status?.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-gray-400 hover:text-indigo-400 transition-colors mx-1">👁️</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="text-5xl mb-4 opacity-50">📭</div>
                      <p className="text-gray-400 text-sm mb-2">Tidak ada data absensi untuk periode ini</p>
                      {selectedMonth && (
                        <button onClick={() => setSelectedMonth("")} className="text-indigo-400 hover:text-indigo-300 text-sm underline underline-offset-2">
                          Tampilkan semua data
                        </button>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Tabel */}
          {filteredHistory.length > 0 && (
            <div className="px-6 py-4 border-t border-purple-500/20 bg-[#2d2945]">
              <div className="flex justify-between items-center text-sm">
                <p className="text-gray-400">
                  Menampilkan <span className="text-white font-semibold">{filteredHistory.length}</span> dari <span className="text-white font-semibold">{rawHistory.length}</span> data
                </p>
                <p className="text-gray-400">
                  Hadir: <span className="text-green-400 font-semibold">{countHadir}</span> | Terlambat: <span className="text-orange-400 font-semibold">{countTerlambat}</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center">
          <p className="text-gray-500 text-xs">© {new Date().getFullYear()} • Sistem Absensi Karyawan</p>
        </footer>
      </div>
    </div>
  );
};
