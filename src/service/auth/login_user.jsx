// import { useNavigate } from "react-router-dom";
import { endpoint } from "../../utils/endpoint";
import http from "../../utils/http";
import { useMutation } from "@tanstack/react-query";
import { CookieKeys, CookieStorage } from "../../utils/cookies";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// 1. Fungsi API cukup ambil data & return. Jangan handle toast/navigasi di sini.
const LoginUser = async (input) => {
  const response = await http.post(endpoint.Login, input);
  return response.data;
};

const UseLoginUser = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: LoginUser,
    // 2. Handle SUKSES di sini
    onSuccess: (result) => {
      CookieStorage.set(CookieKeys.AuthToken, result.data.token);
      toast.success("Login Berhasil!");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    },
    // 3. Handle ERROR di sini
    onError: (error) => {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 401) {
        toast.error("Email atau password salah");
      } else if (status === 400) {
        toast.error(message || "email dan password wajib di email ");
      }
    },
  });
};

export { LoginUser, UseLoginUser };
