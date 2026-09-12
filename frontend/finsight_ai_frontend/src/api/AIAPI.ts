import axios from "axios";
import type { IPredict, IRAG, ISimulate } from "../model/AIModel";

const apibase = import.meta.env.VITE_API_URL

export const AIRAG = async (payload: IRAG) => {
    try {
        const response = await axios.post(`${apibase}/AI/chat`, payload, { withCredentials: true });
        return response.data
    } catch (error) {
        console.error("Something went wrong: ", error)
        throw error;
    }
}


export const AIAnalyze = async () => {
    try {
        const response = await axios.post(`${apibase}/AI/analyze`, { withCredentials: true });
        return response.data
    } catch (error) {
        console.error("Something went wrong: ", error)
        throw error;
    }
}


export const AIPrediction = async (payload: IPredict) => {
    try {
        const response = await axios.post(`${apibase}/AI/predict`, payload, { withCredentials: true });
        return response.data
    } catch (error) {
        console.error("Something went wrong: ", error)
        throw error;
    }
}


export const AIRecommendation = async (payload: IPredict) => {
    try {
        const response = await axios.post(`${apibase}/AI/recommendation`, payload, { withCredentials: true });
        return response.data
    } catch (error) {
        console.error("Something went wrong: ", error)
        throw error;
    }
}


export const AISimulateScenario = async (payload: ISimulate) => {
    try {
        const response = await axios.post(`${apibase}/AI/simulate`, payload, { withCredentials: true });
        return response.data
    } catch (error) {
        console.error("Something went wrong: ", error)
        throw error;
    }
}