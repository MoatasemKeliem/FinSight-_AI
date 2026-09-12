import axios from "axios"

const apibase = import.meta.env.VITE_API_URL

export const GetAllCompanyProfiles = async () => {
    try {
        const response = await axios.get(`${apibase}/CompanyProfile`, { withCredentials: true });
        return response.data
    } catch (error) {
        console.error("Something went wrong: ", error)
        throw error;
    }
}

export const GetCompanyProfileById = async (id: string) => {
    try {
        const response = await axios.get(`${apibase}/CompanyProfile/${id}`, { withCredentials: true });
        return response.data
    } catch (error) {
        console.error("Something went wrong: ", error)
        throw error;
    }
}

export const DeleteCompanyProfileById = async (id: string) => {
    try {
        const response = await axios.delete(`${apibase}/CompanyProfile/${id}`, { withCredentials: true });
        return response.data
    } catch (error) {
        console.error("Something went wrong: ", error)
        throw error;
    }
}

export const CreateCompanyProfile = async (payload: any) => {
    try {
        const response = await axios.post(`${apibase}/CompanyProfile/`, payload, { withCredentials: true });
        return response.data
    } catch (error) {
        console.error("Something went wrong: ", error)
        throw error;
    }
}

export const UpdateCompanyProfileById = async (payload: any, id: string) => {
    try {
        const response = await axios.patch(`${apibase}/CompanyProfile/${id}`, payload, { withCredentials: true });
        return response.data
    } catch (error) {
        console.error("Something went wrong: ", error)
        throw error;
    }
}
