import toast from "react-hot-toast";

export const AxiosToastError =async(error:any)=>{
    toast.error(error.data.message)
}

export const AxiosToastSuccess = (response:any) =>{
    toast.success(response.data.message)
}