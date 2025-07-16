import styled from "styled-components";
import type { DisplayInfo, User } from "../types/users";
import { useEffect, useState } from "react";

const MemberCard = ({ user, userDisplay, border }: { border?: boolean, user: User, userDisplay?: DisplayInfo }) => {
    const [type, setType] = useState<1|2|3>()
    const [age, setAge] = useState<number>()

    useEffect(() => {
        if (user.funcao === 'Diretor' ||
            user.funcao === 'Diretora' ||
            user.funcao === 'Diretor Associado' ||
            user.funcao === 'Diretora Associada'
        ) setType(1)

        else if (user.funcao === 'Desbravador' ||
                user.funcao === 'Desbravadora'
        ) setType(3)
        else setType(2)

        const bday = user.nascimento;
        const birthDate = new Date(bday);
        const currentDate = new Date();
        
        let age = currentDate.getFullYear() - birthDate.getFullYear();
        
        const isBirthdayPassed = 
            currentDate.getMonth() > birthDate.getMonth() || 
            (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() >= birthDate.getDate());
        
        if (!isBirthdayPassed) {
            age--
        }

        setAge(age)
    }, [user])

    return (
        <ViewCardStyle border={border?border:false}>
            <div className="modal-background" style={{backgroundColor: 
                `${type===1?'rgba(255,215,0,.2)':''}
                ${type===2?'rgba(255,255,255,.4)':''}
                ${type===3?'rgba(195,176,145,.5)':''}`
            }}/>

            <div className="image-container">
                <img alt="Foto do perfil" src={user.photo?`data:image/jpeg;base64,${user.photo}`:'https://pioneirosdoadvento.com/assets/images/default_user.jpg'}/>  
            </div>
            <h2>{user.fullname}</h2>

            <div className="more-info">
                <p>{age} Anos</p>
                <p>{user.funcao}</p>
            </div>

            {userDisplay?<div className="description">
                <p className={`${type===1?'golden':''}${type===2?'silver':''}${type===3?'brown':''}`}>INTENTS</p>
            </div>:null}
        </ViewCardStyle>
    )
}
export default MemberCard

const ViewCardStyle = styled.div<{ border: boolean,  }>`
    width: 45vh;
    height: 70vh;
    background-image: url('https://pioneirosdoadvento.com/assets/images/bg.png');
    background-position: center;
    background-size: cover;
    overflow: hidden;
    display: flex;
    align-items: center;
    flex-direction: column;
    box-sizing: border-box;

    border: ${({border}) => (border?'.3vh solid var(--black)':'')};

    .modal-background{
        position: absolute;
        width: 45vh;
        height: 70vh;
        z-index: 1;
    }

    h2{
        font-family: 'Inter', sans-serif;
        text-align: center;
        margin-top: 1.5vh;
        height: 7.5vh;
        padding: 0 1vh;
        z-index: 1;
        font-size: 1.2rem;
        width: 45vh;
        word-break: break-word;
        hyphens: manual;
    }

    .image-container{
        width: 40vh;
        height: 40vh;
        overflow: hidden;
        border-radius: 50%;
        margin-top: 1vh;
        border: .4vh solid #008000;
        box-shadow: 5px 5px 0px rgba(0,0,0,.3);
        

        img{
            position: relative;
            width: 40vh;
            z-index: 2;
        }
    }

    .more-info{
        z-index: 1;
        display: flex;
        gap: 1vh;
        margin-top: 1vh;
        font-family: 'Inter', sans-serif;
        width: 90%;
        justify-content: space-around;
        background-color: rgba(0, 0, 0, .6);
        border-radius: .5vh;
        padding: 1vh;
        box-sizing: border-box;
        color: #fff;
        text-decoration: underline;
    }

    .description{
        width: 95%;
        z-index: 1;
        font-family: 'Inter', sans-serif;
        font-size: .9rem;
        text-align: justify;
        text-shadow: 2px 2px 0px rgba(0,0,0,.3);
        color: #fff;
        background-color: rgba(0,0,0,.2);
        padding: .5vh 1vh;
        border-radius: .5vh;

        p{
            word-break: break-word;
            hyphens: manual;
            max-height: 12.5vh;
            overflow: auto;
            text-align: justify;

            &::-webkit-scrollbar-thumb{
                background-color: #7d7d7d;
            }
            &.golden::-webkit-scrollbar-track {
                background: #b5af8c;
            }
            &.silver::-webkit-scrollbar-track {
                background: #bbbbbb;
            }
            &.brown::-webkit-scrollbar-track {
                background: #a69e92;
            }
        }
    }
`