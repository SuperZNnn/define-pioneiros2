import { useEffect, useState } from "react"
import styled from "styled-components"
import { ApiRequests } from "../services/api"
import StartLogin from "../components/StartLogin"
import PixManager from "../components/PixManager"

const HomePage = () => {
    const [user, setUser] = useState<number>()

    useEffect(() => {
        ApiRequests.getSession()
        .then(res => {
            setUser(res.data.user.userId)
        })
        .catch(err => {
            console.log(err)
        })
    }, [])

    return (
        <HomePageStyle>
            

            {user?
                <PixManager
                    userId={user}
                    quitSession={() => {
                        ApiRequests.DestroySession()
                        .then(() => {
                            setUser(undefined)
                        })
                        .catch(err => {
                            console.log(err)
                        })
                    }}
                />:
                <StartLogin/>
            }
        </HomePageStyle>
    )
}
export default HomePage

const HomePageStyle = styled.main`
    background-image: url('/assets/images/bg.png');
    background-position: center;
    background-size: cover;
    width: 100%;
    height: 100vh;

    display: flex;
    justify-content: center;
    align-items: center;
`