import { getServerSession } from '@/lib/getServerSession';
import { redirect } from 'next/navigation';
import { ProfileEvents } from '@/services/server_consults';
import { getIdade } from '@/lib/generators';
import { InitialBrand } from '@/components/InitialBrand';

export default async function ProfilePage() {
    const session = await getServerSession();
    if (!session) {
        redirect('/');
    }

    const user = await ProfileEvents.getProfileInfo({
        profile: `${session.user.userId}`
    })

    const age = getIdade(user.data.nascimento)

    return <InitialBrand
        user={user}
        age={age}
    />
}
