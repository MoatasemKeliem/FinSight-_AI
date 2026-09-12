import axios from "axios";

const apibase = import.meta.env.VITE_API_URL

export const GetAllDocuments = async () => {
    try {
        const response = await axios.get(`${apibase}/UploadDocument`, { withCredentials: true });
        return response.data
    } catch (error) {
        console.error("Something went wrong: ", error)
        throw error;
    }
}

export const GetDocumentById = async (id: string) => {
    try {
        const response = await axios.get(`${apibase}/UploadDocument/${id}`, { withCredentials: true });
        return response.data
    } catch (error) {
        console.error("Something went wrong: ", error)
        throw error;
    }
}


export const DeleteDocumentById = async (id: string) => {
    try {
        const response = await axios.delete(`${apibase}/UploadDocument/${id}`, { withCredentials: true });
        return response.data
    } catch (error) {
        console.error("Something went wrong: ", error)
        throw error;
    }
}


export const CreateDocumentById = async (file: File) => {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post(`${apibase}/UploadDocument`, formData,
            {
                withCredentials: true,
                headers:
                    { "Content-Type": "multipart/form-data" }
            });
        return response.data
    } catch (error) {
        console.error("Something went wrong: ", error)
        throw error;
    }
}

