import { useForm } from "react-hook-form"
import { formatInputPhone, PhoneStringToNumber } from "../../hooks/useConvert"
import { FormStyles } from "../../pages/ProfilePage"
import * as Yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup"

export type Part2Return = { phone: string, email?: string, isResp?: boolean }

const FormPart2 = ({nxtStep}: {
        nxtStep: (data: Part2Return) => void
    }) => {
    const schema = Yup.object({
        phone: Yup.string().required('Obrigatório!'),
        email: Yup.string().email('E-mail inválido!'),
        isResp: Yup.boolean()
    })
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
        resolver: yupResolver(schema)
    })
    
    const onSubmit = (data: Part2Return) => {
        nxtStep({phone: PhoneStringToNumber(data.phone), email: data.email, isResp: data.isResp})
    }

    return (
        <FormStyles style={{ width: '45vh' }}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="noresp"
            >
                <h5 className="second-title" style={{ textAlign: 'left' }}>Contato</h5>

                <div className="input-group noresp">
                    <input
                        className="ipt-basic border"
                        inputMode="numeric"
                        {...register('phone')}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const formatted = formatInputPhone(e.target.value)
                            setValue('phone', formatted)
                        }}
                        placeholder="Telefone para contato"
                        value={watch('phone')}
                    />
                    {errors.phone?<p className="error-message simple-warn">{errors.phone.message}</p>:null}

                    <div className="checkbox-container" style={{
                        display: 'flex',
                        marginTop: '1vh',
                        gap: '1vh'
                    }}>
                        <div className="custom-checkbox">
                            <input type="checkbox" id="is-resp" {...register('isResp')}/>
                            <label htmlFor="is-resp"/>
                        </div>
                        <label htmlFor="is-resp" className="simple-text">Contato de um responsável</label>
                    </div>  
                </div>
                <div className="input-group noresp">
                    <input
                        className="ipt-basic border"
                        {...register('email')}
                        placeholder="E-mail para contato"
                    />
                    {errors.email?<p className="error-message simple-warn">{errors.email.message}</p>:null}
                </div>

                <button className="btn" style={{ backgroundColor: 'var(--first-color)', color: '#fff' }} type="submit">Continuar</button>
            </form>
        </FormStyles>
    )
}
export default FormPart2