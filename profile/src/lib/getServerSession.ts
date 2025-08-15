import { apiPrefix } from '@/services/client_consults';
import { SessionReturn } from '@/types/users';
import axios from 'axios';
import { cookies } from 'next/headers';

export const getServerSession = async () => {
    const cookieStore = cookies();
    const sessionCookie =
        (await cookieStore).get('pdaSessionCookie')?.value ?? '';

    try {
        const res = await axios.get(`${apiPrefix}/sso/getSession`, {
            headers: {
                Cookie: `pdaSessionCookie=${sessionCookie}`,
            },
        });
        return res.status === 200
            ? (res.data as { message: string; user: SessionReturn })
            : null;
    } catch {
        return null;
    }
};
