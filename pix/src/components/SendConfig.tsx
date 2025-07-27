import { useRef, useState } from "react"
import styled from "styled-components"
import ValueInput from "./ValueInput"
import type { User } from "../types/user"

const SendModal = ({close, usersList, userId, maxValue, afterSend}: { afterSend: ({amount, to}: {amount:number, to: number}) => void ,maxValue: string, usersList: User[], userId: number, close: () => void }) => {
    const [outAnim, setOutAnim] = useState<boolean>(false)
    const [amount, setAmount] = useState(0) // valor em centavos
    const [error, setError] = useState("")
    const [showSuccess, setShowSuccess] = useState<boolean>(false)
    const [outSuccess, setOutSuccess] = useState<boolean>(false)

    const selectRef = useRef<HTMLSelectElement>(null)

    const handleClose = () => {
        setOutAnim(true)

        setTimeout(() => {
            close()
        }, 500);
    }

    const handleSend = () => {
        if (selectRef.current) selectRef.current.value = '-1'

        setShowSuccess(true)
        setTimeout(() => {
            setOutSuccess(true)

            setTimeout(() => {
                setShowSuccess(false)
                setOutSuccess(false)
            }, 500);
        }, 2500);
    }

    const handleSubmit = () => {
        const max = Math.round(parseFloat(maxValue.replace(',', '.')) * 100)
        if (!selectRef.current) return

        if (amount === 0){
            setError("Insira a quantia que você deseja enviar!")
            return
        }
        else if (amount > max) {
            setError("Você não tem essa quantia!")
            return
        }
        else if (selectRef.current && parseInt(selectRef.current.value) === -1){
            setError("Selecione para quem você quer enviar!")
            return
        }
        setError("")
        
        afterSend({ to: parseInt(selectRef.current.value), amount })
        handleSend()
    }

    return (
        <SendModalWrapper className={`${outAnim?'out':''}`}>
            <button className="close" onClick={handleClose}/>

            <div className={`wrapper ${outAnim?'out':''}`}>
                <div className="input-group">
                    <h5 className="second-title">Digite o valor que você deseja enviar!</h5>
                    <ValueInput onValueChange={setAmount} resetError={() => {setError("")}}/>

                    {error && error!=='Selecione para quem você quer enviar!' && <p className="simple-text" style={{ color: '#c10000', textAlign: 'center', fontSize: '1rem' }}>{error}</p>}
                </div>

                <div className="input-group">
                    <h5 className="second-title">Para quem deseja enviar?</h5>
                    <select className="ipt-basic" ref={selectRef}>
                        <option disabled selected className="second-title" value={-1}>Para quem deseja enviar?</option>
                        {usersList.filter(member => member.status === 1 && member.id !== userId).map(member => {
                            const bday = member.nascimento;
                            const birthDate = new Date(bday);
                            const currentDate = new Date();
                            
                            let age = currentDate.getFullYear() - birthDate.getFullYear();
                            
                            const isBirthdayPassed = 
                                currentDate.getMonth() > birthDate.getMonth() || 
                                (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() >= birthDate.getDate());
                            
                            if (!isBirthdayPassed) {
                                age--
                            }

                            return (
                                <option className="second-title" key={member.id} value={member.id}>{member.fullname.toUpperCase()} - {age} anos - {member.funcao}</option>
                            )
                        })}
                    </select>

                    {error && error==='Selecione para quem você quer enviar!' && <p className="simple-text" style={{ color: '#c10000', textAlign: 'center', fontSize: '1rem' }}>{error}</p>}
                </div>
                <div className="input-group btn">
                    <button className="btn hoverAnim1" style={{ backgroundColor: 'var(--second-color)', color: 'var(--white)' }} onClick={handleSubmit}>Enviar</button>
                    <button className="btn hoverAnim1" style={{ backgroundColor: 'var(--fourth-color)' }} onClick={handleClose}>Cancelar</button>
                </div>
            </div>
            
            {showSuccess?
            <div className={`success ${outSuccess?'out':''}`}>
                <h3>&#10003;</h3>
                <h4 className="main-title">Pix enviado!</h4>
            </div>
            :null}
            
        </SendModalWrapper>
    )
}
export default SendModal

const SendModalWrapper = styled.section`
    width: 100%;
    height: 100vh;
    background-color: rgba(0,0,0,.3);
    position: fixed;
    top: 0;
    left: 0;
    animation: fadein .5s forwards ease-in-out;
    display: flex;
    justify-content: center;
    align-items: center;

    .success{
        position: absolute;
        z-index: 3;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 3vh;

        &.out{
            animation: fadeout ease-in-out .5s forwards;
        }

        h3{
            position: relative;
            color: var(--white);
            background-color: var(--third-color);
            width: 30vh;
            height: 30vh;
            border-radius: 50%;
            font-size: 30vh;
            display: flex;
            justify-content: center;
            align-items: center;

            animation: successPopUp .5s ease-in-out forwards;
        }

        h4{
            color: var(--white);
            font-size: 2rem;
        }
    }

    &.out{
        animation: fadeout .5s forwards ease-in-out;
    }

    .wrapper,.success{
        width: 45vh;
        height: 60vh;
        background-color: var(--first-color);
        border-radius: 1vh;
        border: .3vh solid var(--black);
    }

    .wrapper{
        position: relative;
        z-index: 3;
        padding: 1vh;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        animation: modalShow ease-in-out .5s forwards;

        &.out{
            animation: modalHide ease-in-out .5s forwards;
        }

        .input-group{
            &.btn{
                display: flex;
                flex-direction: column;
                gap: 1vh;
                button{
                    height: 7.5vh;
                    font-size: 1.3rem;
                }
            }

            h5{
                color: var(--white)
            }
        }

        input, select{
            width: 100%;
        }

        button{
            width: 100%;
        }

        select{
            option{
                color: #fff;

                &:nth-child(odd){
                    background-color: var(--third-color)
                }
                &:nth-child(even){
                    background-color: var(--second-color)
                }
            }
        }
    }

    button.close{
        width: 100%;
        height: 100vh;
        background-color: transparent;
        border: none;
        outline: none;
        position: absolute;
        top: 0;
        left: 0;
    }

    @keyframes successPopUp {
        0%{
            opacity: 0;
            transform: scale(.3)
        }
        70%{
            opacity: 1;
            transform: scale(1.2)
        }
        100%{
            opacity: 1;
            transform: scale(1)
        }
    }
`