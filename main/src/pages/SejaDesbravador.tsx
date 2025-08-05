import styled from "styled-components"
import { FormStyles } from "./ProfilePage"
import LoadingScreen from "../components/LoadingScreen"
import { useRef, useState } from "react"
import CepInput from "../components/CepInput"
import { ApiRequests } from "../services/api"
import type { CepReturn } from "../types/user"

const BePathfinderPage = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const cityRef = useRef<HTMLInputElement>(null)
    const ufRef = useRef<HTMLSelectElement>(null)
    const bairroRef = useRef<HTMLInputElement>(null)

    return (
        <BePathfinderStyle>
            <section>
                <h2 className="main-title">Por favor, preecha seus dados corretamente!</h2>
            </section>

            <FormStyles style={{ width: '45vh' }}>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                    }}
                >
                    <h5 className="second-title" style={{ textAlign: 'left' }}>Dados Pessoais</h5>
                    <div className="input-group">
                        <input className="ipt-basic border" placeholder="Seu nome completo" type="text"/>
                    </div>
                    <div className="input-group">
                        <input type="date" placeholder="Seu nascimento" className="ipt-basic border"/>
                    </div>

                    <h5 className="second-title" style={{ textAlign: 'left' }}>Localização</h5>
                    <div className="input-group">
                        <CepInput
                            send={(cep: string) => {
                                if (cep.length === 9){
                                    setIsLoading(true)
                                    ApiRequests.fetchCep(cep)
                                    .then(res=> {
                                        const resData = res.data as CepReturn
                                        if (cityRef.current) cityRef.current.value = resData.localidade
                                        if (bairroRef.current) bairroRef.current.value = resData.bairro
                                        if (ufRef.current) ufRef.current.value = resData.uf
                                    })
                                    .catch(err => {
                                        console.log(err)
                                    })
                                    .finally(() => {
                                        setIsLoading(false)
                                    })
                                }
                            }}
                        />
                    </div>
                    <div className="input-group">
                        <div className="flex-container">
                            <input ref={cityRef} className="ipt-basic border" placeholder="Cidade" style={{ width: '30vh' }}/>
                            <select ref={ufRef} className="ipt-basic border" style={{ width: '12vh' }}>
                                <option value='-1' disabled selected>Estado</option>
                                <option value="AC">AC - Acre</option>
                                <option value="AL">AL - Alagoas</option>
                                <option value="AP">AP - Amapá</option>
                                <option value="AM">AM - Amazonas</option>
                                <option value="BA">BA - Bahia</option>
                                <option value="CE">CE - Ceará</option>
                                <option value="DF">DF - Distrito Federal</option>
                                <option value="ES">ES - Espírito Santo</option>
                                <option value="GO">GO - Goiás</option>
                                <option value="MA">MA - Maranhão</option>
                                <option value="MT">MT - Mato Grosso</option>
                                <option value="MS">MS - Mato Grosso do Sul</option>
                                <option value="MG">MG - Minas Gerais</option>
                                <option value="PA">PA - Pará</option>
                                <option value="PB">PB - Paraíba</option>
                                <option value="PR">PR - Paraná</option>
                                <option value="PE">PE - Pernambuco</option>
                                <option value="PI">PI - Piauí</option>
                                <option value="RJ">RJ - Rio de Janeiro</option>
                                <option value="RN">RN - Rio Grande do Norte</option>
                                <option value="RS">RS - Rio Grande do Sul</option>
                                <option value="RO">RO - Rondônia</option>
                                <option value="RR">RR - Roraima</option>
                                <option value="SC">SC - Santa Catarina</option>
                                <option value="SP">SP - São Paulo</option>
                                <option value="SE">SE - Sergipe</option>
                                <option value="TO">TO - Tocantins</option>
                            </select>
                        </div>
                    </div>
                    <div className="input-group">
                        <input className="ipt-basic border" placeholder="Bairro" ref={bairroRef} type="text"/>
                    </div>

                    <button className="btn" style={{ backgroundColor: 'var(--first-color)', color: '#fff' }} type="submit">Continuar</button>
                </form>
            </FormStyles>

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
    padding: 10vh 0;
    gap: 3vh;
`