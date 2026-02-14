import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { CookieKeys, CookieStorage } from "../../utils/cookies";

export const Protected = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = CookieStorage.get(CookieKeys.AuthToken);
    if (!token) {
      // Tambahkan { id: "login-error" } agar toast tidak duplikat
      toast.error("Anda harus login terlebih dahulu", { id: "login-error" });
      navigate("/login");
    }
  }, [navigate]);

  return children;
};
