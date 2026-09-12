import axios from "axios"
import type { ILogin, IRegister } from "../model/auth"
axios.defaults.withCredentials = true;
const apibase = import.meta.env.VITE_API_URL


export const register = async (payload: IRegister) => {
    try {
        const response = await axios.post(`${apibase}/auth/register`, payload)
        return response.data;
    } catch (error) {
        console.error("Something went wrong: ", error)
        throw error;
    }
}

export const login = async (payload: ILogin) => {
    try {
        const response = await axios.post(`${apibase}/auth/login`, payload)
        return response.data;
    } catch (error) {
        console.error("Something went wrong: ", error)
        throw error;
    }
}

export const logout = async () => {
    try {
        const response = await axios.post(`${apibase}/auth/logout`)
        console.log("LOGGED OUT", response)
        return response.data;

    } catch (error) {
        console.error("Something went wrong: ", error)
        throw error;
    }
}

export const check = async () => {
    try {
        const response = await axios.get(`${apibase}/auth/check`)
        return response.data;
    } catch (error) {
        console.error("Something went wrong: ", error)
        throw error;
    }
}