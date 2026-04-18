import axios from "axios"
const apiUrl = import.meta.env.VITE_API_URL || "";
const axiosInstance = axios.create({
  baseURL: apiUrl.startsWith("http") ? apiUrl : `https://${apiUrl}`
});
export default axiosInstance;