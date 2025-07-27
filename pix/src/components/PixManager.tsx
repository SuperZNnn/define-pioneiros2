import { useEffect, useState } from "react"
import styled from "styled-components"
import { ApiRequests, PixEvents } from "../services/api"
import { type User } from "../types/user"
import SendModal from "./SendConfig"
import { convertToBRL, formatCentavos } from "../hooks/useConvert"

type Transaction = {
    external: number,
    amount: string
}

const PixManager = ({quitSession, userId}: { quitSession: () => void, userId: number }) => {
    const [usersList, setUsersList] = useState<User[]>()
    const [sessionUser, setSessionUser] = useState<User>()
    const [showSendPix, setShowSendPix] = useState<boolean>(false)
    const [sendedHistory, setSendedHistory] = useState<Transaction[]>([])
    const [recievedHistory, setRecievedHistory] = useState<Transaction[]>([])
    
    useEffect(() => {
        ApiRequests.getAllMembers()
        .then(res => {
            setUsersList(res)

            const user = res.find(item=> item.id === userId)
            setSessionUser(user)

            PixEvents.getTransactions()
            .then(res=>{
                const resData = res.data as { recieves: { from: number, to: number, value: string }[], sends: { from: number, to: number, value: string }[] }
                setSendedHistory(
                    resData.sends.map(item => ({
                        external: item.to,
                        amount: item.value
                    }))
                )
                setRecievedHistory(
                    resData.recieves.map(item => ({
                        external: item.from,
                        amount: item.value
                    }))
                )
            })
            .catch(err=> {
                console.log(err)
            })
        })
        .catch(err => {
            console.log(err)
        })
    }, [])

    return(
        <PixManagerStyle>
            <div className="left">
                <div>
                    <h2 className="second-title">Olá, {sessionUser?.fullname}</h2>
                    <h3 className="second-title">{convertToBRL(sessionUser?.pix??'')}</h3>
                </div>

                <button onClick={() => {setShowSendPix(true)}} className="btn hoverAnim1" style={{ backgroundColor: 'var(--first-color)', color: 'var(--white)', width: '100%' }}>Enviar Pix</button>
            </div>
            <div className="right">
                <section>
                    <div>
                        <h5 className="main-title">Recebidos</h5>
                        <div className="table-wrapper" style={{ backgroundColor: 'rgba(0, 128, 0, .5)' }}>
                            <div className="line">
                                <p className="simple-text">QUANTIA:</p>
                                <p className="simple-text">DE:</p>
                            </div>
                            {recievedHistory.map((item, index)=>(
                                <LineGenerator
                                    key={index}
                                    amount={item.amount}
                                    externalId={item.external}
                                    usersList={usersList??[]}
                                />
                            ))}
                        </div>
                    </div>
                </section>
                <section>
                    <div>
                        <h5 className="main-title">Enviados</h5>
                        <div className="table-wrapper" style={{ backgroundColor: 'rgba(128, 0, 0, .5)' }}>
                            <div className="line">
                                <p className="simple-text">QUANTIA:</p>
                                <p className="simple-text">PARA:</p>
                            </div>
                            {sendedHistory.map((item, index)=>(
                                <LineGenerator
                                    key={index}
                                    amount={item.amount}
                                    externalId={item.external}
                                    usersList={usersList??[]}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            </div>
            <button className="quit btn" onClick={quitSession}>Sair</button>

            {showSendPix?
            <SendModal
            usersList={usersList!}
            userId={userId}
            maxValue={sessionUser!.pix}
            close={() => {setShowSendPix(false)}}
            afterSend={({amount, to}: {amount:number, to: number}) => {
                PixEvents.sendTo(to, amount)
                .then(res=>{
                    if (res.status === 200){
                        setSessionUser((prev)=>({
                            ...prev!,
                            pix: `${parseFloat(sessionUser!.pix) - parseFloat(formatCentavos(amount).replace(',', '.'))}`
                        }))

                        setSendedHistory([
                            ...sendedHistory,
                            {external: to, amount: `${formatCentavos(amount)}`}
                        ])
                    }
                })
                .catch(err => {
                    if (err.status === 401) alert('Não autorizado')
                    else if (err.status === 406) alert('Sem saldo!')
                    else alert('Erro interno! Tente novamente mais tarde')
                })
            }}
            />
            :null}
        </PixManagerStyle>
    )
}
export default PixManager

const LineGenerator = ({amount, externalId, usersList}: { usersList: User[], amount: string, externalId: number}) => {
    const [name, setName] = useState<string | undefined>('')
    
    useEffect(() => {
        const founded = usersList.find(item=>item.id === externalId)
        setName(founded?.fullname)
    }, [usersList, externalId])

    return (
        <div className="line">
            <p className="simple-text">{convertToBRL(amount)}</p>
            <p className="simple-text">{name}</p>
        </div>
    )
}

const PixManagerStyle = styled.section`
    width: 48vh;
    height: 70vh;
    display: flex;
    border-radius: 1vh;
    overflow: hidden;
    border: .3vh solid var(--white);
    box-shadow: 5px 5px 0px rgba(0,0,0,.3);

    .quit{
        position: absolute;
        background-color: var(--fourth-color);
        width: 20vh;
        top: 80.4vh;
        transform: translate(14vh);
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }

    .left,.right{
        width: 50%;
        padding: 1vh;

        section{
            height: 35vh;
        }
    }
    .left{
        background-color: var(--white);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 3vh;

        h2{
            font-size: 1rem;
        }
        h3{
            font-size: 1.7rem;
        }
    }
    .right{
        background-color: rgba(217, 164, 4, .3);

        .table-wrapper{
            height: 30vh;

            .line{
                display: flex;
                padding: .5vh;
                border-bottom: .3vh solid var(--black);
                
                p{
                    &:nth-child(1){
                        width: 45%;
                    }
                    &:nth-child(2){
                        width: 55%;
                        border-left: .3vh solid var(--black);
                        padding-left: .5vh;
                    }

                    color: var(--white);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis
                }
            }
        }
    }
`