import axios from "axios"
import type { User } from "../types/user"

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