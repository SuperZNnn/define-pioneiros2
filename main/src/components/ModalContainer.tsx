import { useState, type ReactNode } from "react";
import styled from "styled-components";

const ModalContainer = ({children, close, color}: { color?: 'white';close?: () => void; children: (handleClose: () => void) => ReactNode;}) => {
    const [outAnim, setOutAnim] = useState<boolean>(false)
    
    const handleClose = () => {
        setOutAnim(true)

        setTimeout(() => {
            if (close) close()
        }, 500);
    }

    return (
        <main className="modal"
            style={{
                width: '100%',
                height: '100vh',
                backgroundColor: 'rgba(0,0,0,.3)',
                position: 'fixed',
                top: '0',
                left: '0',
                animation: `${outAnim?'fadeout':'fadein'} .5s ease-in-out forwards`,
                display: 'flex',
                alignItems: 'center'
            }}
        >
            <button
                style={{
                    width: '100%',
                    height: '100vh',
                    backgroundColor: 'rgba(0,0,0,.3)',
                    position: 'absolute',
                    top: '0',
                    left: '0'
                }}

                onClick={handleClose}
            />

            <ModalStyle className="space-between" out={outAnim} color={color}>
                {children(handleClose)}
            </ModalStyle>

        </main>
    )
}
export default ModalContainer

export const ModalStyle = styled.section<{ out: boolean, color?: string }>`
    background-color: ${({color}) => color?`
        ${color==='white'?'#969696':null}
    `:'#f1ca52'};

    padding: 2vh;;
    min-width: 47vh;
    min-height: 20vh;
    max-height: 90vh;
    overflow: auto;

    border: .3vh solid ${({color}) => color?`
        ${color==='white'?'var(--white)':null}
    `:'var(--fourth-color)'};
    padding: 2vh;

    animation: ${({out}) => out?'formHide':'formShow'} .5s ease-in-out forwards;
    left: 50%;
    position: relative;

    &.space-between{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    h5{
        font-size: 1rem;
    }
`