import toast from "react-hot-toast";
import { endpoint } from "../../utils/endpoint";
import http from "../../utils/http";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

// 1. Fungsi API cukup ambil data & return. Jangan handle toast/navigasi di sini.
const RegisterUser = async (input) => {
  const response = await http.post(endpoint.Register, input);
  return response.data;
};

const UseCreateUser = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: RegisterUser,
    // 2. Handle SUKSES di sini
    onSuccess: () => {
      toast.success("Register Berhasil!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    },
    // 3. Handle ERROR di sini
    onError: (error) => {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 409) {
        toast.error("Email ini sudah digunakan!");
      } else if (status === 400) {
        toast.error(message || "Email sudah terdaftar");
      } else {
        toast.error("Terjadi kesalahan pada server");
      }
    },
  });
};

export { RegisterUser, UseCreateUser };
