import styled from "styled-components"
import { convertToBRL } from "../hooks/useConvert"

const MiniPopup = ({valor}: { valor: string }) => {
    return (
        <MiniPopupStyle>
            <p className="simple-text">Valor atual: {convertToBRL(valor)}</p>
        </MiniPopupStyle>
    )
}
export default MiniPopup

const MiniPopupStyle = styled.div`
    width: 20vh;
    height: 5vh;
    background-color: var(--white);
    border: .3vh solid var(--black);
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
`