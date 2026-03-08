import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { CookieKeys, CookieStorage } from "../../../utils/cookies";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    CookieStorage.remove(CookieKeys.AuthToken);
    navigate("/login");
  };

  const menuItems = [
    { path: "/admin", icon: "🏠", label: "Dashboard", exact: true },
    { path: "/adminabsensi", icon: "📊", label: "Data Absensi" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 lg:hidden z-20" onClick={toggleSidebar} />}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-72 bg-gradient-to-b from-[#1e1a2f] to-[#2a2542]
        border-r border-purple-500/20 shadow-2xl
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Logo Area */}
        <div className="h-20 flex items-center px-6 border-b border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Admin Panel</h1>
              <p className="text-gray-400 text-xs">Amaw Absensi</p>
            </div>
          </div>
        </div>

        {/* Profile Summary */}
        <div className="p-6 border-b border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">AD</span>
            </div>
            <div>
              <p className="text-white font-semibold">Admin User</p>
              <p className="text-gray-400 text-sm">admin@amaw.com</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider px-4 mb-3">Menu Utama</p>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl mb-1
                transition-all duration-200 group
                ${isActive ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/20" : "text-gray-400 hover:bg-white/5 hover:text-white"}
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
              {item.label === "Dashboard" && <span className="ml-auto bg-indigo-500/20 text-indigo-300 text-xs px-2 py-1 rounded-full">New</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                     text-red-400 hover:bg-red-500/10 hover:text-red-300
                     transition-all duration-200 group"
          >
            <span className="text-xl">🚪</span>
            <span className="font-medium">Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
