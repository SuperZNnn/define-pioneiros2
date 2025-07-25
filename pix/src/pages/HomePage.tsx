import { useEffect } from "react"
import styled from "styled-components"
import { ApiRequests } from "../services/api"

const HomePage = () => {
    useEffect(() => {
        ApiRequests.getSession()
        .then(res => {
            console.log(res)
        })
        .catch(err => {
            console.log(err)
        })
    }, [])

    return (
        <HomePageStyle>

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
`