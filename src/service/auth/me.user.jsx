import { useQuery } from "@tanstack/react-query";
import { endpoint } from "../../utils/endpoint";
import http from "../../utils/http";

// 1. Fungsi fetcher
const fetchUserData = async () => {
  const response = await http.get(endpoint.Me); // Pastikan ini endpoint.Me bukan endpoint.Mw
  return response.data;
};

// 2. Custom Hook
const useGetDataUser = () => {
  return useQuery({
    // queryKey harus berupa array
    queryKey: ["userData"],
    // queryFn adalah fungsi yang mengambil data
    queryFn: fetchUserData,
    // Kamu bisa menambahkan opsi seperti staleTime di sini jika perlu
  });
};

export { fetchUserData, useGetDataUser };
