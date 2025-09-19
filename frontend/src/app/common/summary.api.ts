export const baseUrl = "http://localhost:3001/";

const summaryApi = {
  register: {
    endpoint: "/user/",
    method: "post",
  },
  login: {
    endpoint: "/auth/login",
    method: "post",
  },
  request_otp: {
    endpoint: "/auth/request-otp",
    method: "post",
  },
  otpVerification: {
    endpoint: "/api/user/verify-otp",
    method: "put",
  },
  bookAppointment: {
    endpoint: "/patient-details",
    method: "post",
  },
  getUserDetails: {
    endpoint: "/user/me",
    method: "get",
  },
  logout: {
    endpoint: "/auth/logout",
    method: "post",
  },
  getAppointmentData: {
    endpoint: "/patient-details/",
    method: "get",
  },
  getAdminAppointments: {
    endpoint: "/patient-details/admin",
    method: "get",
  },
  getAllAppointments: {
    endpoint: "/patient-details",
    method: "get",
  },
  getSlotForSingleDate: {
    endpoint: "/slot/by-date",
    method: "get",
  },
  createSlotAdmin: {
    endpoint: "/slot",
    method: "post",
  },
  deleteSlotAdmin: {
    endpoint: "/slot",
    method: "delete",
  },
  updateSlotAdmin: {
    endpoint: "/slot",
    method: "patch",
  },
  getBilling:{
    endpoint: "/billing",
    method: "post"
  },
  updatePatientPayment: {
    endpoint: "/patient-details/admin",
    method: "patch",
  }
};

export default summaryApi;
