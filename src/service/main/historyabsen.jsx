import { useQuery } from "@tanstack/react-query";
import { endpoint } from "../../utils/endpoint";
import http from "../../utils/http";

// 1. Fungsi fetcher
const fetchHistory = async () => {
  const response = await http.get(endpoint.History);
  return response.data;
};

// 2. Custom Hook
const useGetDataHistory = () => {
  return useQuery({
    // queryKey harus berupa array
    queryKey: ["DataHistory"],
    queryFn: fetchHistory,
  });
};

export { useGetDataHistory, fetchHistory };
