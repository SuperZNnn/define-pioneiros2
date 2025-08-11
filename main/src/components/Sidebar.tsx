import { useEffect, useState, type ReactNode } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import { useAuth } from "../hooks/useAuth"
import type { User } from "../types/user"
import { ApiRequests } from "../services/api"
import { AdmFuncs } from "../types/user"

export const SideBar = ({user, logout}: { user: number | undefined, logout: () => void }) => {
    const [showSidebar, setShowSidebar] = useState<boolean>(false)

    return(
        <>
            <SidebarStyle style={{ transform: showSidebar?'':'translate(-32vh)' }}>
                <img src="https://pioneirosdoadvento.com/assets/images/logo.png" alt="logo"/>
                <h2 className="second-title" style={{ fontSize: '.8rem' }}>Clube de Desbravadores</h2>
                <h1 className="main-title" style={{ fontSize: '1rem' }}>Pioneiros do Advento</h1>

                {user?<>
                    <Link to='/profile'><button className="btn noradius" style={{ width: '100%', marginTop: '1vh' }}>Perfil</button></Link>
                    <a><button onClick={logout} className="btn noradius" style={{ width: '100%' }}>Sair</button></a>
                </>:<>
                    <a href="http://localhost:5174/redirect?for=http://localhost:5173/profile"><button className="btn noradius" style={{ width: '100%', marginTop: '1vh' }}>Fazer Login</button></a>
                    <a><button className="btn noradius" style={{ width: '100%' }}>Seja um desbravador</button></a>
                </>}
                
                <a href="#inicio"><button className="btn noradius" style={{ width: '100%', marginTop: '1vh' }}>Início</button></a>
                <a href="#camporis"><button className="btn noradius" style={{ width: '100%' }}>Camporis</button></a>
                <a href="#members"><button className="btn noradius" style={{ width: '100%' }}>Membros</button></a>
                
                <a href="#unidades"><button className="btn noradius" style={{ width: '100%', marginTop: '1vh' }}>Unidades</button></a>
                <a><button className="btn noradius" style={{ width: '100%' }}>Nos apoie</button></a>
            </SidebarStyle>

            <BurgerButton
                trigger={() => {setShowSidebar(!showSidebar)}}
            />
        </>
    )
}

export const LoggedSidebar = () => {
    const [showSidebar, setShowSidebar] = useState<boolean>(false)
    const [user, setUser] = useState<User>()

    const { getUser, logout } = useAuth()

    useEffect(() => {
        const fetchData = async () => {
            ApiRequests.getMember(await getUser()??0)
            .then(res => {
                setUser(res.data.user)
            })
            .catch(err => {
                console.log(err)
            })
        }
        fetchData()
    }, [])


    return (
        <>
            <SidebarStyle style={{ transform: showSidebar?'':'translate(-32vh)' }}>
                <Link to='/'><img src="https://pioneirosdoadvento.com/assets/images/logo.png" alt="logo"/></Link>
                <h2 className="second-title" style={{ fontSize: '.8rem' }}>Clube de Desbravadores</h2>
                <h1 className="main-title" style={{ fontSize: '1rem' }}>Pioneiros do Advento</h1>

                {AdmFuncs.includes(user?.funcao??'')?
                    <BurgerList title="Administrador">
                        <Link to='/tokenmanager'><button className="btn noradius" style={{ width: '100%', height: '5vh' }}>Gerenciador de Tokens</button></Link>
                        <a><button className="btn noradius" style={{ width: '100%', height: '5vh' }}>Manutenção Whatsapp</button></a>
                    </BurgerList>
                :null}
                
                {AdmFuncs.includes(user?.funcao??'')?
                    <BurgerList title="Secretaria">
                        <Link to='/secretaria/membros'><button className="btn noradius" style={{ width: '100%', height: '5vh' }}>Membros</button></Link>
                        <Link to='/desbravapix'><button className="btn noradius" style={{ width: '100%', height: '5vh' }}>Gerenciador DesbravaPix</button></Link>
                        <Link to='/secretaria/unidades'><button className="btn noradius" style={{ width: '100%', height: '5vh' }}>Unidades</button></Link>
                    </BurgerList>
                :null}

                <BurgerList title="Geral" startOpen={true}>
                    <a href='http://localhost:5175'><button className="btn noradius" style={{ width: '100%', height: '5vh' }}>DesbravaPix</button></a>
                    <a><button className="btn noradius" style={{ width: '100%', height: '5vh' }}>Ficha Médica</button></a>
                </BurgerList>
                <BurgerList title="Navegação" startOpen={true}>
                    <Link to='/profile'><button className="btn noradius" style={{ width: '100%',height: '5vh'}}>Perfil</button></Link>
                    <Link to='/'><button className="btn noradius" style={{ width: '100%',height: '5vh' }}>Início</button></Link>
                    <a href='/'><button onClick={logout} className="btn noradius" style={{ width: '100%',height: '5vh' }}>Sair</button></a>
                </BurgerList>
                
            </SidebarStyle>

            <BurgerButton
                trigger={() => {setShowSidebar(!showSidebar)}}
                start={false}
            />
        </>
    )
}

const BurgerList = ({children, title, startOpen}: {children: ReactNode, title: string, startOpen?: boolean }) => {
    const [open, setOpen] = useState<boolean>(startOpen??false)

    const childrenValue = children?.valueOf() as any[]
    
    return (
        <BurgerListStyle className="simple-text" quant={childrenValue.length}>
            <h2
                onClick={() => {setOpen(!open)}}
            >{title}</h2>

            <div className={`items ${open?'':'closed'}`}>
                {children}
            </div>
        </BurgerListStyle>
    )
}

const BurgerButton = ({trigger, start}: {start?: boolean, trigger?: () => void}) => {
    const [active, setActive] = useState<boolean>(start??false)

    return (
        <BurgerButtonStyle onClick={() => {
            setActive(!active)
            if (trigger) trigger()
        }}
        style={{ transform: active?'rotate(90deg)':'' }}
        >
            <div className="bar"/>
            <div className="bar"/>
            <div className="bar"/>
        </BurgerButtonStyle>
    )
}

const SidebarStyle = styled.aside`
    position: fixed;
    background-color: rgba(217, 164, 4, .3);
    width: 30vh;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: 4;
    border-right: .3vh solid var(--white);
    transition: .2s;
    outline: none;

    img{
        width: 20vh;
        position: relative;
        left: 50%;
        transform: translate(-50%);
        filter: drop-shadow(5px 5px 0px rgba(0,0,0,.3));
    }

    a{
        button{
            transition: .2s;
        }
        &:nth-child(odd){
            button{
                background-color: var(--first-color);
                color: var(--white);

                &:hover{
                    background-color: #062a12;
                }
            }
        }
        &:nth-child(even){
            button{
                background-color: var(--fourth-color);

                &:hover{
                    background-color: #b68905;
                }
            }
        }
    }
`
const BurgerButtonStyle = styled.button`
    position: fixed;
    bottom: 2vh;
    left: 2vh;
    width: 7.5vh;
    height: 7.5vh;
    background-color: rgba(0, 0, 0, .5);
    z-index: 5;
    border: none;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    border-radius: 1vh;
    transition: .2s;

    .bar{
        width: 5.5vh;
        border-radius: 1vh;
        height: 1vh;
        background-color: var(--fourth-color);

    }
`
const BurgerListStyle = styled.section<{ quant: number }>`
    background-color: var(--second-color);
    border-top: .4vh solid var(--white);
    border-bottom: .4vh solid var(--white);

    h2{
        text-align: center;
        height: 7vh;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        color: var(--white);
    }

    .items{
        overflow: hidden;
        transition: .2s;

        &.closed{
            height: 0
        }
        &:not(.closed){
            height: ${({quant}) => quant?quant*5:null}vh
        }
    }
`