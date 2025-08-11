import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { styled } from 'styled-components'
import FormWrapper from '../components/forms/FormWrapper'

const HomePage = () => {
    const location = useLocation()

    useEffect(() => {
        if (!location.state){
            window.location.href = 'https://pioneirosdoadvento.com'
        }
    }, [])

    return (
        <PageStyle>
            <FormWrapper/>
        </PageStyle>
    )
}
export default HomePage

const PageStyle = styled.main`
    background-image: url('https://pioneirosdoadvento.com/assets/images/sso_bg.jpg');
    background-position: center;
    background-size: cover;
    width: 100vw;
    height: 100vh;

    display: flex;
    justify-content: center;
    align-items: center;
`