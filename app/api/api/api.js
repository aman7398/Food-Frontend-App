import axios from "axios";
import { BASE_URL } from "../lib";

const API = axios.create({
  baseURL: BASE_URL, // change if real device
  timeout: 10000,
});

export default API;
