import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { useAuth } from "../hooks/useAuth"
import { ApiRequests, cachedDisplay, UserEvents } from "../services/api"
import { type DisplayInfo, type User } from "../types/user"
import MemberCard from "../components/MemberCard"
import { formatCPF, formatDate, formatPhoneNumber } from "../hooks/useConvert"
import ImageCropper from "../components/Cropper"
import { useToasts } from "../hooks/useToasts"
import { useNavigate } from "react-router-dom"

const ProfilePage = () => {
    const { getUser } = useAuth()
    const { addToast } = useToasts()
    const navigate = useNavigate()

    const [user, setUser] = useState<User>()
    const [modifyDisplay, setModifyDisplay] = useState<DisplayInfo>()

    const DisplayNameInput = useRef<HTMLInputElement>(null)

    useEffect(() => {
        getUser()
        .then(response=>{
            if (response){
                ApiRequests.getMember(response)
                .then(res=>{
                    const resData = res.data as { message: string, user: User }
                    setUser(resData.user)
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

    const HandleSubmitDisplay = () => {
        UserEvents.updateDisplay(user!.id, { photo: modifyDisplay?.photo, display_name: modifyDisplay?.display_name })
        .then(res=>{
            if (res.status === 200){
                addToast({ message: 'Dados alterados com sucesso!', type: 'success', time: 3 })
                if (DisplayNameInput.current) DisplayNameInput.current.value = ''

                if (modifyDisplay?.photo){
                    setUser((prev) => ({
                        ...prev!,
                        photo: modifyDisplay?.photo
                    }))
                }
                if (modifyDisplay?.display_name && cachedDisplay){
                    const foundedDisplay = cachedDisplay.findIndex(item=>item.origin_id === user!.id)
                    if (foundedDisplay < 0){
                        const newDisplay ={
                            display_name: modifyDisplay.display_name,
                            origin_id: user!.id
                        }
                        cachedDisplay.push(newDisplay)
                    }
                    else{
                        cachedDisplay[foundedDisplay].display_name = modifyDisplay.display_name
                    }
                }
            }
        })
        .catch(error=> {
            if (error.status === 400){
                addToast({ message: 'Nenhum dado precisa de alteração', type: 'warn', time: 3 })
            }

            else{
                addToast({ message: 'Erro interno! Por favor tente novamente', type: 'error', time: 3 })
            }
        })
    }

    return (
        <ProfilePageStyle>
            <section className="user-wrapper">
                {user?
                <div className="grow">
                    <MemberCard
                    user={user}
                    modifyDisplay={modifyDisplay}
                    border
                    />
                </div>:null
                }
            </section>

            <section className="side-wrapper" style={{ backgroundColor: '#cecece' }}>
                <div className="display-change container">

                    <h2 className="main-title">Informações Estéticas</h2>

                    <FormStyles style={{ width: '45vh', position: 'relative', left: '50%', transform: 'translate(-50%)' }}>
                        <div className="input-group" style={{ height: '17vh' }}>
                            <input ref={DisplayNameInput} className="ipt-basic border center" placeholder="Mude seu nome de exibição"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setModifyDisplay((prev) => ({
                                        ...prev!,
                                        display_name: e.target.value
                                    }))
                                }}
                            />

                            <label htmlFor="profile-select" className="ipt-basic border" style={{ width: '45vh', marginTop: '1vh' }}>Mude sua foto</label>
                            
                            <div className="flex-bts" style={{ marginTop: '1vh' }}>
                                <button onClick={HandleSubmitDisplay} className="btn hoverAnim1" style={{ width: '48%', backgroundColor: 'var(--first-color)', color: 'var(--white)' }}>Alterar</button>
                                <button className="btn hoverAnim1" style={{ width: '48%', backgroundColor: 'var(--fourth-color)' }}
                                    onClick={()=>{
                                        setModifyDisplay(undefined)
                                        if (DisplayNameInput.current) DisplayNameInput.current.value = ''
                                    }}
                                >Resetar</button>
                            </div>
                        </div>
                        
                    </FormStyles>
                </div>

                <div className="badges container" style={{ backgroundColor: 'var(--white)'}}>
                    <h2 className="main-title">Emblemas</h2>
                </div>
                <div className="infos container">
                    <h2 className="main-title">Informações Pessoais</h2>

                    <br/>
                    <p className="simple-text noresp"><b>Código do SGC: </b>{user?.sgc_code}</p>
                    <p className="simple-text noresp"><b>Função: </b>{user?.funcao}</p>
                    <br/>
                    <p className="simple-text noresp"><b>Nome completo: </b>{user?.fullname}</p>
                    <p className="simple-text noresp"><b>Data de nascimento: </b>{formatDate(user?.nascimento)}</p>
                    {user?.cpf?<p className="simple-text noresp"><b>CPF: </b>{formatCPF(user.cpf)}</p>:null}
                    {user?.telefone?<p className="simple-text noresp"><b>Telefone: </b>{formatPhoneNumber(`${user.telefone}`)}</p>:null}
                    {user?.telefone_responsavel?<p className="simple-text noresp"><b>Telefone do Responsável: </b>{formatPhoneNumber(`${user.telefone_responsavel}`)}</p>:null}
                    {user?.email?<p className="simple-text noresp"><b>E-mail: </b>{user.email}</p>:null}
                    {user?.email_responsavel?<p className="simple-text noresp"><b>E-mail do Responsável: </b>{user.email_responsavel}</p>:null}
                    <br/>
                    {user?.pai?<p className="simple-text noresp"><b>Pai: </b>{user.pai}</p>:null}
                    {user?.mae?<p className="simple-text noresp"><b>Mãe: </b>{user.mae}</p>:null}
                    {user?.responsavel?<p className="simple-text noresp"><b>Responsável: </b>{user.responsavel}</p>:null}
                </div>
            </section>

            <ImageCropper
                send={(image: string) => {
                    setModifyDisplay((prev) => ({
                        ...prev!,
                        photo: image
                    }))
                }}
            />
        </ProfilePageStyle>
    )
}
export default ProfilePage

const ProfilePageStyle = styled.main`
    width: 100%;
    min-height: 100vh;
    background-color: var(--white);
    display: flex;

    @media (max-width: 700px){
        flex-direction: column;
    }

    .user-wrapper, .side-wrapper{
        width: 50%;
        @media (max-width: 700px){
            width: 100%;
        }
    }
    .side-wrapper{
        @media (max-width: 700px){
            height: 100vh;
        }
    }
    .user-wrapper{
        padding: 2vh;
        display: flex;
        justify-content: center;
        align-items: center;

        .grow{
            @media (min-width: 831px){
                transform: scale(1.3)
            }
        }
    }

    .container{
        padding: 1vh;
    }
`;

export const FormStyles = styled.div`
    option{
        color: #fff;

        &:nth-child(odd){
            background-color: var(--third-color)
        }
        &:nth-child(even){
            background-color: var(--second-color)
        }
    }

    form{
        padding: 1vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 1vh;

        @media (max-width: 650px){
            &:not(.noresp){
                height: 33vh!important;
            }
        }
    }

    .input-group{
        height: 9.5vh;

        @media (max-width: 650px){
            &:not(.noresp){
                height: 7vh;
            }
        }

        input{
            width: 100%;
        }

        p.error-message{
            color: #5e1111;
            position: relative;
            text-align: center;
        }

        .view-icon{
            position: absolute;
            transform: translate(-4vh,1vh);
            width: 3vh;
            cursor: pointer;
        }
    }
    button.form{
        width: 100%;
        background-color: var(--second-color);
        color: #fff;

        &:hover{
            background-color: var(--first-color);
        }

        &.yellow{
            background-color: var(--fourth-color);
            color: var(--black);

            &:hover{
                background-color: #b48700
            }
        }
    }

    .third-ways{
        margin-top: 2vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1vh;

        @media (max-width: 650px){
            margin-top: 1vh;
        }

        h3{
            font-size: .9rem;
        }
    }

    button.third-party{
        width: 10vh;
        border: none;
        border-radius: .5vh;
        transition: .2s;
        cursor: pointer;

        @media (max-width: 650px){
            width: 6vh;
            height: 6vh;
        }

        &:hover{
            background-color: #d8d8d8;
        }

        img{
            width: 10vh;

            @media (max-width: 650px){
                width: 6vh;
            }
        }
    }

    p.redirect{
        text-align: right;
    }
`