import axios from "axios";
import type { IBusinessDecision } from "../model/businessDecision";

const apibase = import.meta.env.VITE_API_URL

export const GetAllFinancialRecords = async () => {
    try {
        const response = await axios.get(`${apibase}/FinancialRecord`, { withCredentials: true });
        return response.data
    } catch (error) {
        console.error("Something went wrong: ", error)
        throw error;
    }
}

export const GetFinancialRecordById = async (id: string) => {
    try {
        const response = await axios.get(`${apibase}/FinancialRecord/${id}`, { withCredentials: true });
        return response.data
    } catch (error) {
        console.error("Something went wrong: ", error)
        throw error;
    }
}

export const DeleteFinancialRecordById = async (id: string) => {
    try {
        const response = await axios.delete(`${apibase}/FinancialRecord/${id}`, { withCredentials: true });
        return response.data
    } catch (error) {
        console.error("Something went wrong: ", error)
        throw error;
    }
}

export const UpdateFinancialRecordById = async (id: string, payload: IBusinessDecision) => {
    try {
        const response = await axios.patch(`${apibase}/FinancialRecord/${id}`, payload, { withCredentials: true });
        return response.data
    } catch (error) {
        console.error("Something went wrong: ", error)
        throw error;
    }
}

export const CreateFinancialRecord = async (payload: IBusinessDecision) => {
    try {
        const response = await axios.post(`${apibase}/FinancialRecord`, payload, { withCredentials: true });
        return response.data
    } catch (error) {
        console.error("Something went wrong: ", error)
        throw error;
    }
}
