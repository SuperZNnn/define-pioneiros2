import styled from "styled-components"
import ImageSlider from "../components/ImageSlider"
import { useEffect, useState } from "react"
import CamporiContainer from "../components/CamporisContainer"
import MembersContainer from "../components/MembersContainer"
import { useAuth } from "../hooks/useAuth"
import { Link } from "react-router-dom"
import { SideBar } from "../components/Sidebar"
import UnidadesContainer from "../components/UnidadesContainer"

const HomePage = () => {
    const { logout, getUser } = useAuth()

    const [user, setUser] = useState<number | undefined>(undefined)
    const [mapSize, setMapSize] = useState<{ width: number, height: number }>({width: 500, height: 250})
    const [scroll, setScroll] = useState<number>(0)

    useEffect(() => {
        const getUserSession = async () => {
            setUser(await getUser())
        }
        getUserSession()

        const handleResize = () => {
            if (window.innerWidth < 840) setMapSize({width: 300, height: 200})
            else if (window.innerWidth < 1200) setMapSize({width: 400, height: 200})
            else if (window.innerWidth < 1300) setMapSize({width: 400, height: 230})
            else setMapSize({width: 500, height: 250})
        }
        window.addEventListener('resize', handleResize)
        handleResize()

        const handleScroll = () => {
            setScroll(window.scrollY)
        }
        window.addEventListener('scroll', handleScroll)
        handleScroll()

        return () => {
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return (
        <>
            <HomePageStyle>
                <section className="brand" id="inicio">
                    <ImageSlider/>
                    <img className="smoke" src="/assets/images/smoke.jpg"/>
                    <div className="border" style={{ zIndex: '-1' }}/>

                    <section className="info">
                        <img alt="logo" src="https://pioneirosdoadvento.com/assets/images/logo.png"/>

                        <div className={`styled-container black ${scroll >= 600?'fixed1':''}`}>
                            {!user?<>
                                <a href="http://localhost:5174/redirect?for=http://localhost:5173/profile">
                                    <button className="btn hoverAnim1" style={{ background: 'var(--first-color)', color: '#fff' }}>Fazer Login</button>
                                </a>
                                <Link to='/sejadesbravador'><button className="btn hoverAnim1" style={{ background: 'var(--fourth-color)' }}>Seja um Desbravador</button></Link>
                            </>:
                            <>
                                <Link to='/profile'>
                                    <button className="btn hoverAnim1" style={{ background: 'var(--first-color)', color: '#fff' }}>Perfil</button>
                                </Link>
                                <button className="btn hoverAnim1" style={{ background: 'var(--fourth-color)' }}
                                    onClick={() => {
                                        setUser(undefined)
                                        logout()
                                    }}
                                >Sair</button>
                            </>}
                            
                        </div>
                    </section>
                    
                </section>
                <div className="separator"/>
                <section className="side">
                    <div className="border"/>

                    <section className="about">
                        <div className="sec">
                            <h2 className="second-title" style={{ textAlign: 'left' }}>Fundação</h2>
                            <p className="simple-text justify">
                                O Clube de Desbravadores Pioneiros do Advento da Igreja Adventista do Sétimo Dia de Cesar Augusto, foi fundado no 18 de agosto de 2012, com o seguinte pensamento Bíblico, Vós, porém, sois raça eleita, sacerdócio real, nação santa, povo de propriedade exclusiva de Deus, a fim de proclamardes as virtudes daquele que vos chamou das trevas para sua maravilhosa luz, I Pedro 2:9. O Clube participou de vários eventos promovidos pelo próprio clube, pela Igreja local, pelo Distrito, Pela Região, pela Área, Associação Pernambucana, União Nordeste Brasileira e Divisão Sul Americana, tais como, Quebrando o Silêncio, Camporis, Acampamentos, caminhadas, congressos, desfiles, e entre outros.
                            </p>
                        </div>
                        <div className="sec">
                            <h2 className="second-title" style={{ textAlign: 'left' }}>Sobre</h2>
                            <p className="simple-text justify">
                                O clube de desbravadores é um programa religioso centrado no tripé físico-mental-espiritual, que desenvolve atividades para atender às necessidades e interesses de crianças e adolescentes (juvenis) entre 10 e 15 anos de idade, com foco específico nesta faixa etária. As congregações adventistas são convidadas a integrar e patrocinar as atividades dos desbravadores, pois este departamento é considerado um dos "carro-chefe" da mesma, sendo "linha de frente" do seu programa evangelístico. Desta forma, os juvenis são convidados a participar do processo de evangelização.
                            </p>
                        </div>

                        <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3667.24241580709!2d-35.31647518980735!3d-7.500842592480329!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7ac78c7d9323cb9%3A0xa5ca6de186411921!2sIgreja%20Adventista%20Do%20S%C3%A9timo%20Dia%20-%20C%C3%A9sar%20Augusto!5e1!3m2!1spt-BR!2sbr!4v1733233840208!5m2!1spt-BR!2sbr"
                        width={mapSize.width} 
                        height={mapSize.height}
                        style={{ border: 0 }} 
                        allowFullScreen
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        />

                        <div className={`navigator styled-container white`}>
                            <a href="#inicio"><button className="btn hoverAnim1" style={{ backgroundColor: 'var(--first-color)', color: 'var(--white)' }}>Início</button></a>
                            <a href="#camporis"><button className="btn hoverAnim1" style={{ backgroundColor: 'var(--first-color)', color: 'var(--white)' }}>Camporis</button></a>
                            <a href="#members"><button className="btn hoverAnim1" style={{ backgroundColor: 'var(--first-color)', color: 'var(--white)' }}>Membros</button></a>
                            <a href="#unidades"><button className="btn hoverAnim1" style={{ backgroundColor: 'var(--fourth-color)' }}>Unidades</button></a>
                            <button className="btn hoverAnim1" style={{ backgroundColor: 'var(--black)', color: 'var(--white)' }}>Nos apoie</button>
                        </div>
                    </section>
                </section>
            </HomePageStyle>

            <CamporiContainer/>
            <MembersContainer/>
            <UnidadesContainer/>

            <SideBar
                user={user}
                logout={() => {
                    setUser(undefined)
                    logout()
                }}
            />
        </>
    )
}
export default HomePage

const HomePageStyle = styled.main`
    width: 100%;
    display: flex;

    @media (max-width: 1150px){
        flex-direction: column;
    }

    .fixed1{
        position: fixed;
        top: 0;
        border-top: none;
        border-radius: 0 0 1vh 1vh!important;
        z-index: 99;
        left: 50%;
        transform: translate(-50%);

        @media (max-width: 800px){
            display: none;
        }
    }

    .about{
        position: relative;
        z-index: 1;
        padding: 2vh 2vh 2vh 4vh;
        display: flex;
        flex-direction: column;
        gap: 1vh;

        @media (max-width: 1150px){
            padding: 2vh;
        }

        .sec{
            color: var(--white);
            background-color: rgba(0,0,0,.5);
            padding: 1vh;
        }

        iframe{
            position: relative;
            left: 50%;
            transform: translate(-50%);

            @media (max-width: 670px){
                display: none;
            }
        }

        .navigator{
            margin-top: 1vh;

            button{
                width: 15vh;
            }
        }
    }

    .brand{
        width: 50%;
        height: 100vh;
        background-position: center;
        background-size: cover;

        .styled-container{
            width: 50vh;
            button{
                width: 22vh
            }

            @media (max-width: 400px){
                width: 90%
            }
        }

        @media (max-width: 1150px){
            width: 100%;
        }
    }
    .info{
        width: 50vw;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;

        img{
            width: 50vh;
            filter: drop-shadow(5px 5px 0px rgba(0,0,0,.3));

            @media (max-width: 400px){
                width: 30vh;
            }
        }

        @media (max-width: 1150px){
            width: 100%;
        }
    }

    .smoke,.border{
        position: absolute;
        width: 50%;
        height: 100vh;
    }
    .smoke{
        opacity: .6;
        z-index: -1;

        @media (max-width: 1150px){
            width: 100%;
        }
    }
    .border{
        opacity: .7;
        border-top: 2vh solid var(--first-color);
        border-bottom: 2vh solid var(--first-color);
        @media (max-width: 1150px){
            display: none
        }
    }

    .separator{
        position: absolute;
        left: 50%;
        height: 100vh;
        width: 2vh;
        background-color: var(--white);
        z-index: 1;
        box-shadow: 0px 0px 2px 2px rgba(255,255,255,.3);
        @media (max-width: 1150px){
            display: none
        }
    }
    
    .side{
        width: 50%;
        background-image: url('/assets/images/green_bg.jpg');
        background-position: center;
        background-size: cover;

        @media (max-width: 1150px){
            width: 100%;
        }
    }
`