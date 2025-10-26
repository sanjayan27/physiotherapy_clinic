import axios from 'axios'
import { getPublicEnv } from './runtimeEnv'
const baseUrl = process.env.NEXT_PUBLIC_API_URL
const Axios = axios.create({
    baseURL : baseUrl,
    withCredentials : true,
    timeout:25000
})

Axios.interceptors.request.use((config) => {
  // Resolve baseURL at request time to ensure runtime env is available
  const runtimeBaseUrl = getPublicEnv('NEXT_PUBLIC_BACKEND_API_URL', 'http://localhost:5000')
  if (!config.baseURL) {
    config.baseURL = runtimeBaseUrl
    if (typeof console !== 'undefined') {
      console.info('[Axios] Using baseURL:', runtimeBaseUrl)
    }
  }

  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config;
});
Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Session expired
      localStorage.removeItem("isLogin");
      localStorage.removeItem("user");
      window.location.href = "/login"; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default Axios