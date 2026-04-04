import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "http://localhost:3030"
});
export default axiosInstance;