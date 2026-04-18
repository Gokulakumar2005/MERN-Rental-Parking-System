// import axios from "axios";
// const axiosInstance = axios.create({
//   baseURL: "http://localhost:3030"
// });
// export default axiosInstance;


import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL || "";
const axiosInstance = axios.create({
  baseURL: apiUrl
});
export default axiosInstance;