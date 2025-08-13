'use client'

import { useForm } from 'react-hook-form';
import ImageSlider from '../ImageSlider';
import style from './login.module.css';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { SsoEvents } from '@/services/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export const LoginScreen = () => {
    const router = useRouter()

    const schema = Yup.object({
        login: Yup.string().required('Insira seu login'),
        password: Yup.string().required('Insira sua senha'),
    });
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [disableButton, setDisableButton] = useState<boolean>(false)

    const onSubmit = (data: { login: string, password: string }) => {
        setDisableButton(true)
        SsoEvents.tryLogin(data.login, data.password)
        .then(res => {
            console.log(res)
        })
        .catch(err => {
            if (err.status === 404) setError('login', {message: 'Usuário não encontrado!'})
            else if (err.status === 401) setError('password', {message: 'Senha incorreta!'})
        })
        .finally(() => {
            setDisableButton(false)
        })
    };

    useEffect(() => {
        const checkSession = async () => {
            try{
                const res = await SsoEvents.verifySession()
                if (res.status === 200){
                    router.push('/profile')
                }
            }
            catch{

            }
        }
        checkSession()
    }, [router])

    return (
        <main className={style.main}>
            <section className={style.side_brand}>
                <ImageSlider />
                <h2 className='main-title'>Clube de Desbravadores</h2>
                <h1 className='main-title'>Pioneiros do Advento</h1>
                <p className='simple-text'>
                    O Clube de Desbravadores Pioneiros do Advento da Igreja
                    Adventista do Sétimo Dia de Cesar Augusto, foi fundado no 18
                    de agosto de 2012, com o seguinte pensamento Bíblico, Vós,
                    porém, sois raça eleita, sacerdócio real, nação santa, povo
                    de propriedade exclusiva de Deus, a fim de proclamardes as
                    virtudes daquele que vos chamou das trevas para sua
                    maravilhosa luz, I Pedro 2:9. O Clube participou de vários
                    eventos promovidos pelo próprio clube, pela Igreja local,
                    pelo Distrito, Pela Região, pela Área, Associação
                    Pernambucana, União Nordeste Brasileira e Divisão Sul
                    Americana, tais como, Quebrando o Silêncio, Camporis,
                    Acampamentos, caminhadas, congressos, desfiles, e entre
                    outros.
                </p>
            </section>

            <section className={style.side_actions}>
                <div className={style.form_container}>
                    <form
                        className={`${style.form} flex-container`}
                        style={{ flexDirection: 'column' }}
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <input
                            placeholder='Login'
                            className='ipt-basic hoverAnim1'
                            {...register('login')}
                        />
                        {errors.login&&<p className='simple-warn'>{errors.login.message}</p>}
                        <input
                            placeholder='Senha'
                            type='password'
                            className='ipt-basic hoverAnim1'
                            {...register('password')}
                        />
                        {errors.password&&<p className='simple-warn'>{errors.password.message}</p>}
                        <button className='btn hoverAnim1' type='submit' disabled={disableButton}>
                            Entrar
                        </button>
                        <a href='http://localhost:5174/redirect?for=http://localhost:4000&forgot=1'>
                            <p className={`simple-text ${style.forgotpassword}`}>Esqueceu a senha?</p>
                        </a>
                    </form>

                    <div className={`${style.create_account} flex-container`}>
                        <a href='http://localhost:5174/register'>
                            <button className='btn'>Criar nova conta</button>
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
};
