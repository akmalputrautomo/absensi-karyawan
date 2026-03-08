import React, { useState } from "react";
import { useGetDataUseradmin } from "../../service/admin/Users";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Sidebar from "../../assets/component/layout/SideBar";
import Header from "../../assets/component/layout/Header";
import UserTable from "../../assets/component/admin/UserTable";

export const HomeAdmin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: usersResponse, isLoading: loadingUsers } = useGetDataUseradmin();
  const allUsers = usersResponse?.data || [];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const downloadUserPDF = () => {
    try {
      if (allUsers.length === 0) {
        alert("Tidak ada data user untuk dicetak.");
        return;
      }

      const doc = jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Header dengan styling
      doc.setFillColor(79, 70, 229);
      doc.rect(0, 0, 210, 30, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("LAPORAN DATA KARYAWAN", 105, 15, { align: "center" });

      // Info section
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      const date = new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      doc.text(`Tanggal Cetak: ${date}`, 14, 40);
      doc.text(`Total Karyawan: ${allUsers.length} orang`, 14, 46);
      doc.text(`Status: Aktif`, 14, 52);

      // Table
      const tableColumn = ["No", "Nama Karyawan", "Email", "Status", "Terdaftar"];
      const tableRows = allUsers.map((u, index) => [index + 1, u.name || "-", u.email || "-", "Aktif", u.createdAt ? new Date(u.createdAt).toLocaleDateString("id-ID") : "-"]);

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 60,
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
        },
        columnStyles: {
          0: { halign: "center", cellWidth: 15 },
          3: { halign: "center", cellWidth: 25 },
          4: { halign: "center", cellWidth: 30 },
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
        doc.text(`Halaman ${i} dari ${pageCount} - Dicetak menggunakan Sistem Absensi`, 105, 287, { align: "center" });
      }

      doc.save(`Laporan_Karyawan_${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error("Gagal cetak PDF:", error);
      alert("Terjadi kesalahan saat membuat PDF.");
    }
  };

  if (loadingUsers) {
    return (
      <div className="min-h-screen bg-[#1a1625] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 animate-pulse">Memuat data...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Total Karyawan", value: allUsers.length },
    { label: "Aktif", value: allUsers.length },
    { label: "Hari Ini", value: new Date().toLocaleDateString("id-ID", { weekday: "short" }) },
  ];

  return (
    <div className="min-h-screen bg-[#1a1625] flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-4 lg:p-8">
          {/* Header */}
          <Header toggleSidebar={toggleSidebar} title="Dashboard Admin" subtitle="Selamat datang kembali, Admin! Kelola data karyawan dan absensi di sini." stats={stats} />

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Stat Cards */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-indigo-200 text-sm mb-1">Total Karyawan</p>
                  <h3 className="text-3xl font-bold text-white">{allUsers.length}</h3>
                </div>
                <div className="text-4xl">👥</div>
              </div>
              <div className="mt-4 text-indigo-200 text-sm">↑ 12% dari bulan lalu</div>
            </div>

            <div className="bg-[#312d4b] rounded-2xl p-6 border border-purple-500/20">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Absensi Hari Ini</p>
                  <h3 className="text-3xl font-bold text-white">24</h3>
                </div>
                <div className="text-4xl">📊</div>
              </div>
              <div className="mt-4 text-gray-400 text-sm">8 karyawan belum absen</div>
            </div>

            <div className="bg-[#312d4b] rounded-2xl p-6 border border-purple-500/20">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Izin Hari Ini</p>
                  <h3 className="text-3xl font-bold text-white">3</h3>
                </div>
                <div className="text-4xl">📝</div>
              </div>
              <div className="mt-4 text-gray-400 text-sm">2 pending approval</div>
            </div>
          </div>

          {/* User Table */}
          <UserTable users={allUsers} onDownloadPDF={downloadUserPDF} />

          {/* Recent Activity */}
          {/* <div className="mt-6 bg-[#312d4b] rounded-2xl border border-purple-500/20 p-6">
            <h3 className="text-white font-bold text-lg mb-4">📈 Aktivitas Terbaru</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">👤</div>
                  <div className="flex-1">
                    <p className="text-white text-sm">
                      <span className="font-semibold">John Doe</span> melakukan absensi masuk
                    </p>
                    <p className="text-gray-400 text-xs">5 menit yang lalu</p>
                  </div>
                  <span className="text-green-400 text-xs bg-green-500/10 px-2 py-1 rounded-full">Berhasil</span>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </main>
    </div>
  );
};

export default HomeAdmin;
