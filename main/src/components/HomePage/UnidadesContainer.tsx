import { useEffect, useState } from "react"
import styled from "styled-components"
import type { Unidade, UnidadeMembro } from "../../pages/admPages/UnidadesManager"
import { ApiRequests, UnidadesEvents } from "../../services/api"
import UnidadeBanner from "../UnidadeBanner"
import type { User } from "../../types/user"
import { useNavigate } from "react-router-dom"

const UnidadesContainer = () => {
    const navigate = useNavigate()

    const [unidades, setUnidades] = useState<Unidade[]>()
    const [membrosUnidades, setMembrosUnidades] = useState<UnidadeMembro[]>()
    const [members, setMembers] = useState<User[]>()

    useEffect(() => {
        UnidadesEvents.getAllUnidades()
        .then(res => {
            const resData = res.data as { message: string, unidades: Unidade[], membros: UnidadeMembro[] }
            setUnidades(resData.unidades)
            setMembrosUnidades(resData.membros)
        })
        .catch(err => {
            console.log(err)
        })
        ApiRequests.getAllMembers()
        .then(res => {
            setMembers(res.filter(item=> item.status === 1))
        })
        .catch(err => {
            console.error(err)
        })
    }, [])

    return (
        <UnidadesStyle id="unidades">
            {unidades?.map(item => (
                <UnidadeBanner
                    membros={membrosUnidades??[]}
                    unidade={item}
                    members={members??[]}
                    memberClickEvent={(id: number) => {
                        navigate(`/show/${id}`)
                    }}
                />
            ))}
        </UnidadesStyle>
    )
}
export default UnidadesContainer

const UnidadesStyle = styled.section`

`