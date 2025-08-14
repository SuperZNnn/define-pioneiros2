import axios from "axios";
import { cookies } from "next/headers";
import { apiPrefix } from "./client_consults";
import { DisplayInfo, User } from "@/types/users";
import { redirect } from "next/navigation";

export class ProfileEvents {
    static async getProfileInfo ({profile, byUsername}: { profile: string, byUsername?: boolean }){
        const cookieStore = cookies();
        const sessionCookie =
            (await cookieStore).get('pdaSessionCookie')?.value ?? '';
        try{
            console.log(`${apiPrefix}/user/${profile}${byUsername?'?username=1':''}`)
            const importantData = await axios.get(`${apiPrefix}/user/${profile}${byUsername?'?username=1':''}`, {
                headers: {
                    Cookie: `pdaSessionCookie=${sessionCookie}`,
                },
            })
            const displayData = await axios.get(`${apiPrefix}/user/display/${profile}${byUsername?'?username=1':''}`, {
                headers: {
                    Cookie: `pdaSessionCookie=${sessionCookie}`,
                },
            })
            return { data: importantData.data.user as User, display: displayData.data.user as DisplayInfo }
        }
        catch (err){
            console.error(err)
            redirect('/profile')
        }
    }
}