import styled from "styled-components"

const StartLogin = () => {
    return (
        <StartLoginStyle className="styled-container white">
            <h1 className="main-title">Pix Pioneiros do Advento</h1>
            <img src="/assets/images/icon.png"/>

            <div className="flex-bts">
                <a href="http://localhost:5174/redirect?for=http://localhost:5175"><button className="btn hoverAnim1">Fazer Login</button></a>
            </div>
        </StartLoginStyle>
    )
}
export default StartLogin

const StartLoginStyle = styled.section`
    width: 45vh;
    height: 75vh;
    display: flex;
    flex-direction: column;
    border-color: var(--fourth-color);
    box-shadow: 5px 5px 0px rgba(0,0,0,.3);

    img{
        width: 40vh;
        filter: drop-shadow(5px 5px 0px rgba(0,0,0,.7));
    }

    button{
        width: 40vh;
        height: 10vh;
        background-color: var(--first-color);
        color: var(--white);
        font-size: 2rem;
        font-weight: bolder;
    }
`