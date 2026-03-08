import http from "../../utils/http";
import toast from "react-hot-toast";
import { endpoint } from "../../utils/endpoint";
import { useMutation } from "@tanstack/react-query";

const AbsenUser = async (input) => {
  const response = await http.post(endpoint.Absen, input);
  return response.data;
};

// Di service (UseAbsenUser.js)
const UseAbsenUser = () => {
  return useMutation({
    mutationFn: AbsenUser,
    onSuccess: () => {
      toast.success("Berhasil Absen!"); // <-- HANYA 1 TOAST
    },
    onError: (error) => {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 400) {
        toast.error(message || "Anda sudah absen hari ini"); // <-- HANYA 1 TOAST
      }
    },
  });
};

export { UseAbsenUser, AbsenUser };
