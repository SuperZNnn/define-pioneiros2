import axios from "axios"
import type { User } from "../types/user"
import { formatCentavos } from "../hooks/useConvert"

const apiPrefix = 'http://localhost:3000'

export let cachedMembers: User[] | null = null
export class ApiRequests {
    static async getAllMembers () {
        if (cachedMembers) return cachedMembers

        const response = await axios.get(`${apiPrefix}/users`, { withCredentials: true })
        const usersData = response.data as User[]
        cachedMembers = usersData
        return usersData
    }

    static async getSession () {
        return await axios.get(`${apiPrefix}/sso/getSession`, { withCredentials: true })    
    }
    static async DestroySession () {
        return await axios.delete(`${apiPrefix}/sso/destroySession`, { withCredentials: true })
            
    } 
}

export class PixEvents {
    static async getTransactions () {
        return await axios.get(`${apiPrefix}/transactions`, { withCredentials: true })
    }
    
    static async sendTo (to: number, amount: number) {
        return await axios.post(`${apiPrefix}/pix/sendTo/${to}`, { amount: formatCentavos(amount) }, { withCredentials: true })
    }
}