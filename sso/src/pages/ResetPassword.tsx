import { useNavigate, useParams } from "react-router-dom"
import { FinishRegisterStyle } from "./FinishRegister"
import { FormStyles } from "../components/forms/Login"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from 'yup'
import { useEffect, useRef, useState } from "react"
import { ApiRequests, UsersEvents } from "../services/api"
import { useToasts } from "../hooks/useToasts"

const ResetPasswordPage = () => {
    const { name, token } = useParams()
    const { addToast } = useToasts()
    const navigate = useNavigate()

    useEffect(() => {
        ApiRequests.verifyToken(token!, 2, name!)
        .then(res=>{
            console.log(res)
        })
        .catch(() => {
            navigate('/', { state: { redirectUrl: 'http://localhost:5173' } })
            addToast({ message: 'Link inválido', type: 'error', time: 3 })
        })
    }, [])

    const schema = Yup.object({
        password: Yup
            .string()
            .min(8, 'A senha deve possuir ao menos 8 caractéres')
            .matches(/[A-Z]/,'A senha deve conter ao menos uma letra maiúscula')
            .matches(/[a-z]/, 'A senha deve conter ao menos uma letra minúscula')
            .matches(/[!@#$%^&*(),.?":{}|<>]/, 'A senha deve conter ao menos um caractere especial')
            .matches(/[0-9]/, 'A senha deve conter ao menos um número')
            .test(
                'no-invalid-sequence',
                'A senha não pode começar com a sequência "#@#"',
                value => value ? !value.startsWith('#@#') : true
            )
            .required('Senha é obrigatória'),
        c_password: Yup
            .string()
            .required('Confirme sua senha')
            .oneOf([Yup.ref('password')], 'Os campos não coincidem'),
    })
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })

    const [viewPassword, setViewPassword] = useState<boolean>(false)

    const buttonRef = useRef<HTMLButtonElement>(null)

    const onSubmit = (data: { password: string, c_password: string }) => {
        if (buttonRef.current) buttonRef.current.disabled = true

        UsersEvents.resetPassword(token!, data.password)
        .then(res => {
            const resData = res.data as { message: string, user: { origin_id: number; login: string; password: string; display_name: string | null; is_old: number; } }

            if (res.status === 200){
                if (resData.user.is_old === 1){
                    navigate('/oldupdate', { state: { url: `http://localhost:5173/show/${resData.user.origin_id}`, user: resData.user }})
                }
                else{
                    window.location.href = `http://localhost:5173/show/${resData.user.origin_id}`
                }
            }
        })
        .catch(err => {
            if (buttonRef.current) buttonRef.current.disabled = false
            console.log(err)
        })
    }

    return (
        <FinishRegisterStyle>
            <section>
                <h2 className="main-title">Altere sua senha</h2>
                <h4 className="second-title">Olá, {name}</h4>
            </section>

            <FormStyles style={{ width: '45vh' }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="input-group">
                        <input className="ipt-basic border" placeholder="Crie sua nova senha" type={viewPassword?'text':'password'} {...register('password')}/>

                        <img className="view-icon" alt="ver senha" src={`/assets/images/${viewPassword?'view':'hide'}.png`} title={`${viewPassword?'Esconder':'Ver'} senha`} onClick={() => {setViewPassword(prev => !prev)}}/>

                        {errors.password?<p className="error-message simple-warn">{errors.password.message}</p>:null}
                    </div>

                    <div className="input-group">
                        <input className="ipt-basic border" placeholder="Confirme sua nova senha" type={viewPassword?'text':'password'} {...register('c_password')}/>

                        {errors.c_password?<p className="error-message simple-warn">{errors.c_password.message}</p>:null}
                    </div>

                    <button ref={buttonRef} className="btn" style={{ backgroundColor: 'var(--first-color)', color: '#fff' }} type="submit">Mudar senha</button>
                </form>
            </FormStyles>
        </FinishRegisterStyle>
    )
}
export default ResetPasswordPage