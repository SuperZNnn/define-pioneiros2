import axios from "axios"
import type { DisplayInfo, User } from "../types/user"

const apiPrefix = 'http://localhost:3000'

// data:image/jpeg;base64,

export let cachedMembers: User[] | null = null
export let cachedDisplay: DisplayInfo[] | null = null

export const deleteCache = () => {
    cachedDisplay = null
    cachedMembers = null
}
export class ApiRequests {
    static async getAllMembers () {
        if (cachedMembers) return cachedMembers

        try{
            const response = await axios.get(`${apiPrefix}/users?wphoto=true`, { withCredentials: true })
            const usersData = response.data as User[]
            cachedMembers = usersData
            return usersData
        }
        catch (err){
            throw err
        }
    }
    static async getAllMembersDisplay () {
        if (cachedDisplay) return cachedDisplay

        try{
            const response = await axios.get(`${apiPrefix}/users/display`)
            const userData = response.data as { usersDisplay: DisplayInfo[] }
            cachedDisplay = userData.usersDisplay
            return userData.usersDisplay
        }
        catch(err){
            throw err
        }
    }
    static async getMember (id: number){
        try{
            const response = await axios.get(`${apiPrefix}/user/${id}`, { withCredentials: true })
            return response
        }
        catch (err){
            throw err
        }
    }

    static async VerifySession () {
        try{
            const response = await axios.get(`${apiPrefix}/sso/getSession`, { withCredentials: true })
            return response
        }
        catch(err){
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

export class UserEvents {
    static async updateDisplay (userId: number, data: { login?: string, photo?: string, display_name?: string }){
        const formData = new FormData()

        if (data.login) formData.append('login', data.login)
        if (data.display_name) formData.append('display_name', data.display_name)
        if (data.photo){
            try{
                const response = await fetch(data.photo)
                const blob = await response.blob()
                const file = new File([blob], "image.jpg", { type: blob.type })

                formData.append('photo', file)
            }
            catch(err){
                throw err
            }
        }

        try{
            const response = await axios.put(`${apiPrefix}/sso/changeInfo/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            return response
        }
        catch (err){
            throw err
        }
    }

    static async updateInfoData(data: User, userId: number){
        try{
            const response = await axios.put(`${apiPrefix}/users/update/${userId}`, {data}, { withCredentials: true })
            return response
        }
        catch(err){
            throw err
        }
    }

    static async inativeUser (user: number){
        try{
            const response = await axios.put(`${apiPrefix}/users/inativeUser/${user}`, {}, { withCredentials: true })
            return response
        }
        catch(err){
            throw err
        }
    }
    static async reativeUser (user: number){
        try{
            const response = await axios.put(`${apiPrefix}/users/reativeUser/${user}`, {}, { withCredentials: true })
            return response
        }
        catch(err){
            throw err
        }
    }
}

export class SystemEvents{
    static async getAllTokens () {
        try{
            const response = await axios.get(`${apiPrefix}/system/getAllTokens`, { withCredentials: true })
            return response
        }
        catch(err){
            throw err
        }
    }

    static async updateToken (token: string) {
        try{
            const response = await axios.put(`${apiPrefix}/system/add30minutes/${token}`, {}, { withCredentials: true })
            return response
        }
        catch (err){
            throw err
        }
    }

    static async deleteToken (token: string){
        try{
            const response = await axios.delete(`${apiPrefix}/system/token/${token}`, { withCredentials: true })
            return response
        }
        catch(err){
            throw err
        }
    }
}