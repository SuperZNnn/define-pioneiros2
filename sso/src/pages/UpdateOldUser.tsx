import { useLocation } from "react-router-dom"
import { FinishRegisterStyle } from "./FinishRegister"
import { FormStyles } from "../components/forms/Login"
import { useForm } from "react-hook-form"
import * as Yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup"
import { useEffect, useState } from "react"
import { ApiRequests, UsersEvents } from "../services/api"

const UpdateOldPage = () => {
    const location = useLocation()

    const schema = Yup.object({
        login: Yup
            .string()
            .min(8, 'O login deve possuir ao menos 8 caractéres')
            .matches(/[!@#$%^&*()|<>]/,'A senha deve conter ao menos um caractere especial')
            .test(
                'no-invalid-sequence',
                'O login não pode começar com a sequência "#@#"',
                value => value ? !value.startsWith('#@#') : true
            )
            .required('Login é obrigatório'),
    })
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })

    const [customError, setCustomError] = useState<string | undefined>()

    const onSubmit = (data: { login: string }) => {
        if (data.login === location.state.user.login){
            setCustomError('O novo login deve ser diferente do anterior.')
            return
        }

        UsersEvents.changeLogin(data.login, location.state.user.origin_id)
        .then(() => {
            window.location.href = location.state.url
        })
        .catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        ApiRequests.getDisplay()
        .then(res => {
            const resData = res.data as { message: string, user: { display_name: string, is_old: number, login: string } }
            if (resData.user.is_old === 0){
                window.location.href = 'http://localhost:5173'
            }
        })
        .catch(err => {
            console.log(err)
        })
    }, [])

    return (
        <FinishRegisterStyle>
            <section>
                <h2 className="main-title">Atualize seu login</h2>
                <h4 className="second-title">Por questões de praticidade, precisamos que você atualize seu login<br/>Não use E-mail ou número de telefone</h4>
            </section>

            <FormStyles style={{ width: '45vh' }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="input-group">
                        <input className="ipt-basic border" {...register('login')} placeholder="Atualize seu login" type="text"
                            onChange={() => {
                                setCustomError(undefined)
                            }}
                        />
                        {errors.login && !customError?<p className="error-message simple-warn">{errors.login.message}</p>:null}
                        {customError?<p className="error-message simple-warn">{customError}</p>:null}
                    </div>
                    <button className="btn" style={{ backgroundColor: 'var(--first-color)', color: '#fff' }} type="submit">Atualizar</button>
                </form>
            </FormStyles>
        </FinishRegisterStyle>
    )   
}
export default UpdateOldPage