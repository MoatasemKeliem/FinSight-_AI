import axios from "axios";

const apibase = import.meta.env.VITE_API_URL

export const GetAllRiskAnalyses = async () => {
    try {
        const response = await axios.get(`${apibase}/Analysis`, { withCredentials: true });
        return response.data
    } catch (error) {
        console.error("Something went wrong: ", error)
        throw error;
    }
}

export const GetRiskAnalysisById = async (id: string) => {
    try {
        const response = await axios.get(`${apibase}/Analysis/${id}`, { withCredentials: true });
        return response.data
    } catch (error) {
        console.error("Something went wrong: ", error)
        throw error;
    }
}

export const DeleteRiskAnalysisById = async (id: string) => {
    try {
        const response = await axios.delete(`${apibase}/Analysis/${id}`, { withCredentials: true });
        return response.data
    } catch (error) {
        console.error("Something went wrong: ", error)
        throw error;
    }
}