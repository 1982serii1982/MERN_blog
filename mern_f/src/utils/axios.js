import axios from "axios";

const instance = axios.create({
  //baseURL: "http://localhost:4444",
  baseURL: "api.mern2.sergiucotruta.co.uk",
});

instance.interceptors.request.use((req) => {
  req.headers.Authorization = window.localStorage.getItem("token");
  return req;
});

export default instance;
