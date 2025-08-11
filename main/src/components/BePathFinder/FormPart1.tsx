import { FormStyles } from "../../pages/ProfilePage"
import CepInput from "./CepInput"
import { ApiRequests } from "../../services/api"
import type { CepReturn } from "../../types/user"
import { useForm } from "react-hook-form"
import * as Yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup"

export type Part1Return = {
    name: string,
    nascimento: string,
    city: string,
    state: string,
    bairro?: string,
    rua?: string
}

const FormPart1 = ({setIsLoading, nxtStep}: {
        setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
        nxtStep: (data: Part1Return) => void
    }) => {

    const schema = Yup.object({
        name: Yup.string().required('Obrigatório!'),
        nascimento: Yup.string().required('Data de nascimento é obrigatória!'),
        city: Yup.string().required('Insira sua cidade!'),
        state: Yup.string().required('Obrigatório').notOneOf(['-1'], 'Selecione um estado válido!'),
        bairro: Yup.string(),
        rua: Yup.string()
    })
    const { register, handleSubmit, formState: { errors }, setValue, setError } = useForm({
        resolver: yupResolver(schema)
    })

    const onSubmit = (data: Part1Return) => {
        nxtStep(data)
    }

    return (
        <FormStyles style={{ width: '45vh' }}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="noresp"
            >
                <h5 className="second-title" style={{ textAlign: 'left' }}>Dados Pessoais</h5>
                <div className="input-group noresp">
                    <input className="ipt-basic border" {...register('name')} placeholder="Seu nome completo" type="text"/>
                    {errors.name?<p className="error-message simple-warn">{errors.name.message}</p>:null}
                </div>
                <div className="input-group noresp">
                    <input type="date" placeholder="Seu nascimento" {...register('nascimento')} className="ipt-basic border"/>
                    {errors.nascimento?<p className="error-message simple-warn">{errors.nascimento.message}</p>:null}
                </div>

                <h5 className="second-title" style={{ textAlign: 'left' }}>Localização</h5>
                <div className="input-group noresp">
                    <CepInput
                        send={(cep: string) => {
                            if (cep.length === 9){
                                setIsLoading(true)
                                ApiRequests.fetchCep(cep)
                                .then(res=> {
                                    const resData = res.data as CepReturn
                                    setValue('city', resData.localidade)
                                    setValue('state', resData.uf)
                                    setValue('bairro', resData.bairro)
                                    setValue('rua', resData.logradouro)
                                })
                                .catch(err => {
                                    console.log(err)
                                })
                                .finally(() => {
                                    setError('city', { message: '' })
                                    setError('state', { message: '' })
                                    setIsLoading(false)
                                })
                            }
                        }}
                    />
                </div>
                <div className="input-group noresp">
                    <div className="flex-container">
                        <input {...register('city')} className="ipt-basic border" placeholder="Cidade" style={{ width: '30vh' }}/>
                        <select {...register('state')} className="ipt-basic border" style={{ width: '12vh' }}>
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
                        {errors.city?<p className="error-message simple-warn">{errors.city.message}</p>:null}
                        {errors.state && !errors.city?<p className="error-message simple-warn">{errors.state.message}</p>:null}
                    </div>
                </div>
                <div className="input-group noresp">
                    <input className="ipt-basic border" {...register('bairro')} placeholder="Bairro" type="text"/>
                </div>
                <div className="input-group noresp">
                    <input className="ipt-basic border" {...register('rua')} placeholder="Rua" type="text"/>
                </div>

                <button className="btn" style={{ backgroundColor: 'var(--first-color)', color: '#fff' }} type="submit">Continuar</button>
            </form>
        </FormStyles>
    )
}
export default FormPart1