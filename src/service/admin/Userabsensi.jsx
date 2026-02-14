import { useQuery } from "@tanstack/react-query";
import { endpoint } from "../../utils/endpoint";
import http from "../../utils/http";

// 1. Fungsi fetcher
const fetchDataUserAbsensiadmin = async () => {
  const response = await http.get(endpoint.AbsenUser);
  return response.data;
};

// 2. Custom Hook
const useGetDataUseradminabsensi = () => {
  return useQuery({
    // queryKey harus berupa array
    queryKey: ["absensiuseradmin"],
    // queryFn adalah fungsi yang mengambil data
    queryFn: fetchDataUserAbsensiadmin,
    // Kamu bisa menambahkan opsi seperti staleTime di sini jika perlu
  });
};

export { fetchDataUserAbsensiadmin, useGetDataUseradminabsensi };
