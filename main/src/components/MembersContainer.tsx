import { useEffect, useState } from "react"
import styled from "styled-components"
import { ApiRequests } from "../services/api"
import type { User } from "../types/user"
import { Link } from "react-router-dom"

const MembersContainer = () => {
    const [members, setMembers] = useState<User[]>()
    const [diretor, setDiretor] = useState<User>()

    useEffect(() => {
        ApiRequests.getAllMembers()
        .then(res => {
            setMembers(res.filter(item=> item.status === 1))
        })
        .catch(err => {
            console.error(err)
        })
    }, [])

    useEffect(() => {
        const foundDiretor = members?.find(item => item.funcao === 'Diretor' || item.funcao === 'Diretora')
        setDiretor(foundDiretor)
    }, [members])

    return (
        <MembersContainerStyle id="members">
            <section className="static-styled-container black localres" style={{ position: 'relative', left: '50%', transform: 'translate(-50%)' }}>
                <h3 className="second-title">Direção</h3>
                <div className="flex-container">
                    <MemberCard
                        role={diretor?.funcao??'CARREGANDO'}
                        id={diretor?.id??0}
                        name={diretor?.fullname??'CARREGANDO'}
                        type={1}
                        photo={diretor?.photo?`data:image/jpeg;base64,${diretor.photo}`:'https://pioneirosdoadvento.com/assets/images/default_user.jpg'}
                    />
                    {members?.filter(item=>item.funcao === 'Diretora Associada' || item.funcao === 'Diretor Associado').map((item, index) => (
                        <MemberCard
                            key={index}
                            id={item.id}
                            role={item.funcao}
                            name={item?.fullname??'CARREGANDO'}
                            type={1}
                            photo={item?.photo?`data:image/jpeg;base64,${item.photo}`:'https://pioneirosdoadvento.com/assets/images/default_user.jpg'}
                        />
                    ))}
                </div>
            </section>

            <div className="general">
                <section className="static-styled-container black">
                    <h3 className="second-title">Desbravadores</h3>
                    <div className="flex-container">
                        {members?.filter(item=>item.funcao === 'Desbravador' || item.funcao === 'Desbravadora').map((item, index) => (
                            <MemberCard
                                key={index}
                                id={item.id}
                                role={item.funcao}
                                name={item?.fullname??'CARREGANDO'}
                                type={3}
                                photo={item?.photo?`data:image/jpeg;base64,${item.photo}`:'https://pioneirosdoadvento.com/assets/images/default_user.jpg'}
                            />
                        ))}
                    </div>
                </section>

                <section className="static-styled-container black">
                    <h3 className="second-title">Liderança</h3>
                    <div className="flex-container">
                        {members?.filter(item=>item.funcao !== 'Diretor' && item.funcao !== 'Diretora' && item.funcao !== 'Diretora Associada' && item.funcao !== 'Diretor Associado' && item.funcao !== 'Desbravador' && item.funcao !== 'Desbravadora').map((item, index) => (
                            <MemberCard
                                key={index}
                                id={item.id}
                                role={item.funcao}
                                name={item?.fullname??'CARREGANDO'}
                                type={2}
                                photo={item?.photo?`data:image/jpeg;base64,${item.photo}`:'https://pioneirosdoadvento.com/assets/images/default_user.jpg'}
                            />
                        ))}
                    </div>
                </section>
            </div>
            
        </MembersContainerStyle>
    )
}
export default MembersContainer

const MemberCard = ({type, name, role, photo, id}: { id: number, type: number, name: string, role: string, photo: string }) => {
    return (
        <Link to={`/show/${id}`}>
            <MemberCardStyle className="simple-box-shadow">
                <div className="bg-color" style={{backgroundColor: 
                    `${type===1?'rgba(255,215,0,.2)':''}
                    ${type===2?'rgba(255,255,255,.5)':''}
                    ${type===3?'rgba(195,176,145,.5)':''}`
                }}/>

                <img alt="member" src={photo}/>
                <h4 className="second-title" style={{ color: 'var(--black)' }}>{name}</h4>
                <p className="simple-text" style={{ color: 'var(--black)' }}>{role}</p>
            </MemberCardStyle>
        </Link>
    )
}

const MembersContainerStyle = styled.section`
    padding: 1vh;
    background-color: var(--white);

    .localres{
        width: 70vh;
        @media (max-width: 550px){
            width: 100%;
        }
    }

    .static-styled-container{
        .flex-container{
            row-gap: 1vh;
        }
    }

    .general{
        display: flex;
        justify-content: space-evenly;
        margin-top: 1vh;

        @media (max-width: 660px){
            flex-direction: column;
        }

        .static-styled-container{
            width: 45%;
            @media (max-width: 660px){
                width: 100%;

                &:nth-child(2){
                    margin-top: 1vh;
                }
            }
        }
    }
`
const MemberCardStyle = styled.div`
    width: 15vh;
    height: 22vh;
    background-image: url('https://pioneirosdoadvento.com/assets/images/bg.png');
    background-position: center;
    background-size: cover;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-direction: column;
    padding: 0 1vh;
    overflow: hidden;
    border-radius: .5vh;
    cursor: pointer;
    transition: .2s;

    &:hover{
        transform: scale(1.1);
    }

    .bg-color{
        border-radius: .5vh;
        position: absolute;
        width: 15vh;
        height: 22vh;
    }

    img, h4, p{
        position: relative;
        z-index: 1;
    }

    img{
        width: 10vh;
        border: .3vh solid var(--second-color);
        border-radius: 50%;
        aspect-ratio: 1/1;
        object-fit: cover;
    }
    h4{
        width: 14vh;
        font-size: .6rem
    }
    p{
        background-color: rgba(0,0,0,.3);
        width: 100%;
        text-align: center;
        border-radius: .5vh;
    }
`