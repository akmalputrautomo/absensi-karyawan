import React from "react";

const Header = ({ toggleSidebar, title, subtitle }) => {
  return (
    <header className="bg-[#312d4b] rounded-2xl border border-purple-500/20 p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 
                     border border-purple-500/20 flex items-center justify-center
                     text-white text-2xl"
          >
            ☰
          </button>

          <div>
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
          </div>
        </div>

        {/* Stats Cards */}
      </div>
    </header>
  );
};

export default Header;
