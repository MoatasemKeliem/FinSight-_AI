import axios from "axios";
import type { IBusinessDecision } from "../model/businessDecision";

const apibase = import.meta.env.VITE_API_URL

export const GetAllBusinessDecisions = async () => {
    try {
        const response = await axios.get(`${apibase}/BusinessDecision`, { withCredentials: true });
        return response.data
    } catch (error) {
        console.error("Something went wrong: ", error)
        throw error;
    }
}

export const GetBusinessDecisionsById = async (id: string) => {
    try {
        const response = await axios.get(`${apibase}/BusinessDecision/${id}`, { withCredentials: true });
        return response.data
    } catch (error) {
        console.error("Something went wrong: ", error)
        throw error;
    }
}


export const CreateBusinessDecision = async (payload: IBusinessDecision) => {
    try {
        const response = await axios.post(`${apibase}/BusinessDecision`, payload, { withCredentials: true });
        return response.data
    } catch (error) {
        console.error("Something went wrong: ", error)
        throw error;
    }
}


export const UpdateBusinessDecisionById = async (id: string, payload: IBusinessDecision) => {
    try {
        const response = await axios.patch(`${apibase}/BusinessDecision/${id}`, payload, { withCredentials: true });
        return response.data
    } catch (error) {
        console.error("Something went wrong: ", error)
        throw error;
    }
}


export const DeleteBusinessDecisionNyId = async (id: string) => {
    try {
        const response = await axios.delete(`${apibase}/BusinessDecision/${id}`, { withCredentials: true });
        return response.data
    } catch (error) {
        console.error("Something went wrong: ", error)
        throw error;
    }
}


