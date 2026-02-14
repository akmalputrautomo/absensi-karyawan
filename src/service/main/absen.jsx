import http from "../../utils/http";
import toast from "react-hot-toast";
import { endpoint } from "../../utils/endpoint";
import { useMutation } from "@tanstack/react-query";

const AbsenUser = async (input) => {
  const response = await http.post(endpoint.Absen, input);
  return response.data;
};

const UseAbsenUser = () => {
  return useMutation({
    mutationFn: AbsenUser,
    // 2. Handle SUKSES di sini
    onSuccess: () => {
      toast.success("Berhasil Absen!");
    },
    // 3. Handle ERROR di sini
    onError: (error) => {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 401) {
        toast.error("");
      } else if (status === 400) {
        toast.error(message || "anda sudah absen ");
      }
    },
  });
};

export { UseAbsenUser, AbsenUser };
