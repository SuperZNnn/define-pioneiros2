import axios from "axios"

const apiPrefix = 'http://localhost:3000'

export class ApiRequests {
    static async getSession () {
        try{
            const response = await axios.get(`${apiPrefix}/sso/getSession`, { withCredentials: true })
            return response
        }
        catch (err){
            throw err
        }
    }
}