import { useQuery } from "@tanstack/react-query";
import { endpoint } from "../../utils/endpoint";
import http from "../../utils/http";

// 1. Fungsi fetcher
const fetchDataUser = async () => {
  const response = await http.get(endpoint.Users);
  return response.data;
};

// 2. Custom Hook
const useGetDataUseradmin = () => {
  return useQuery({
    // queryKey harus berupa array
    queryKey: ["datauseradmin"],
    // queryFn adalah fungsi yang mengambil data
    queryFn: fetchDataUser,
    // Kamu bisa menambahkan opsi seperti staleTime di sini jika perlu
  });
};

export { fetchDataUser, useGetDataUseradmin };
