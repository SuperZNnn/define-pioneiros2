import styled from "styled-components"
import type { Unidade, UnidadeMembro } from "../pages/admPages/UnidadesManager"
import type { User } from "../types/user"

const UnidadeBanner = ({unidade, members, memberClickEvent, membros}: { membros: UnidadeMembro[] ,memberClickEvent?: (id: number) => void ,unidade: Unidade, members: User[] }) => {
    return (
        <UnidadesBannerStyle>
            <img src={unidade.photo?`data:image/jpeg;base64,${unidade.photo}`:"/assets/images/green_bg.jpg"} className="bg" alt="background"/>
            <div className="banner-info">
                <h2 className="main-title" style={{ textAlign: 'left' }}><span>{unidade.name}</span></h2>

                <div className="brand">
                    <img alt="logo" className="logo" src={unidade.photo?`data:image/jpeg;base64,${unidade.photo}`:"/assets/images/green_bg.jpg"}/>
                
                    <div className="un-members">
                        {membros.filter(item=>item.unidade_cod === unidade.un_id).map(item => {
                            const foundUser = members.find(user=> user.id === item.member_id)

                            return (
                                <div className="member" key={item.member_id}
                                    onClick={() => {
                                        if (memberClickEvent) memberClickEvent(item.member_id)
                                    }}
                                >
                                    <img src={foundUser?.photo?`data:image/jpeg;base64,${foundUser.photo}`:"https://pioneirosdoadvento.com/assets/images/default_user.jpg"}/>
                                    <div className="text">
                                        <p className="simple-text">{foundUser?.fullname}</p>
                                        <p className="simple-text"><b>{item.cargo}</b></p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </UnidadesBannerStyle>
    )
}
export default UnidadeBanner

const UnidadesBannerStyle = styled.section`
    border: .3vh solid var(--black);
    height: 40vh;
    overflow: hidden;

    .bg{
        width: 100%;
        height: 39.3vh;
        object-fit: cover;
        filter: blur(1rem)
    }

    .banner-info{
        width: 100%;
        height: 39.5vh;
        transform: translateY(-40vh);
        
        .brand{
            position: relative;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            top: -3vh;
            flex-direction: column;
            @media (max-width: 450px){
                top: 0vh;
            }

            img.logo{
                width: 15vh;
                border-radius: 50%;
                border: .3vh solid var(--black)
            }

            .un-members{
                display: flex;
                justify-content: space-around;
                gap: 1vh;
                width: 100%;
                flex-wrap: wrap;
                height: 22vh;
                overflow: auto;
            }
            .member{
                margin-top: 1vh;
                width: 30vh;
                height: 12vh;
                display: flex;
                align-items: center;
                background-color: rgba(8, 64, 27, .5);
                padding: 1vh;
                gap: 1vh;
                color: var(--white);
                border-radius: .5vh;
                border: .3vh solid var(--white);
                transition: .2s;
                cursor: pointer;

                &:hover{
                    transform: scale(1.1)
                }

                img{
                    border-radius: 50%;
                    width: 7.5vh;
                    border: .3vh solid var(--white);
                    aspect-ratio: 1/1;
                    object-fit: cover;
                }
            }
        }

        h2{
            position: relative;
            top: 1vh;
            z-index: 1;
            @media (max-width: 750px){
                font-size: 1rem;
            }
            @media (max-width: 450px){
                font-size: .7rem;
            }

            span{
                padding: 1vh;
                color: var(--white);
                background-color: var(--black);
            }
        }
    }
`