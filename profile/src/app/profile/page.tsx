import { getServerSession } from '@/lib/getServerSession';
import { redirect } from 'next/navigation';
import { ProfileEvents } from '@/services/server_consults';
import { getIdade } from '@/lib/generators';
import { InitialBrand } from '@/components/InitialBrand';
import { Metadata } from 'next';

async function getSessionUser() {
    const session = await getServerSession();
    if (!session) return { session: null, user: null };

    const user = await ProfileEvents.getProfileInfo({
        profile: `${session.user.userId}`,
    });

    return { session, user };
}

export async function generateMetadata(): Promise<Metadata> {
    const { user } = await getSessionUser();

    if (!user) return { title: 'Usuário não encontrado' };

    return {
        title:
            (user.display.display_name.toUpperCase() ?? user.data.fullname) +
            ' - Edite seu Perfil',
    };
}

export default async function ProfilePage() {
    const { session, user } = await getSessionUser();

    if (!session) redirect('/');
    if (!user) redirect('/not-found');

    const age = getIdade(user.data.nascimento);

    return <InitialBrand user={user} age={age} enableEdit={true} />;
}
