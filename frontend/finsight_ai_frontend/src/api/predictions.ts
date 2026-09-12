import axios from "axios";

const apibase = import.meta.env.VITE_API_URL

export const GetAllPredictions = async () => {
    try {
        const response = await axios.get(`${apibase}/Prediction`, { withCredentials: true });
        return response.data
    } catch (error) {
        console.error("Something went wrong: ", error)
        throw error;
    }
}

export const GetPredictionById = async (id: string) => {
    try {
        const response = await axios.get(`${apibase}/Prediction/${id}`, { withCredentials: true });
        return response.data
    } catch (error) {
        console.error("Something went wrong: ", error)
        throw error;
    }
}


export const DeletePredictionById = async (id: string) => {
    try {
        const response = await axios.delete(`${apibase}/Prediction/${id}`, { withCredentials: true });
        return response.data
    } catch (error) {
        console.error("Something went wrong: ", error)
        throw error;
    }
}
