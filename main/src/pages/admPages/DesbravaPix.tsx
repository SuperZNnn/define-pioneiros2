import { useEffect, useState } from "react"
import styled from "styled-components"
import { useAuth } from "../../hooks/useAuth"
import { ApiRequests, PixEvents } from "../../services/api"
import { AdmFuncs, type User } from "../../types/user"
import { useNavigate } from "react-router-dom"
import { useToasts } from "../../hooks/useToasts"
import Selector from "../../components/Selector"
import PixList from "../../components/PixManager/Pixlist"
import ValueInput from "../../components/ValueInput"
import { convertToBRL, formatCentavos } from "../../hooks/useConvert"

type Transaction = {
    transaction_id: number,
    from: number,
    to: number,
    value: string,
    from_system?: number
}

const DesbravaPixPage = () => {
    const { getUser } = useAuth()
    const navigate = useNavigate()
    const { addToast } = useToasts()

    const [users, setUsers] = useState<User[]>()
    const [transactions, setTransactions] = useState<Transaction[]>()
    
    const [value, setValue] = useState<number>()
    const [modUser, setModUser] = useState<number>()
    const [userMod, setUserMod] = useState<User>()

    useEffect(() => {
        const founduser = users?.find(item => item.id === modUser)
        setUserMod(founduser)
    }, [modUser, users])

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
        }
        fetchUser()

        PixEvents.getAllTransactions()
        .then(res=> {
            const resData = res.data.transactions as Transaction[]
            setTransactions(resData)
        })
        .catch(err => {
            console.log(err)
        })
    }, [])

    return (
        <DesbravaPixStyle>
            <section className="container" style={{ height: '90vh', overflow: 'auto' }}>
                <h2 className="main-title">Histórico de Pix</h2>
                <table width='100%'>
                    <section className="members-row invert">
                        <div className="column">
                            <p className="simple-text">De</p>
                        </div>
                        <div className="column">
                            <p className="simple-text">Para</p>
                        </div>
                        <div className="column">
                            <p className="simple-text">Valor</p>
                        </div>
                    </section>
                    {transactions?.map(item => {                        
                        return (
                            <PixList
                                key={item.transaction_id}
                                users={users??[]}
                                to={item.to}
                                from={item.from}
                                value={item.value}
                                fromSystem={item.from_system}
                            />
                        )
                    })} 
                </table>
            </section>

            <section className="container">
                <h2 className="main-title">Definir pix</h2>
                <Selector
                    customAsk="Quem você deseja modificar o pix?"
                    all={true}
                    users={users??[]}
                    setSelectedUser={(id: number) => {
                        setModUser(id)
                    }}
                />

                {userMod?<div className="pix-actions" style={{ marginTop: '2vh' }}>
                    <h4 className="second-title">Quantia atual de {userMod?.fullname}:</h4>
                    <h3 className="second-title">{convertToBRL(userMod?.pix??'')}</h3>

                    <div className="flex-container" style={{ gap: '2vh' }}>
                        <ValueInput
                            onValueChange={(value: number) => {
                                setValue(value)
                            }}
                        />
                        <button className="btn hoverAnim1" style={{ color: 'var(--white)', backgroundColor: 'var(--first-color)' }}
                            onClick={()=>{
                                const foundDiretor = users?.find(item=> ['Diretor', 'Diretora'].includes(item.funcao))
                                if (!value || value <= 0) {
                                    addToast({message: 'Insira um valor', type: 'warn', time: 3})
                                    return
                                }

                                PixEvents.systemAdd(foundDiretor!.id, modUser??1, formatCentavos(value??0))
                                .then(res => {
                                    if (res.status === 200){
                                        setTransactions([
                                            ...transactions??[],
                                            {
                                                transaction_id: (transactions?.length??0) +1,
                                                from: foundDiretor!.id,
                                                to: modUser??1,
                                                from_system: 1,
                                                value: formatCentavos(value??0)
                                            }
                                        ])
                                        setUsers(prev=>
                                            prev?.map(user =>
                                                user.id === modUser?{
                                                    ...user,
                                                    pix: String((parseFloat(user.pix||'0')||0) + (parseFloat(formatCentavos(value??0).replace(',','.'))))
                                                }
                                                : user
                                            )
                                        )
                                    }
                                })
                                .catch(err => {
                                    console.log(err)
                                })
                            }}
                        >Adicionar Quantia</button>
                        <button className="btn hoverAnim1" style={{ backgroundColor: 'var(--fourth-color)' }}
                            onClick={()=>{
                                const foundDiretor = users?.find(item=> ['Diretor', 'Diretora'].includes(item.funcao))
                                if (!value || value <= 0) {
                                    addToast({message: 'Insira um valor', type: 'warn', time: 3})
                                    return
                                }

                                PixEvents.systemRemove(modUser??1, foundDiretor!.id, formatCentavos(value??0))
                                .then(res=>{
                                    if (res.status === 200){
                                        setTransactions([
                                            ...transactions??[],
                                            {
                                                transaction_id: (transactions?.length??0) +1,
                                                to: foundDiretor!.id,
                                                from: modUser??1,
                                                from_system: 2,
                                                value: formatCentavos(value??0)
                                            }
                                        ])

                                        setUsers(prev=>
                                            prev?.map(user =>
                                                user.id === modUser?{
                                                    ...user,
                                                    pix: String((parseFloat(user.pix||'0')||0) - (parseFloat(formatCentavos(value??0).replace(',','.'))))
                                                }
                                                : user
                                            )
                                        )
                                    }
                                })
                                .catch(err=>{
                                    console.log(err)
                                })
                            }}
                        >Remover Quantia</button>
                    </div>
                </div>:null}
            </section>
        </DesbravaPixStyle>
    )
}
export default DesbravaPixPage

const DesbravaPixStyle = styled.main`
    width: 100%;
    min-height: 100vh;
    background-color: var(--white);
    padding: 5vh;
    display: flex;
    gap: 1vh;
    @media (max-width: 1000px){
        flex-direction: column-reverse;
    }

    section.container{
        width: 50%;
        @media (max-width: 1000px){
            width: 100%
        }
    }

    .members-row{
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
                width: 40%;
            }
            &:nth-child(2){
                width: 40%;
            }
            &:nth-child(3){
                width: 20%;
                border-right: .3vh solid var(--black);
            }
        }
    }
`