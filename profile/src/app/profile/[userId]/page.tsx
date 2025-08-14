import { InitialBrand } from "@/components/InitialBrand";
import { getIdade } from "@/lib/generators";
import { getServerSession } from "@/lib/getServerSession";
import { ProfileEvents } from "@/services/server_consults";
import { redirect } from "next/navigation";

export default async function ExtProfilePage({ params }: { params: { userId: string } }) {
    const session = await getServerSession();
    if (!session) redirect('/')

    const { userId } = await params

    const user = await ProfileEvents.getProfileInfo({
        profile: userId,
        byUsername: true
    })

    if (user.data.id === session.user.userId) redirect('/profile')

    const age = getIdade(user.data.nascimento)

    return <InitialBrand
        user={user}
        age={age}
    />
}