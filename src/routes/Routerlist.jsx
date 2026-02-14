import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginKaryawan } from "../pages/auth/LoginKaryawan";
import { RegisterKaryawan } from "../pages/auth/RegisterKaryawan";
import { HomePage } from "../pages/main/HomePage";
import { Protected } from "../assets/component/Protected";
import { HomeAdmin } from "../pages/admin/HomeAdmin";
import { AbsensiUser } from "../pages/admin/AbsensiUser";

export const Routerlist = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Protected>
              <HomePage />
            </Protected>
          }
        />
        <Route path="/login" element={<LoginKaryawan />} />
        <Route path="/register" element={<RegisterKaryawan />} />

        <Route path="/admin" element={<HomeAdmin />} />
        <Route path="/adminabsensi" element={<AbsensiUser />} />
      </Routes>
    </BrowserRouter>
  );
};
