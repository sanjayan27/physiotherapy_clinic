import { apiRequest } from "../utils/apiWrapper";

export const getBilling = async(payload:any)=>{
    return apiRequest("post","/billing",payload,{withCredentials : true})
}