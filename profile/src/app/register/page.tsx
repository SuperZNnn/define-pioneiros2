import { RegisterRender } from "@/components/RegisterRender"
import { UsersEvents } from "@/services/server_consults"

export function generateMetadata () {
    return {
        title: 'Registre-se'
    }
}

export default async function RegisterPage () {
    const users = await UsersEvents.getAllMembers()
    
    return (
        <RegisterRender
            users={users}
        />
    )
}