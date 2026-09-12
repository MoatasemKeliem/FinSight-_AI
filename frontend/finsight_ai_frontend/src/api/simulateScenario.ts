import axios from "axios";

const apibase = import.meta.env.VITE_API_URL

export const GetAllScenarios = async () => {
    try {
        const response = await axios.get(`${apibase}/SimulateScenario`, { withCredentials: true });
        return response.data
    } catch (error) {
        console.error("Something went wrong: ", error)
        throw error;
    }
}

export const GetScenarioById = async (id: string) => {
    try {
        const response = await axios.get(`${apibase}/SimulateScenario/${id}`, { withCredentials: true });
        return response.data
    } catch (error) {
        console.error("Something went wrong: ", error)
        throw error;
    }
}


export const DeleteScenarioById = async (id: string) => {
    try {
        const response = await axios.delete(`${apibase}/SimulateScenario/${id}`, { withCredentials: true });
        return response.data
    } catch (error) {
        console.error("Something went wrong: ", error)
        throw error;
    }
}