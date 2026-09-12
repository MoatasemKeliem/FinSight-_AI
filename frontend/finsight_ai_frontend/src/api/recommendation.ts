import axios from "axios";

const apibase = import.meta.env.VITE_API_URL

export const GetAllRecommendation = async () => {
    try {
        const response = await axios.get(`${apibase}/Recommendation`, { withCredentials: true });
        return response.data
    } catch (error) {
        console.error("Something went wrong: ", error)
        throw error;
    }
}

export const GetRecommendationById = async (id: string) => {
    try {
        const response = await axios.get(`${apibase}/Recommendation/${id}`, { withCredentials: true });
        return response.data
    } catch (error) {
        console.error("Something went wrong: ", error)
        throw error;
    }
}

export const DeleteRecommendationById = async (id: string) => {
    try {
        const response = await axios.delete(`${apibase}/Recommendation/${id}`, { withCredentials: true });
        return response.data
    } catch (error) {
        console.error("Something went wrong: ", error)
        throw error;
    }
}