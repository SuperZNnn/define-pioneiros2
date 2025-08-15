import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

export async function generateMetadata({
    params,
}: {
    params: { username: string };
}): Promise<Metadata> {
    const { username } = await params;

    return {
        title: `Perfil de ${decodeURIComponent(username)}`,
    };
}

export default async function UsernamePage({
    params,
}: {
    params: { username: string };
}) {
    const { username } = await params;
    const decodedUsername = decodeURIComponent(username);

    if (!decodedUsername.startsWith('@')) notFound();

    const userName = decodedUsername.slice(1);

    redirect(`/profile/${userName}`);
}
