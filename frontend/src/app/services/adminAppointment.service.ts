import { apiRequest } from "../utils/apiWrapper";

export const getAdminAppointments = async(date: string)=>{
    return apiRequest("get","/patient-details/admin", null, {params : {date}})
}

export const getAllAppointments = async ()=>{
    return apiRequest('get',"/patient-details/all" , null , {withCredentials : true})
}

export const updatePatientPayment = async(id:string, payload:any)=>{
    return apiRequest("patch",`/patient-details/admin/${id}`,payload,{withCredentials : true})
}

export const listAllUser = async()=>{
    return apiRequest('get','/user/all',null, {withCredentials:true})
}