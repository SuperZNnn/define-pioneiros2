import axios from "axios";
import type { User } from "../types/users";

export const apiPrefix = 'http://localhost:3000'

// data:image/jpeg;base64,

export let cachedMembers: User[] | null = null
export class ApiRequests {
    static async getAllMembers () {
        if (cachedMembers){
            return cachedMembers
        }

        try{
            const response = await axios.get(`${apiPrefix}/users?wphoto=true`)
            const usersData = response.data as User[]
            cachedMembers = usersData
            return usersData
        }
        catch (err) {
            throw err
        }
    }

    static async verifyUrl (url: string) {
        try{
            const response = await axios.get(`${apiPrefix}/sso/validateRedirect?redirectUrl=${url}`)
            return response
        }
        catch (err){
            throw err
        }
    }

    static async verifyToken (token: string, type: number, name: string){
        try{
            const response = await axios.get(`${apiPrefix}/sso/validateToken/${token}?type=${type}&name=${encodeURIComponent(name)}`)
            return response
        }
        catch (err){
            throw err
        }
    }

    static async verifyLogin (login: string) {
        try{
            const response = await axios.get(`${apiPrefix}/users/getByLogin/${login}?wphoto=true`)
            return response
        }
        catch (err){
            throw err
        }
    }
}

export class UsersEvents {
    static async sendRegisterEmail (userId: number, resp: boolean) {
        try{
            const response = await axios.post(`${apiPrefix}/sso/createToken?resp=${resp}`, {userId, type: 1})
            return response
        }
        catch (err){
            throw err
        }
    }
    static async sendResetPasswordEmail (userId: number, resp: boolean){
        try{
            const response = await axios.post(`${apiPrefix}/sso/createToken?resp=${resp}`, {userId, type: 2})
            return response
        }
        catch (err){
            throw err
        }
    }

    static async createAccount (userId: number, login: string, password: string, display_name?: string) {
        try{
            const response = await axios.post(`${apiPrefix}/sso/createUser`, { userId, login, password, display_name }, { withCredentials: true })
            return response
        }
        catch (err){
            throw err
        }
    }

    static async Login (login: string, password: string) {
        try {
            const response = await axios.post(`${apiPrefix}/sso/login`, { login, password }, { withCredentials: true })
            return response
        }
        catch (err){
            throw err
        }
    }

    static async resetPassword (token: string, password: string){
        try{
            const response = await axios.put(`${apiPrefix}/sso/resetPassword`, { token, password }, { withCredentials: true })
            return response
        }
        catch (err){
            throw err
        }
    }
    static async changeLogin (login: string, userId: number){
        try{
            const response = await axios.put(`${apiPrefix}/sso/changeInfo/${userId}`, { login })
            return response
        }
        catch (err){
            throw err
        }
    }

    static async firebaseLogin (firebaseToken: string){
        try{
            const response = await axios.post(`${apiPrefix}/sso/firebaseLogin`, { firebaseToken }, { withCredentials: true })
            return response
        }
        catch (err){
            throw err
        }
    }
}