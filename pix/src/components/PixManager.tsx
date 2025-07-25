import { useEffect, useState } from "react"
import styled from "styled-components"
import { ApiRequests } from "../services/api"
import { type User } from "../types/user"
import SendModal from "./SendConfig"
import { convertToBRL } from "../hooks/useConvert"

const PixManager = ({quitSession, userId}: { quitSession: () => void, userId: number }) => {
    const [usersList, setUsersList] = useState<User[]>()
    const [sessionUser, setSessionUser] = useState<User>()

    const [showSendPix, setShowSendPix] = useState<boolean>(false)

    useEffect(() => {
        ApiRequests.getAllMembers()
        .then(res => {
            setUsersList(res)

            const user = res.find(item=> item.id === userId)
            setSessionUser(user)
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

                        </div>
                    </div>
                </section>
                <section>
                    <div>
                        <h5 className="main-title">Enviados</h5>
                        <div className="table-wrapper" style={{ backgroundColor: 'rgba(128, 0, 0, .5)' }}>

                        </div>
                    </div>
                </section>
            </div>
            <button className="quit btn" onClick={quitSession}>Sair</button>

            {showSendPix?<SendModal usersList={usersList!} userId={userId} maxValue={sessionUser!.pix} close={() => {setShowSendPix(false)}}/>:null}
        </PixManagerStyle>
    )
}
export default PixManager

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
        }
    }
`