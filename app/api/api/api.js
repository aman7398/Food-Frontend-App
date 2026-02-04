import axios from "axios";

const API = axios.create({
  baseURL: "http://10.11.111.97:5000/api/v1", // change if real device
  timeout: 10000,
});

export default API;
