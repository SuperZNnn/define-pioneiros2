import { InitialBrand } from '@/components/InitialBrand';
import { getIdade } from '@/lib/generators';
import { getServerSession } from '@/lib/getServerSession';
import { ProfileEvents } from '@/services/server_consults';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

async function getUserData(userId: string) {
    const session = await getServerSession();

    const user = await ProfileEvents.getProfileInfo({
        profile: userId,
        byUsername: true,
    });

    return { session, user };
}

export async function generateMetadata({
    params,
}: {
    params: { userId: string };
}): Promise<Metadata> {
    const resolvedParams = await params;
    const { userId } = resolvedParams;

    const { user } = await getUserData(userId);

    if (!user) return { title: 'Usuário não encontrado' };

    return {
        title:
            'Perfil de ' +
            (user.display?.display_name.toUpperCase() ?? user.data.fullname),
    };
}

export default async function ExtProfilePage({
    params,
}: {
    params: { userId: string };
}) {
    const resolvedParams = await params;
    const { userId } = resolvedParams;

    const { session, user } = await getUserData(userId);

    if (!user) redirect('/not-found');

    if (user.data?.id === session?.user.userId)
        redirect('/profile');

    const age = getIdade(user.data.nascimento);

    return <InitialBrand user={user} age={age} />;
}
