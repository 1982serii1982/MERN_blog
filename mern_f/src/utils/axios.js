import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:4444",
});

instance.interceptors.request.use((req) => {
  req.headers.Authorization = window.localStorage.getItem("token");
  return req;
});

export default instance;
