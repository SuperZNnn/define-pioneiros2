import styled from "styled-components"
import LoadingScreen from "../components/LoadingScreen"
import { useRef, useState } from "react"
import FormPart1, { type Part1Return } from "../components/BePathFinder/FormPart1"
import { getIdade } from "../hooks/useConvert"
import FormPart2, { type Part2Return } from "../components/BePathFinder/FormPart2"
import { UserEvents } from "../services/api"

const BePathfinderPage = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [formPart, setFormPart] = useState<number>(1)
    const [warn1, setWarn1] = useState<boolean>(false)
    const [warn2, setWarn2] = useState<boolean>(false)
    
    const form1Data = useRef<Part1Return>(null)
    const form2Data = useRef<Part2Return>(null)

    return (
        <BePathfinderStyle>
            <section>
                {!warn1 && !warn2 && formPart !== 3?<h2 className="main-title">Por favor, preecha seus dados corretamente!</h2>:null}
                {formPart === 3?<h2 className="main-title">Sucesso!</h2>:null}
            </section>

            <section className="part">
                <div style={{ opacity: formPart >= 1?'1':'.5' }}/>
                <div style={{ opacity: formPart >= 2?'1':'.5' }}/>
                <div style={{ opacity: formPart >= 3?'1':'.5' }}/>
            </section>

            {!warn1 && !warn2&&formPart===1?<FormPart1
                setIsLoading={setIsLoading}
                nxtStep={(data: Part1Return)=>{
                    if (getIdade(data.nascimento)>=16){
                        setWarn1(true)
                    }
                    if (!['timbauba', 'timbaúba'].includes(data.city.toLocaleLowerCase()) || data.state !== 'PE'){
                        setWarn2(true)
                    }
                    form1Data.current = data
                }}
            />:null}
            {!warn1 && !warn2&&formPart===2?<FormPart2
                nxtStep={(data: Part2Return) => {
                    form2Data.current = data
                    
                    UserEvents.bePathfinderNew({
                        bairro: form1Data.current?.bairro,
                        city: form1Data.current!.city,
                        name: form1Data.current!.name,
                        nascimento: form1Data.current!.nascimento,
                        rua: form1Data.current?.rua,
                        state: form1Data.current!.state,
                        email: form2Data.current.email,
                        phone: form2Data.current.phone,
                        respPhone: form2Data.current.isResp
                    })
                    .then(res=>{
                        if (res.status === 200) setFormPart(3)
                    })
                    .catch(err => {
                        console.log(err)
                    })
                }}
            />:null}
            {formPart === 3?<div className="success">
                <h3>&#10003;</h3>
                <h4 className="main-title">Em breve um de nossos líderes entrará em contato com você!</h4>
            </div>:null}

            {warn1?<div className="warn">
                <h2 className="second-title">Atenção</h2>
                <p className="simple-text">De acordo com a política do nosso clube, participantes com mais de 16 anos fazem parte da liderança. Por isso, é necessário ser um membro batizado da Igreja Adventista do Sétimo Dia.</p>

                <button className="btn" style={{ width: '100%', marginTop: '2vh', backgroundColor: 'var(--first-color)', color: 'var(--white)' }}
                    onClick={() => {
                        setWarn1(false)
                        if (!warn2) setFormPart(2)
                    }}
                >
                    Compreendo e desejo continuar
                </button>
                <button className="btn" style={{ width: '100%', marginTop: '1vh', backgroundColor: 'var(--fourth-color)' }}
                    onClick={() => {
                        setWarn1(false)
                    }}
                >
                    Cancelar
                </button>
            </div>:null}
            {warn2 && !warn1?<div className="warn">
                <h2 className="second-title">Oops</h2>
                <p className="simple-text">Pelo que vimos, você não é da nossa cidade. Sugerimos que visite <a href='https://clubes.adventistas.org/br/' target='_blank'><u>clubes.adventistas.org/br/</u></a> para encontrar um clube mais próximo de sua região. Caso decida continuar, é importante saber que nosso clube atua exclusivamente em Timbaúba - PE.</p>

                <button className="btn" style={{ width: '100%', marginTop: '2vh', backgroundColor: 'var(--first-color)', color: 'var(--white)' }}
                    onClick={() => {
                        setWarn2(false)
                        setFormPart(2)
                    }}
                >
                    Compreendo e desejo continuar
                </button>
                <button className="btn" style={{ width: '100%', marginTop: '1vh', backgroundColor: 'var(--fourth-color)' }}
                    onClick={() => {
                        setWarn2(false)
                    }}
                >
                    Cancelar
                </button>
            </div>:null}

            {isLoading?<LoadingScreen/>:null}
        </BePathfinderStyle>
    )
}
export default BePathfinderPage

const BePathfinderStyle = styled.main`
    width: 100vw;
    height: 100vh;
    background-color: var(--white);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 7vh 0;
    gap: 3vh;

    .success{
        width: 45vh;

        h3{
            position: relative;
            left: 50%;
            transform: translate(-50%);
            color: var(--white);
            background-color: var(--third-color);
            width: 15vh;
            height: 15vh;
            border-radius: 50%;
            font-size: 15vh;
            display: flex;
            justify-content: center;
            align-items: center;

            animation: successPopUp .5s ease-in-out forwards;
        }

        h4{
            font-size: 1rem;
        }
    }

    .warn{
        p{
            width: 40vh;
            font-size: 1rem;
            text-align: justify;
        }
    }

    .part{
        width: 45vh;
        display: flex;
        justify-content: center;
        gap: 1vh;

        div{
            width: 100%;
            height: .5vh;
            background-color: var(--first-color);
        }
    }
`