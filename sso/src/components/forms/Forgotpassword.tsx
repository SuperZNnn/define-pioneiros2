import { useEffect, useRef } from "react"
import { FormStyles } from "./Login"
import * as Yup from 'yup'
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { ApiRequests } from "../../services/api"
import { useToasts } from "../../hooks/useToasts"
import type { User } from "../../types/users"

const ForgotPassword = ({setFormType, formType, setUser}: {setUser: (user: User) => void, setFormType: () => void, formType: boolean}) => {
    const { addToast } = useToasts()
    
    const containerRef = useRef<HTMLFormElement>(null)

    useEffect(() => {
        if (!formType){
            setTimeout(()=>{
                if (containerRef.current) containerRef.current.style.display = 'none'
            }, 100)
        }
        else{
            if (containerRef.current) containerRef.current.style.display = ''
        }
    }, [formType])

    const schema = Yup.object({
        login: Yup.string().required('O login é obrigatório!')
    })
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })
    
    const onSubmit = (data: { login: string }) => {
        ApiRequests.verifyLogin(data.login)
        .then(res => {
            const resData = res.data as { user: User }
            setUser(resData.user)
        })
        .catch(() => {
            addToast({ message: 'Usuário inválido', time: 3, type: 'error' })
        })
    }

    return (
        <FormStyles>
            <form
                ref={containerRef}
                style={{
                    animation: formType ? 
                    'fadein .1s ease-in-out forwards'
                    :'fadeout .1s ease-in-out forwards',
                    display: 'none',
                    height: '68vh'
                }}

                onSubmit={handleSubmit(onSubmit)}
            >
                <h2 className="main-title resp2">Esqueci minha senha</h2>

                <div className="actions">
                    <div className="input-group">
                        <input type="text" placeholder="Seu Login" className="ipt-basic resp1" {...register("login")}/>
                        {errors.login?<p className="error-message simple-warn">{errors.login.message}</p>:null}
                    </div>

                    <div className="flex-bts">
                        <button style={{ width: '45%' }} className="btn form resp1" type="submit">Recuperar senha</button>
                        <button style={{ width: '45%' }} className="btn form yellow resp1" onClick={setFormType} type="button">Fazer Login</button>
                    </div>
                </div>
            </form>
        </FormStyles>
    )
}
export default ForgotPassword