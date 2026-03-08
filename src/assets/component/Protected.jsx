// Protected.js - Dengan pengecekan path
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { CookieKeys, CookieStorage } from "../../utils/cookies";
import { useGetDataUser } from "../../service/auth/me.user";

export const Protected = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: userData, isLoading } = useGetDataUser();
  const user = userData?.data?.user;

  useEffect(() => {
    const token = CookieStorage.get(CookieKeys.AuthToken);

    if (!token) {
      toast.error("Anda harus login terlebih dahulu", { id: "login-error" });
      navigate("/login");
      return;
    }

    if (user) {
      // Jika di halaman admin tapi bukan admin
      if (location.pathname.startsWith("/admin") && user.is_admin !== true) {
        // toast.error("Akses ditolak");
        navigate("/");
      }

      // Jika di halaman user biasa tapi admin
      if (!location.pathname.startsWith("/admin") && user.is_admin === true) {
        navigate("/admin");
      }
    }
  }, [navigate, user, location]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return children;
};
