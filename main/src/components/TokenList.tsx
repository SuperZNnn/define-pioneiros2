import { useEffect, useState } from "react";
import { ApiRequests, cachedMembers, SystemEvents } from "../services/api";
import type { User } from "../types/user";
import { formatDateBr } from "../hooks/useConvert";
import styled from "styled-components";
import ModalContainer from "./ModalContainer";

type Tokens = {
    owner_id: number,
    token: string,
    token_type: number,
    expires_at?: Date
}

const TokenDisplay = ({item, deleteToken}: { deleteToken: (token: string)=>void, item: Tokens }) => {
    const [user, setUser] = useState<User>()
    const [mockItem, setMockItem] = useState<Tokens>(item)
    const [showDelete, setShowDelete] = useState<boolean>(false)
    
    useEffect(()=>{
        const fetchUser = async () => {
            let user: User | undefined = undefined;
            if (cachedMembers){
                user = cachedMembers.find(user => user.id === item.owner_id)
            }
            else{
                const getUser = await ApiRequests.getMember(item.owner_id)
                user = getUser.data.user
            }
            setUser(user)
        }
        fetchUser()

        const convertedItem = {
            ...item,
            expires_at: item.expires_at ? new Date(item.expires_at) : undefined
        }
        setMockItem(convertedItem)
    }, [item])

    return (
        <>
            <StyledLi>
                <div className="cel">
                    <p className="simple-text">{mockItem.owner_id} - {user?.fullname}</p>
                </div>
                <div className="cel">
                    <p className="simple-text">{mockItem.token}</p>
                </div>
                <div className="cel">
                    <p className="simple-text">{mockItem.token_type}</p>
                </div>
                <div className="cel">
                    <a className="simple-text" target="blank"
                        href={`
                                ${mockItem.token_type === 1? `http://localhost:5174/finishregister/${mockItem.token}/${encodeURIComponent(user?.fullname??'')}`:null}
                                ${mockItem.token_type === 2? `http://localhost:5174/resetpassword/${mockItem.token}/${encodeURIComponent(user?.fullname??'')}`:null}
                            `}
                    >
                        {mockItem.token_type === 1? `http://localhost:5174/finishregister/...`:null}
                        {mockItem.token_type === 2? `http://localhost:5174/resetpassword/...`:null}
                    </a>
                </div>
                <div className="cel">
                    <p className="simple-text">{formatDateBr(mockItem.expires_at, true)}</p>
                    
                    <button className="btn" style={{ backgroundColor: 'var(--fourth-color)' }}
                        onClick={() => {
                            SystemEvents.updateToken(mockItem.token)
                            .then(res => {
                                if (res.status === 200){
                                    setMockItem((prev) => ({
                                        ...prev,
                                        expires_at: new Date(new Date(prev.expires_at!).getTime() + 30 * 60 * 1000)
                                    }))
                                }
                            })
                            .catch(err => {
                                console.log(err)
                            })
                        }}
                    >+30mins</button>
                </div>
                <div className="cel">
                    <button className="btn" style={{ backgroundColor: '#800000', color: '#fff' }}
                        onClick={() => {setShowDelete(true)}}
                    >Deletar Token</button>
                </div>
            </StyledLi>

            {showDelete?
                <ModalContainer
                    close={() => {
                        setShowDelete(false)
                    }}
                >
                    {(handleClose) => (
                        <>
                            <h5 className="main-title">Tem certeza que deseja deletar ess<br/>token?</h5>
                            <div className="flex-bts">
                                <button className="btn hoverAnim1" style={{ width: '20vh', backgroundColor: '#800000', color: 'var(--white)' }}
                                    onClick={()=>{
                                        SystemEvents.deleteToken(item.token)
                                        .then(res=>{
                                            if (res.status === 200){
                                                deleteToken(item.token)
                                            }
                                        })
                                        .catch(err=>{
                                            console.log(err)
                                        })
                                        .finally(()=>{
                                            handleClose()
                                        })
                                    }}
                                >Sim</button>
                                <button className="btn hoverAnim1" style={{ width: '20vh', backgroundColor: 'var(--first-color)', color: 'var(--white)' }}
                                    onClick={handleClose}   
                                >Não</button>
                            </div>
                        </>
                    )}
                </ModalContainer>
            :null}
        </>
    )
}
export default TokenDisplay

export const StyledLi = styled.li`
    display: flex;
    border: .3vh solid var(--black);

    a{
        color: #000;
        text-decoration: underline;
        word-break: break-all
    }

    .cel{
        overflow: hidden;

        padding: .5vh;

        p{
            word-break: break-all
        }

        &:not(:nth-child(1)){
            border-left: .3vh solid var(--black);
        }
        &:nth-child(1){width: 35%;}
        &:nth-child(2){width: 10%;}
        &:nth-child(3){width: 5%;}
        &:nth-child(4){width: 20%;}
        &:nth-child(5){width: 20%; display: flex; justify-content: space-between; align-items: center;}
        &:nth-child(6){
            width: 10%;
            
            button{
                position: relative;
                left: 50%;
                transform: translate(-50%);
            }
        }
    }
`