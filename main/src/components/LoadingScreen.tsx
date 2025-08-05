import styled from "styled-components"

const LoadingScreen = () => {
    return (
        <LoadingStyle>
            <img alt="Animação carregando" src="/assets/images/loading.gif"/>
            <h2 className="main-title">Carregando</h2>
        </LoadingStyle>
    )
}
export default LoadingScreen

const LoadingStyle = styled.section`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background-color: rgba(0,0,0,.3);
    z-index: 99;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    img{
        filter: drop-shadow(5px 5px 0px rgba(0,0,0,.3))
    }

    h2{
        color: #fff;
        text-shadow: 5px 5px 0px rgba(0,0,0,.3);
    }
`