import axios from "axios";

const API = axios.create({
  baseURL: "https://ideahub-4-ybrb.onrender.com/api",
});

export default API;