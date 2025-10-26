import { apiRequest } from "../utils/apiWrapper";

// Get live status
export const getLiveStatus = (date: string) => {
  return apiRequest("get", "/patient-details/live-status", null, {
    params: { date: date || new Date().toISOString().split("T")[0] },
  });
};

export const bookAppointment = (formData: any) => {
  return apiRequest("post", "/patient-details", formData, {
    withCredentials: true,
  });
};

export const getUserDetails = () => {
  return apiRequest("get", "/user/me", null, { withCredentials: true });
};

export const getAppointmentData = async (id: string) => {
  return apiRequest("get", `/patient-details/${id}`, null, {
    withCredentials: true,
  });
};

export const updateUserDetails =async(formData : any, id:string)=>{
  return apiRequest("patch", `/user/${id}`, formData, {
    withCredentials: true,
  });

}

export const cancelBooking =async(id:string)=>{
  return apiRequest("delete", `/patient-details/cancel/${id}`, null, {
    withCredentials: true,
  });

}