console.log("STEP 1");

import axios from "axios";

console.log("STEP 2");

console.log(import.meta.env);

console.log(
  "VITE_API_URL =",
  import.meta.env.VITE_API_URL
);

// throw new Error("STOP HERE");
// import axios from "axios";
// throw new Error("AXIOS FILE LOADED");

console.log(
  "VITE_API_URL =",
  import.meta.env.VITE_API_URL
);

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

console.log(
  "Axios Base URL =",
  axiosInstance.defaults.baseURL
);

export default axiosInstance;