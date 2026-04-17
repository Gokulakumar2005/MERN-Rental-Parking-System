// import axios from "axios";
// const axiosInstance = axios.create({
//   baseURL: "http://localhost:3030"
// });
// export default axiosInstance;


import axios from "axios";
const axiosInstance = axios.create({
  baseURL: import .meta.env.VITE_API_URL 
});
export default axiosInstance;