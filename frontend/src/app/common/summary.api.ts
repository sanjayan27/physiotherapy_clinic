export const baseUrl = "https://clinic-appointment-booking-backend.onrender.com/";

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
  },
  verifyJwtToken: {
    endpoint: "/auth/verify-token",
    method: "get",
  },
  updateUserDetails:{
    endpoint: "/user",
    method: "patch",
   },
   cancelBooking:{
    endpoint: "/patient-details/cancel/",
    method: "delete"
   }

};

export default summaryApi;
