import { notFound, redirect } from "next/navigation";

export default async function UsernamePage({ params }: { params: { username: string } }) {
    const { username } = await params;
    const decodedUsername = decodeURIComponent(username);

    if (!decodedUsername.startsWith('@')) notFound();

    const userName = decodedUsername.slice(1);

    redirect(`/profile/${userName}`);
}
