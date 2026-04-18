// import axios from "axios";
// const axiosInstance = axios.create({
//   baseURL: "http://localhost:3030"
// });
// export default axiosInstance;


import axios from "axios";
const apiUrl = mern-rental-parking-system.onrender.com || "";
const axiosInstance = axios.create({
  baseURL: apiUrl.startsWith("http") ? apiUrl : `https://${apiUrl}`
});
export default axiosInstance;
