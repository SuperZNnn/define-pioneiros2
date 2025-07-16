import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { type User } from "../types/user"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ApiRequests } from "../services/api"
import { useAuth } from "../hooks/useAuth"

const MemberModal = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { getUser } = useAuth()
    
    const [outAnim, setOutAnim] = useState<boolean>(false)
    const [user, setUser] = useState<User>()
    const [userAge, setUserAge] = useState<number>(0)
    const [userType, setUserType] = useState<number>(3)
    const [sessionUser, setSessionUser] = useState<number | undefined>()

    useEffect(() => {
        ApiRequests.getAllMembers()
        .then(res => {
            const foundedUser = res.find(user => user.id === Number(id))
            setUser(foundedUser)
        })
        .catch(err => {
            console.log(err)
        })

        getUser()
        .then(res=>{
            setSessionUser(res)
        })
    }, [])
    useEffect(() => {
        if (user){
            // SetAge
            const bday = user.nascimento
            const birthDate = new Date(bday);
            const currentDate = new Date();
            let age = currentDate.getFullYear() - birthDate.getFullYear();
            const isBirthdayPassed = 
                currentDate.getMonth() > birthDate.getMonth() || 
                (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() >= birthDate.getDate());

            if (!isBirthdayPassed) {
                
                age--
            }
            setUserAge(age)

            // SetType
            if (
                user.funcao === 'Diretor' ||
                user.funcao === 'Diretora' ||
                user.funcao === 'Diretor Associado' ||
                user.funcao === 'Diretora Associada'
            ) setUserType(1)
            else if (
                user.funcao !== 'Desbravador' &&
                user.funcao !== 'Desbravadora'
            ) setUserType(2)
            else setUserType(3)

            // Get Display
            ApiRequests.getAllMembersDisplay()
            .then(res => {
                const foundedUserDisplay = res.find(item => item.origin_id === Number(id))
                if (NameInputRef.current && foundedUserDisplay?.display_name){
                    NameInputRef.current.innerHTML = foundedUserDisplay?.display_name.toUpperCase()
                }
            })
            .catch(err => {
                console.log(err)
            })
        }
    }, [user])

    const NameInputRef = useRef<HTMLHeadingElement>(null)

    const mClose = () => {
        setOutAnim(true)

        setTimeout(() => {
            navigate('/')
        }, 250)
    }

    return (
        <MemberModalContainer className={`${outAnim?'out':''}`} >
            <button style={{ position: 'fixed', top: '0', left: '0' , width: '100vw', height: '100vh', background: 'transparent', border: 'none', outline: 'none'}}
                onClick={mClose}
            />
            <div className={`member-modal ${outAnim?'out':''}`}>
                <div className="modal-background" style={{backgroundColor: 
                    `${userType===1?'rgba(255,215,0,.2)':''}
                    ${userType===2?'rgba(255,255,255,.4)':''}
                    ${userType===3?'rgba(195,176,145,.5)':''}`
                }}/>

                <div className="close-modal"
                    onClick={mClose}
                >
                    X
                </div>

                <div className="img-container">
                    {!sessionUser?<a className="edit" href={`http://localhost:5174/redirect?for=http://localhost:5173/show/${user?.id}`}>
                        <img src="/assets/images/edit-icon.png"/>
                    </a>:null}
                    {sessionUser && sessionUser === user?.id?<Link to='/profile' className="edit">
                        <img src="/assets/images/edit-icon.png"/>
                    </Link>:null}
                    <img className="photo" src={`${user?.photo?`data:image/jpeg;base64,${user.photo}`:'https://pioneirosdoadvento.com/assets/images/default_user.jpg'}`} alt="Perfil" />
                </div>
                <h3 ref={NameInputRef}>{user?.fullname??'Carregando'}</h3>
                <div className="more-info">
                    <p>{userAge} Anos</p>
                    <p>{user?.funcao}</p>
                </div>
            </div>
        </MemberModalContainer>
    )
}
export default MemberModal

const MemberModalContainer = styled.section`
    width: 100%;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 5;

    background-color: rgba(0,0,0,.3);
    animation: fadein .5s ease-in-out forwards;
    &.out{
        animation: fadeout .25s ease-in-out forwards;
    }

    display: flex;
    align-items: center;

    .member-modal{
        width: 45vh;
        height: 70vh;
        background-image: url('https://pioneirosdoadvento.com/assets/images/bg.png');
        background-position: center;
        background-size: cover;

        animation: formShow .5s ease-in-out forwards;
        &.out{
            animation: formHide .25s ease-in-out forwards;
        }
        
        position: relative;
        left: 50%;
        transform: translateX(-50%);

        display: flex;
        align-items: center;
        flex-direction: column;

        box-shadow: 5px 5px 0px rgba(0,0,0,.7);

        .img-container{
            width: 40vh;
            height: 40vh;
            overflow: hidden;
            border-radius: 50%;
            margin-top: 1vh;
            border: .4vh solid #008000;
            box-shadow: 5px 5px 0px rgba(0,0,0,.3);

            img.photo{
                width: 40vh;
            }
            .edit{
                position: absolute;
                width: 40vh;
                height: 40vh;
                border-radius: 50%;
                background-color: rgba(217, 164, 4, .4);
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                opacity: 0;
                transition: .2s;

                &:hover{
                    opacity: 1;
                }

                img{
                    width: 10vh;
                }
            }
        }

        h3{
            font-family: 'Inter', sans-serif;
            text-align: center;
            margin-top: 2vh;
            height: 7.5vh;
            padding: 0 1vh;
        }

        .more-info{
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

            word-break: break-word;
            hyphens: manual;
            max-height: 13vh;
            overflow: auto;
            text-align: justify;
        }

        .social{
            display: flex;
            gap: 2vh;
            margin-top: 2vh;
            a{
                img{
                    width: 5vh;
                    height: 5vh;
                    transition: .2s;

                    &:hover{
                        transform: scale(1.1);
                    }
                }
            }
        }

        .modal-background{
            position: absolute;
            width: 100%;
            height: 70vh;
            top: 0;
            left: 0;
            z-index: -1;
        }

        .close-modal{
            position: absolute;
            transform: translate(-20vh, .6vh);
            font-family: 'Inter', sans-serif;
            font-weight: bolder;
            cursor: pointer;
            font-size: 3vh;
            border: .3vh solid #000;
            padding: 0 .5vh;
            border-radius: 1vh;
            transition: .2s;

            &:hover{
                background-color: #000;
                color: #fff;
            }
        }
    }
`