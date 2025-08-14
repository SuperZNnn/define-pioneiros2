import { LoginScreen } from '@/components/Login';
import { getServerSession } from '@/lib/getServerSession';
import { redirect } from 'next/navigation';

export default async function Home() {
    const session = await getServerSession();

    if (session) {
        redirect('/profile');
    }

    return <LoginScreen />;
}
