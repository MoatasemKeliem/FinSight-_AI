import axios from "axios";

const apibase = import.meta.env.VITE_API_URL;

export const downloadDocument = async () => {
    try {
        const response = await axios.get(`${apibase}/report/download-summary`,
            { withCredentials: true, responseType: "blob" });
        return response.data
    } catch (error) {
        console.error("Something went wrong: ", error)
        throw error;
    }
}

