import axios from 'axios'
import summaryApi, { baseUrl } from '../../app/common/summary.api'
const Axios = axios.create({
    baseURL : baseUrl,
    withCredentials : true,
    timeout:5000
})
Axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default Axios