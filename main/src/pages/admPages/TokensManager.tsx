import styled from "styled-components"
import TokenDisplay, { StyledLi } from "../../components/TokenList"
import { useEffect, useState } from "react"
import { ApiRequests, SystemEvents } from "../../services/api"
import { useAuth } from "../../hooks/useAuth"
import type { User } from "../../types/user"
import { useToasts } from "../../hooks/useToasts"
import { useNavigate } from "react-router-dom"
import { AdmFuncs } from "../../types/user"

type Tokens = {
    owner_id: number,
    token: string,
    token_type: number,
    expires_at?: Date
}

const TokenManagerPage = () => {
    const { getUser } = useAuth()
    const { addToast } = useToasts()
    const navigate = useNavigate()

    const [tokens, setTokens] = useState<Tokens[]>([])

    useEffect(()=>{
        SystemEvents.getAllTokens()
        .then(res=>{
            const resData = res.data as Tokens[]
            setTokens(resData)
        })
        .catch(err=>{
            console.log(err)
        })

        getUser()
        .then(response=>{
            if (response){
                ApiRequests.getMember(response)
                .then(res=>{
                    const resData = res.data as { message: string, user: User }
                    if (!AdmFuncs.includes(resData.user.funcao)){
                        addToast({message: 'Sessão permissão!', time: 3, type: 'error'})
                        navigate('/')
                        return
                    }
                })
                .catch(()=>{
                    addToast({message: 'Sessão inválida!', time: 3, type: 'error'})
                    navigate('/')
                    return
                })
            }
        })
        .catch(error => {
            if (error.status == 401){
                addToast({message: 'Sessão inválida!', time: 3, type: 'error'})
                navigate('/')
                return
            }
        })
    }, [])

    return (
        <TokenManagerStyle>
            <section className="tokens-display">
                <ul>
                    <StyledLi className="invert">
                        <div className="cel">
                            <p className="simple-text">USUÁRIO</p>
                        </div>
                        <div className="cel">
                            <p className="simple-text">TOKEN</p>
                        </div>
                        <div className="cel">
                            <p className="simple-text">TIPO</p>
                        </div>
                        <div className="cel">
                            <p className="simple-text">AÇÃO</p>
                        </div>
                        <div className="cel">
                            <p className="simple-text">EXIPRA EM</p>
                        </div>
                        <div className="cel">
                            <p className="simple-text">DELETAR</p>
                        </div>
                    </StyledLi>

                    {tokens.length > 0 && tokens.map((item, index) => (
                        <TokenDisplay key={index} item={item}
                            deleteToken={(token: string)=>{
                                const newList = tokens.filter(item => item.token !== token)
                                setTokens(newList)
                            }}
                        />
                    ))}
                    {tokens.length === 0 ? <h2 className="second-title">Não há tokens ativos</h2>:''}
                </ul>
            </section>
        </TokenManagerStyle>
    )
}
export default TokenManagerPage

const TokenManagerStyle = styled.main`
    width: 100%;
    min-height: 100vh;
    background-color: var(--white);
    padding: 5vh;

    .invert{
        background-color: var(--black);
        color: var(--white);

        .cel{
            padding: 1vh;
            text-align: center;
        }
    }
`