import axios from "axios"
import type { DisplayInfo, User } from "../types/user"

const apiPrefix = 'http://localhost:3000'

export let cachedMembers: User[] | null = null
export let cachedDisplay: DisplayInfo[] | null = null

export const deleteCache = () => {
    cachedDisplay = null
    cachedMembers = null
}

export const setInternal = (userId: number, info: User) => {
    const foundedIndex = cachedMembers?.findIndex(user => user.id === userId)

    if (foundedIndex === undefined || foundedIndex < 0 || !cachedMembers) return

    cachedMembers[foundedIndex] = {
        ...cachedMembers[foundedIndex],
        cpf: info.cpf,
        email: info.email,
        email_responsavel: info.responsavel,
        fullname: info.fullname,
        funcao: info.funcao,
        pai: info.mae,
        responsavel: info.responsavel,
        nascimento: info.nascimento,
        telefone: info.telefone,
        telefone_responsavel: info.telefone_responsavel
    }
}

export class ApiRequests {
    static async getAllMembers() {
        if (cachedMembers) return cachedMembers

        const response = await axios.get(`${apiPrefix}/users?wphoto=true`, { withCredentials: true })
        const usersData = response.data as User[]
        cachedMembers = usersData
        return usersData
    }

    static async getAllMembersDisplay() {
        if (cachedDisplay) return cachedDisplay

        const response = await axios.get(`${apiPrefix}/users/display`)
        const userData = response.data as { usersDisplay: DisplayInfo[] }
        cachedDisplay = userData.usersDisplay
        return userData.usersDisplay
    }

    static async getMember(id: number) {
        return axios.get(`${apiPrefix}/user/${id}`, { withCredentials: true })
    }

    static async VerifySession() {
        return axios.get(`${apiPrefix}/sso/getSession`, { withCredentials: true })
    }

    static async DestroySession() {
        return axios.delete(`${apiPrefix}/sso/destroySession`, { withCredentials: true })
    }

    static async fetchCep(cep: string) {
        const numbercep = parseInt(cep.replace(/\D/g, ""))
        
        return axios.get(`https://viacep.com.br/ws/${numbercep}/json`)
    }
}

export class UserEvents {
    static async updateDisplay(userId: number, data: { login?: string, photo?: string, display_name?: string }) {
        const formData = new FormData()

        if (data.login) formData.append('login', data.login)
        if (data.display_name) formData.append('display_name', data.display_name)
        if (data.photo) {
            const response = await fetch(data.photo)
            const blob = await response.blob()
            const file = new File([blob], "image.jpg", { type: blob.type })
            formData.append('photo', file)
        }

        return axios.put(`${apiPrefix}/sso/changeInfo/${userId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    }

    static async updateInfoData(data: User, userId: number) {
        return axios.put(`${apiPrefix}/users/update/${userId}`, { data }, { withCredentials: true })
    }

    static async inativeUser(user: number) {
        return axios.put(`${apiPrefix}/users/inativeUser/${user}`, {}, { withCredentials: true })
    }

    static async reativeUser(user: number) {
        return axios.put(`${apiPrefix}/users/reativeUser/${user}`, {}, { withCredentials: true })
    }
}

export class SystemEvents {
    static async getAllTokens() {
        return axios.get(`${apiPrefix}/system/getAllTokens`, { withCredentials: true })
    }

    static async updateToken(token: string) {
        return axios.put(`${apiPrefix}/system/add30minutes/${token}`, {}, { withCredentials: true })
    }

    static async deleteToken(token: string) {
        return axios.delete(`${apiPrefix}/system/token/${token}`, { withCredentials: true })
    }
}

export class PixEvents {
    static async getAllTransactions () {
        return axios.get(`${apiPrefix}/transactions/all`, { withCredentials: true })
    }

    static async systemAdd (from: number, to: number, amount: string) {
        return axios.post(`${apiPrefix}/pix/systemAdd`, { from, to, amount, system: 1 }, { withCredentials: true })
    }
    static async systemRemove (from: number, to: number, amount: string) {
        return axios.post(`${apiPrefix}/pix/systemRemove`, { from, to, amount, system: 2 }, { withCredentials: true })
    }
}

export class UnidadesEvents {
    static async getAllUnidades (){
        return axios.get(`${apiPrefix}/unidades`)
    }

    static async update (userId: number, unidade: number|null, cargo: string|null){
        return axios.put(`${apiPrefix}/member/${userId}`, { unidade, cargo }, { withCredentials: true })
    }

    static async setNew (userId: number, unidade: number, cargo: string){
        return axios.post(`${apiPrefix}/member/${userId}`, { unidade, cargo }, { withCredentials: true })
    }
}