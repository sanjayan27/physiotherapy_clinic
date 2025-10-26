import { apiRequest } from "../utils/apiWrapper";

export const register = async(payload: any) => {
  return apiRequest("post", "/user/", payload);
}

export const login = async (payload: any) => {
  return apiRequest("post", "/auth/login/", payload, { withCredentials: true });
};

export const logout = async () => {
  return apiRequest("post", "/auth/logout", null, { withCredentials: true });
};
export const requestOtp = async (payload: any) => {
  return apiRequest("post", "/auth/request-otp", payload, {
    withCredentials: true,
  });
}
