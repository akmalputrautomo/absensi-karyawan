import React, { useState } from "react";
import { useGetDataUseradminabsensi } from "../../service/admin/Userabsensi";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";
import Header from "../../assets/component/layout/Header";
import Sidebar from "../../assets/component/layout/SideBar";

export const AbsensiUser = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // States untuk Filter
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const { data: absensiResponse, isLoading: loadingAbsensi } = useGetDataUseradminabsensi();
  const allAbsensi = absensiResponse?.data || [];

  // Mendapatkan daftar nama unik untuk dropdown filter
  const uniqueNames = [...new Set(allAbsensi.map((item) => item.user?.name))].filter(Boolean).sort();

  // Logika Filtering
  const filteredAbsensi = allAbsensi.filter((abs) => {
    const matchMonth = selectedMonth === "" || (abs.date && abs.date.includes(`-${selectedMonth}-`));
    const matchName = selectedName === "" || abs.user?.name === selectedName;
    const matchStatus = selectedStatus === "" || abs.status?.toLowerCase() === selectedStatus.toLowerCase();
    return matchMonth && matchName && matchStatus;
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Fungsi Cetak PDF
  const downloadLaporanPDF = () => {
    try {
      if (filteredAbsensi.length === 0) {
        toast.error("Tidak ada data untuk dicetak.");
        return;
      }

      const doc = jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const namaBulan = getMonthName(selectedMonth);
      const namaKaryawan = selectedName || "Semua Karyawan";
      const statusFilter = selectedStatus || "Semua Status";

      // Header dengan styling
      doc.setFillColor(79, 70, 229);
      doc.rect(0, 0, 297, 25, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("LAPORAN ABSENSI KARYAWAN", 148.5, 15, { align: "center" });

      // Info section
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      doc.text(`Karyawan: ${namaKaryawan}`, 14, 35);
      doc.text(`Periode: ${namaBulan}`, 14, 42);
      doc.text(`Status: ${statusFilter}`, 14, 49);
      doc.text(`Total Data: ${filteredAbsensi.length} Records`, 14, 56);
      doc.text(`Tanggal Cetak: ${new Date().toLocaleString("id-ID")}`, 14, 63);

      // Table
      const tableColumn = ["No", "Nama Karyawan", "Email", "Tanggal", "Jam Masuk", "Jam Keluar", "Status"];
      const tableRows = filteredAbsensi.map((abs, index) => [
        index + 1,
        abs.user?.name || "N/A",
        abs.user?.email || "-",
        abs.date || "-",
        abs.check_in ? new Date(abs.check_in).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "--:--",
        abs.check_out ? new Date(abs.check_out).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "--:--",
        abs.status?.toUpperCase() || "-",
      ]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 70,
        theme: "striped",
        headStyles: {
          fillColor: [79, 70, 229],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          halign: "center",
        },
        styles: {
          fontSize: 8,
          cellPadding: 4,
        },
        columnStyles: {
          0: { halign: "center", cellWidth: 10 },
          1: { halign: "left", cellWidth: 40 },
          2: { halign: "left", cellWidth: 50 },
          3: { halign: "center", cellWidth: 25 },
          4: { halign: "center", cellWidth: 20 },
          5: { halign: "center", cellWidth: 20 },
          6: { halign: "center", cellWidth: 20 },
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
        doc.text(`Halaman ${i} dari ${pageCount} - Dicetak menggunakan Sistem Absensi`, 148.5, 200, { align: "center" });
      }

      doc.save(`Absensi_${namaKaryawan}_${namaBulan}.pdf`);
      toast.success("PDF berhasil dibuat!");
    } catch (error) {
      console.error("Gagal cetak:", error);
      toast.error("Terjadi kesalahan saat memproses laporan PDF.");
    }
  };

  // Statistik untuk header
  const getStats = () => {
    const hadir = filteredAbsensi.filter((a) => a.status?.toLowerCase() === "hadir").length;
    const terlambat = filteredAbsensi.filter((a) => a.status?.toLowerCase() === "terlambat").length;

    return [
      { label: "Total Data", value: filteredAbsensi.length },
      { label: "Hadir", value: hadir },
      { label: "terlambat", value: terlambat },
    ];
  };

  if (loadingAbsensi) {
    return (
      <div className="min-h-screen bg-[#1a1625] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 animate-pulse">Memuat data absensi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1625] flex">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <main className="flex-1 overflow-auto">
        <div className="p-4 lg:p-8">
          <Header toggleSidebar={toggleSidebar} title="Data Absensi Karyawan" subtitle="Monitor dan rekap absensi karyawan dengan mudah" stats={getStats()} />

          {/* Filter Section */}
          <div className="bg-[#312d4b] rounded-xl border border-purple-500/20 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Filter Nama */}
              <div>
                <label className="block text-gray-400 text-xs mb-2">FILTER NAMA</label>
                <select value={selectedName} onChange={(e) => setSelectedName(e.target.value)} className="w-full bg-[#25213b] border border-purple-500/20 text-white rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="">Semua Karyawan</option>
                  {uniqueNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Bulan */}
              <div>
                <label className="block text-gray-400 text-xs mb-2">FILTER BULAN</label>
                <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="w-full bg-[#25213b] border border-purple-500/20 text-white rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="">Semua Bulan</option>
                  {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map((m) => (
                    <option key={m} value={m}>
                      {getMonthName(m)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Status */}
              <div>
                <label className="block text-gray-400 text-xs mb-2">FILTER STATUS</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full bg-[#25213b] border border-purple-500/20 text-white rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Semua Status</option>
                  <option value="hadir">Hadir</option>
                  <option value="Terlambat">Terlambat</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-end gap-2">
                <button
                  onClick={() => {
                    setSelectedName("");
                    setSelectedMonth("");
                    setSelectedStatus("");
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg text-sm font-semibold transition-all"
                >
                  Reset Filter
                </button>
                <button onClick={downloadLaporanPDF} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2">
                  <span>📥</span>
                  Cetak PDF
                </button>
              </div>
            </div>

            {/* Info Filter Aktif */}
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedName && <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs border border-indigo-500/30">Nama: {selectedName}</span>}
              {selectedMonth && <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs border border-indigo-500/30">Bulan: {getMonthName(selectedMonth)}</span>}
              {selectedStatus && <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs border border-indigo-500/30">Status: {selectedStatus}</span>}
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-4">
              <p className="text-indigo-200 text-sm">Total Data</p>
              <p className="text-2xl font-bold text-white">{filteredAbsensi.length}</p>
            </div>

            <div className="bg-[#312d4b] rounded-xl p-4 border border-purple-500/20">
              <p className="text-gray-400 text-sm">Hadir</p>
              <p className="text-2xl font-bold text-green-400">{filteredAbsensi.filter((a) => a.status?.toLowerCase() === "hadir").length}</p>
            </div>

            <div className="bg-[#312d4b] rounded-xl p-4 border border-purple-500/20">
              <p className="text-gray-400 text-sm">terlambat</p>
              <p className="text-2xl font-bold text-yellow-400">{filteredAbsensi.filter((a) => a.status?.toLowerCase() === "terlambat").length}</p>
            </div>
          </div>

          {/* Tabel Absensi */}
          <div className="bg-[#312d4b] rounded-xl border border-purple-500/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#2d2945]">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Karyawan</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Tanggal</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Jam Masuk</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Jam Keluar</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                    {/* <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Aksi</th> */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-500/10">
                  {filteredAbsensi.length > 0 ? (
                    filteredAbsensi.map((abs, idx) => (
                      <tr key={abs._id || idx} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm">{abs.user?.name?.charAt(0).toUpperCase()}</div>
                            <div>
                              <p className="text-white font-medium">{abs.user?.name || "N/A"}</p>
                              <p className="text-gray-400 text-xs">{abs.user?.email || "-"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-300">{abs.date || "-"}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-black/30 text-gray-300 px-2 py-1 rounded text-xs font-mono">{abs.check_in ? new Date(abs.check_in).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "--:--"}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-black/30 text-gray-300 px-2 py-1 rounded text-xs font-mono">{abs.check_out ? new Date(abs.check_out).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "--:--"}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`
                            px-3 py-1 rounded-full text-xs font-medium
                            ${abs.status?.toLowerCase() === "hadir" ? "bg-green-500/10 text-green-400 border border-green-500/20" : ""}
                            ${abs.status?.toLowerCase() === "terlambat" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" : ""}
                          `}
                          >
                            {abs.status?.toUpperCase()}
                          </span>
                        </td>
                        {/* <td className="px-6 py-4 text-right">
                          <button className="text-gray-400 hover:text-indigo-400 transition-colors mx-1">👁️</button>
                          <button className="text-gray-400 hover:text-yellow-400 transition-colors mx-1">✏️</button>
                        </td> */}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="text-4xl mb-3">📭</div>
                        <p className="text-gray-400">Tidak ada data absensi untuk filter ini.</p>
                        <button
                          onClick={() => {
                            setSelectedName("");
                            setSelectedMonth("");
                            setSelectedStatus("");
                          }}
                          className="mt-3 text-indigo-400 hover:text-indigo-300 text-sm"
                        >
                          Reset Filter
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer Tabel */}
            {filteredAbsensi.length > 0 && (
              <div className="px-6 py-4 border-t border-purple-500/20 bg-[#2d2945]">
                <p className="text-gray-400 text-sm">
                  Menampilkan <span className="text-white font-semibold">{filteredAbsensi.length}</span> data absensi
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AbsensiUser;
