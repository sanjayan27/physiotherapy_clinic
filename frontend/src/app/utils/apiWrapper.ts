import apiCalling from "./Axios";

export async function apiRequest(method : string, url: string, data = null, config = {}) {
  try {
    const response = await apiCalling({
      method,
      url,
      data,
      ...config,
    });
    return response.data; // always return only the useful data
  } catch (error:any) {
    throw error.response?.data || error;
  }
}