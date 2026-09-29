import axios from "axios";

const axiosInstance = axios.create({

  baseURL: import.meta.env.VITE_API_URL,

  withCredentials: true,

  headers: {
    "x-admin-key": import.meta.env.VITE_ADMIN_KEY,
  },

});

export default axiosInstance;