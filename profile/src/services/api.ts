import axios from 'axios'

const apiPrefix = 'http://localhost:3000'

export class SsoEvents {
    static async verifySession () {
        return axios.get(`${apiPrefix}/sso/getSession`, { withCredentials: true })
    }
    static async tryLogin (login: string, password: string){
        return axios.post(`${apiPrefix}/sso/login`, { login, password }, { withCredentials: true })
    }
}