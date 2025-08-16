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
export class ImageEvents {
    static async updateImages({ profile, banner, userId }: { profile?: string, banner?: string, userId: number }){
        const formData = new FormData()

        if (profile){
            const response = await fetch(profile)
            const blob = await response.blob()
            const file = new File([blob], "image.jpg", { type: blob.type })
            formData.append('photo', file)
        }
        if (banner){
            const response = await fetch(banner)
            const blob = await response.blob()
            const file = new File([blob], "image.jpg", { type: blob.type })
            formData.append('banner', file)
        }

        return axios.put(`${apiPrefix}/sso/changeInfo/${userId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true
        })
    }
}

export class UsersEvents {
    static async sendRegisterEmail(userId: number, resp: boolean) {
        return axios.post(`${apiPrefix}/sso/createToken?resp=${resp}`, {
            userId,
            type: 1,
        });
    }

    static async sendResetPasswordEmail(userId: number, resp: boolean) {
        return axios.post(`${apiPrefix}/sso/createToken?resp=${resp}`, {
            userId,
            type: 2,
        });
    }
}