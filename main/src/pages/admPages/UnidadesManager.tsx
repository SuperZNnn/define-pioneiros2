import { useEffect, useState } from "react"
import styled from "styled-components"
import { useAuth } from "../../hooks/useAuth"
import { ApiRequests, UnidadesEvents } from "../../services/api"
import { AdmFuncs, type User } from "../../types/user"
import { useToasts } from "../../hooks/useToasts"
import { useNavigate } from "react-router-dom"
import UnidadeBanner from "../../components/UnidadeBanner"
import AddUserUnidade from "../../components/AddUserUnidade"
import ModifyUserUnidade from "../../components/ModifyUserUnidade"

export type Unidade = {
    un_id: number,
    name: string,
    photo?: string
}
export type UnidadeMembro = { member_id: number, unidade_cod: number, cargo: string }

const UnidadesManager = () => {
    const { getUser } = useAuth()
    const { addToast } = useToasts()
    const navigate = useNavigate()

    const [users, setUsers] = useState<User[]>()
    const [unidades, setUnidades] = useState<Unidade[]>()
    const [membrosUnidades, setMembrosUnidades] = useState<UnidadeMembro[]>()
    const [userToAdd, setUserToAdd] = useState<User>()
    const [userToModify, setUserToModify] = useState<User>()
    const [noUnidadeUser, setNoUnidadeUser] = useState<User[]>()

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUser()

            ApiRequests.getAllMembers()
            .then(res => {
                const founded = res.find(item => item.id === user)
                if (!AdmFuncs.includes(founded?.funcao??'')){
                    addToast({message: 'Sessão inválida!', time: 3, type: 'error'})
                    navigate('/')
                    return
                }
                else{
                    setUsers(res)
                }
            })
            .catch(() => {
                addToast({message: 'Sessão inválida!', time: 3, type: 'error'})
                navigate('/')
                return
            })
            
            UnidadesEvents.getAllUnidades()
            .then(res => {
                const resData = res.data as { message: string, unidades: Unidade[], membros: UnidadeMembro[] }
                setUnidades(resData.unidades)
                setMembrosUnidades(resData.membros)
            })
            .catch(err => {
                console.log(err)
            })
        }
        fetchUser()
    }, [])
    useEffect(() => {
        setNoUnidadeUser(users?.filter(item=>item.unidade <= 0))
    }, [users])

    return (
        <UnidadesStyle>
            <section className="list">
                <div className="members invert">
                    <div className="column">
                        <p className="simple-text">Membros sem unidade</p>
                    </div>
                    <div className="column"/>
                </div>
                <div className="members-list">
                    {noUnidadeUser?.map(item=>(
                        <div className="members" key={item.id}>
                            <div className="column">
                                <p className="simple-text">{item.fullname}</p>
                            </div>
                            <div className="column">
                                <button className="btn hoverAnim1" style={{ backgroundColor: 'var(--first-color)', color: 'var(--white)' }}
                                    onClick={() => {
                                        setUserToAdd(item)
                                    }}
                                >Adicionar</button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <section className="unidades">
                <div className="heading">
                    <p className="simple-text">Unidades</p>
                </div>
                <div className="un-list">
                    {users && unidades?.map(item=>(
                        <UnidadeBanner
                        key={item.un_id}
                        unidade={item}
                        members={users}
                        memberClickEvent={(id: number) => {
                            const foundUser = users.find(item => item.id === id)
                            setUserToModify(foundUser)
                        }}
                        membros={membrosUnidades??[]}
                        />
                    ))}
                </div>
            </section>
            
            {userToModify?
            <ModifyUserUnidade
                setUserToModify={() => {setUserToModify(undefined)}}
                userToModify={userToModify}
                unidades={unidades??[]}
                setMembrosUnidades={setMembrosUnidades}
            />
            :null}
            
            {userToAdd?
            <AddUserUnidade
                unidades={unidades??[]}
                setUserToAdd={() => {setUserToAdd(undefined)}}
                userToAdd={userToAdd}
                setMembrosUnidades={setMembrosUnidades}
                noUnidadeUser={noUnidadeUser??[]}
                setNoUnidadeUser={setNoUnidadeUser}
            />
            :null}
        </UnidadesStyle>
    )
}
export default UnidadesManager

const UnidadesStyle = styled.main`
    width: 100%;
    min-height: 100vh;
    background-color: var(--white);
    padding: 5vh;
    display: flex;
    gap: 5vh;
    @media (max-width: 1100px){
        flex-direction: column-reverse
    }

    .list{
        width: 30%;
        @media (max-width: 1100px){
            width: 100%
        }
        
        .members-list{
            max-height: 83vh;
            overflow: auto;
        }
    }

    .unidades{
        width: 70%;
        max-height: 90vh;
        @media (max-width: 1100px){
            width: 100%
        }

        .heading{
            padding: 1vh;
            border-left: .3vh solid var(--black);
            border-bottom: .3vh solid var(--black);
            background-color: var(--black);
            color: var(--white);
            height: 6.5vh;
            display: flex;
            align-items: center;
        }
    }

    .members{
        display: flex;

        &.invert{
            background-color: var(--black);
            color: var(--white);
            padding: 1vh;
        }
        &:not(.invert){
            p{
                color: var(--black);
                cursor: pointer;

                &:hover{
                    text-decoration: underline
                }
            }

            .column{
                height: 6.5vh;
            }
        }
        .column{
            padding: 1vh;
            border-left: .3vh solid var(--black);
            border-bottom: .3vh solid var(--black);

            &:nth-child(1){
                width: 65%;
            }
            &:nth-child(2){
                width: 35%;
                border-right: .3vh solid var(--black);

                button{
                    position: relative;
                    left: 50%;
                    transform: translate(-50%);
                }
            }
        }
    }
`