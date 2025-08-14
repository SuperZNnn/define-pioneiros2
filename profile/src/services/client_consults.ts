import axios from 'axios';

export const apiPrefix = 'http://localhost:3000';

export class SsoEvents {
    static async tryLogin(login: string, password: string) {
        return axios.post(
            `${apiPrefix}/sso/login`,
            { login, password },
            { withCredentials: true },
        );
    }
}