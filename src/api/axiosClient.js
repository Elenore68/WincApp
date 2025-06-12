// axiosClient.js
import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
});

// Apply token to headers
const applyToken = () => {
  const token = localStorage.getItem("idToken");
  if (token) {
    axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosClient.defaults.headers.common["Authorization"];
  }
};

// Immediately apply token on first load
applyToken();

export { applyToken };
export default axiosClient;
