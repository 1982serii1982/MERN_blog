import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

instance.interceptors.request.use((req) => {
  req.headers.Authorization = window.localStorage.getItem("token");
  return req;
});

export default instance;
