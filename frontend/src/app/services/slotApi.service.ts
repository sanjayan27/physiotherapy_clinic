import { apiRequest } from "../utils/apiWrapper";

export const getSlotForSingleDate = async (date: string) => {
  return apiRequest("get", "/slot/by-date", null, {
    params: { date },
  });
};


export const createSlotAdmin =async (formData: any) => {
  return apiRequest(
    "post","/slot" , formData, {withCredentials: true}
  );
}

export const createSlotsBulk = async (payload : any) => {
  return apiRequest("post", "/slot/bulk-update", payload, { withCredentials: true });
}

export const updateSlotAdmin = async(id : string, formData : any)=>{
    return apiRequest(
        "patch", `/slot/${id}`, formData, {withCredentials: true}
    )
}

export const deleteSlotAdmin = async(id : string)=>{
    return apiRequest(
        "delete", `/slot/${id}`, null, {withCredentials: true}
    )
}

export const getUpcomingSlots = async()=>{
  return apiRequest("get","slot/getUpcomingSlots", null, {withCredentials: true})
}