import axios from "axios";
import type { User } from "../types/users";

export const apiPrefix = 'http://localhost:3000'

export let cachedMembers: User[] | null = null

export class ApiRequests {
    static async getAllMembers() {
        if (cachedMembers) return cachedMembers

        const response = await axios.get(`${apiPrefix}/users?wphoto=true`)
        const usersData = response.data as User[]
        cachedMembers = usersData
        return usersData
    }

    static async verifyUrl(url: string) {
        return axios.get(`${apiPrefix}/sso/validateRedirect?redirectUrl=${url}`)
    }

    static async verifyToken(token: string, type: number, name: string) {
        return axios.get(`${apiPrefix}/sso/validateToken/${token}?type=${type}&name=${encodeURIComponent(name)}`)
    }

    static async verifyLogin(login: string) {
        return axios.get(`${apiPrefix}/users/getByLogin/${login}?wphoto=true`)
    }

    static async getDisplay() {
        return axios.get(`${apiPrefix}/user/display`, { withCredentials: true })
    }

    static async createSessionByToken(token: string, name: string) {
        return axios.post(`${apiPrefix}/sso/createSessionByToken/${token}`, { name }, { withCredentials: true })
    }
}

export class UsersEvents {
    static async sendRegisterEmail(userId: number, resp: boolean) {
        return axios.post(`${apiPrefix}/sso/createToken?resp=${resp}`, { userId, type: 1 })
    }

    static async sendResetPasswordEmail(userId: number, resp: boolean) {
        return axios.post(`${apiPrefix}/sso/createToken?resp=${resp}`, { userId, type: 2 })
    }

    static async createAccount(userId: number, login: string, password: string, display_name?: string) {
        return axios.post(`${apiPrefix}/sso/createUser`, { userId, login, password, display_name }, { withCredentials: true })
    }

    static async Login(login: string, password: string) {
        return axios.post(`${apiPrefix}/sso/login`, { login, password }, { withCredentials: true })
    }

    static async resetPassword(token: string, password: string) {
        return axios.put(`${apiPrefix}/sso/resetPassword`, { token, password }, { withCredentials: true })
    }

    static async changeLogin(login: string, userId: number) {
        return axios.put(`${apiPrefix}/sso/changeInfo/${userId}`, { login })
    }

    static async firebaseLogin(firebaseToken: string) {
        return axios.post(`${apiPrefix}/sso/firebaseLogin`, { firebaseToken }, { withCredentials: true })
    }
}
