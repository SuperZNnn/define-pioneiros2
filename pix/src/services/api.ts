import axios from "axios"
import type { User } from "../types/user"
import { formatCentavos } from "../hooks/useConvert"

const apiPrefix = 'http://localhost:3000'

export let cachedMembers: User[] | null = null
export class ApiRequests {
    static async getAllMembers () {
        if (cachedMembers) return cachedMembers

        try{
            const response = await axios.get(`${apiPrefix}/users`, { withCredentials: true })
            const usersData = response.data as User[]
            cachedMembers = usersData
            return usersData
        }
        catch (err){
            throw err
        }
    }

    static async getSession () {
        try{
            const response = await axios.get(`${apiPrefix}/sso/getSession`, { withCredentials: true })
            return response
        }
        catch (err){
            throw err
        }
    }
    static async DestroySession () {
        try{
            const response = await axios.delete(`${apiPrefix}/sso/destroySession`, { withCredentials: true })
            return response
        }
        catch (err){
            throw err
        }
    } 
}

export class PixEvents {
    static async getTransactions () {
        try{
            const response = await axios.get(`${apiPrefix}/transactions`, { withCredentials: true })
            return response
        }
        catch(err){
            throw err
        }
    }
    
    static async sendTo (to: number, amount: number) {
        try{
            const response = await axios.post(`${apiPrefix}/pix/sendTo/${to}`, { amount: formatCentavos(amount) }, { withCredentials: true })
            return response
        }
        catch(err){
            throw err
        }
    }
}