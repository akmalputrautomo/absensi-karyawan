import React from "react";

const UserTable = ({ users, onDownloadPDF }) => {
  if (users.length === 0) {
    return (
      <div className="bg-[#312d4b] rounded-xl border border-purple-500/20 p-6 sm:p-8 lg:p-12">
        <div className="text-center">
          <div className="text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4 opacity-50">📭</div>
          <h3 className="text-white font-bold text-sm sm:text-base lg:text-lg mb-1 sm:mb-2">Belum Ada Data</h3>
          <p className="text-gray-400 text-xs sm:text-sm">Tidak ada data user yang ditemukan.</p>
          <button onClick={onDownloadPDF} className="mt-3 sm:mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all inline-flex items-center gap-2">
            <span>📥</span>
            Tambah Data
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#312d4b] rounded-xl border border-purple-500/20 overflow-hidden">
      {/* Header dengan tombol PDF - Responsif */}
      <div className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 border-b border-purple-500/20 bg-[#2d2945] flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between items-start sm:items-center">
        <h3 className="text-white font-bold text-sm sm:text-base lg:text-lg flex items-center gap-2">
          <span>📋</span>
          Daftar Karyawan
        </h3>
        <button
          onClick={onDownloadPDF}
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <span>📥</span>
          <span>Download PDF</span>
        </button>
      </div>

      {/* Table dengan horizontal scroll */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] lg:min-w-full">
          <thead>
            <tr className="bg-[#25213b]">
              <th className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider">No</th>
              <th className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider">Karyawan</th>
              <th className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
              <th className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider">Terdaftar</th>
              <th className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-right text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-500/10">
            {users.map((user, index) => (
              <tr key={user._id || index} className="hover:bg-white/5 transition-colors">
                <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-300">{index + 1}</td>
                <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3">
                  <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] sm:text-xs lg:text-sm flex-shrink-0">{user.name?.charAt(0).toUpperCase()}</div>
                    <div className="min-w-0">
                      <p className="text-white text-xs sm:text-sm font-medium truncate max-w-[80px] sm:max-w-[120px] lg:max-w-none">{user.name || "N/A"}</p>
                    </div>
                  </div>
                </td>
                <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3">
                  <span className="text-gray-300 text-xs sm:text-sm truncate block max-w-[100px] sm:max-w-[150px] lg:max-w-none">{user.email || "-"}</span>
                </td>
                <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3">
                  <span className="bg-green-500/10 text-green-400 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-xs font-medium border border-green-500/20 whitespace-nowrap">Aktif</span>
                </td>
                <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3">
                  <span className="text-gray-300 text-[10px] sm:text-xs whitespace-nowrap">{user.createdAt ? new Date(user.createdAt).toLocaleDateString("id-ID") : "-"}</span>
                </td>
                <td className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-right">
                  <div className="flex items-center justify-end gap-1 sm:gap-2">
                    <button className="text-gray-400 hover:text-red-400 transition-colors text-xs sm:text-sm p-1">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {users.length > 0 && (
        <div className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 border-t border-purple-500/20 bg-[#2d2945]">
          <p className="text-gray-400 text-[10px] sm:text-xs">
            Menampilkan <span className="text-white font-semibold">{users.length}</span> data karyawan
          </p>
        </div>
      )}
    </div>
  );
};

export default UserTable;
