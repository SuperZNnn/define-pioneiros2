import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormStyles } from '../components/forms/Login';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ApiRequests, UsersEvents } from '../services/api';
import { useToasts } from '../hooks/useToasts';

const FinishRegisterPage = () => {
    const { name, token } = useParams();
    const { addToast } = useToasts();
    const navigate = useNavigate();

    useEffect(() => {
        ApiRequests.verifyToken(token!, 1, name!)
            .then((res) => {
                const resData = res.data as {
                    message: string;
                    token: {
                        owner_id: number;
                        token: string;
                        token_type: number;
                        expires_at: Date;
                    };
                };
                setUserId(resData.token.owner_id);
            })
            .catch(() => {
                navigate('/');
                addToast({ message: 'Link inválido', type: 'error', time: 3 });
            });
    }, []);

    const [viewPassword, setViewPassword] = useState<boolean>(false);
    const [userId, setUserId] = useState<number | undefined>();

    const schema = Yup.object({
        display_name: Yup.string(),
        login: Yup.string()
            .min(8, 'O login deve possuir ao menos 8 caractéres')
            .matches(
                /[!@#$%^&*()|<>]/,
                'A senha deve conter ao menos um caractere especial',
            )
            .test(
                'no-invalid-sequence',
                'O login não pode começar com a sequência "#@#"',
                (value) => (value ? !value.startsWith('#@#') : true),
            )
            .required('Login é obrigatório'),
        password: Yup.string()
            .min(8, 'A senha deve possuir ao menos 8 caractéres')
            .matches(
                /[A-Z]/,
                'A senha deve conter ao menos uma letra maiúscula',
            )
            .matches(
                /[a-z]/,
                'A senha deve conter ao menos uma letra minúscula',
            )
            .matches(
                /[!@#$%^&*(),.?":{}|<>]/,
                'A senha deve conter ao menos um caractere especial',
            )
            .matches(/[0-9]/, 'A senha deve conter ao menos um número')
            .test(
                'no-invalid-sequence',
                'A senha não pode começar com a sequência "#@#"',
                (value) => (value ? !value.startsWith('#@#') : true),
            )
            .required('Senha é obrigatória'),
        c_password: Yup.string()
            .required('Confirme sua senha')
            .oneOf([Yup.ref('password')], 'Os campos não coincidem'),
    });
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });
    const onSubmit = (data: {
        display_name?: string;
        login: string;
        password: string;
        c_password: string;
    }) => {
        if (userId) {
            UsersEvents.createAccount(
                userId,
                data.login,
                data.password,
                data.display_name,
            )
                .then((res) => {
                    if (res.status === 201) {
                        setUserId(undefined);
                        addToast({
                            message: 'Registrado com sucesso!',
                            type: 'success',
                            time: 3,
                        });
                        window.location.href = 'http://localhost:5173';
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    return (
        <FinishRegisterStyle>
            <section>
                <h2 className='main-title'>Continue seu registro</h2>
                <h4 className='second-title'>Olá, {name}</h4>
            </section>

            <FormStyles style={{ width: '45vh' }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='input-group'>
                        <input
                            className='ipt-basic border'
                            {...register('display_name')}
                            placeholder='Insira seu nome de exibição'
                            type='text'
                        />
                        {errors.display_name ? (
                            <p className='error-message simple-warn'>
                                {errors.display_name.message}
                            </p>
                        ) : null}
                    </div>
                    <div className='input-group'>
                        <input
                            className='ipt-basic border'
                            {...register('login')}
                            placeholder='Crie seu Login'
                            type='text'
                        />
                        {errors.login ? (
                            <p className='error-message simple-warn'>
                                {errors.login.message}
                            </p>
                        ) : null}
                    </div>
                    <div className='input-group'>
                        <input
                            className='ipt-basic border'
                            {...register('password')}
                            placeholder='Crie sua Senha'
                            type={`${viewPassword ? 'text' : 'password'}`}
                        />

                        <img
                            className='view-icon'
                            alt='ver senha'
                            src={`/assets/images/${viewPassword ? 'view' : 'hide'}.png`}
                            title={`${viewPassword ? 'Esconder' : 'Ver'} senha`}
                            onClick={() => {
                                setViewPassword((prev) => !prev);
                            }}
                        />

                        {errors.password ? (
                            <p className='error-message simple-warn'>
                                {errors.password.message}
                            </p>
                        ) : null}
                    </div>
                    <div className='input-group'>
                        <input
                            className='ipt-basic border'
                            {...register('c_password')}
                            placeholder='Confirme sua Senha'
                            type={`${viewPassword ? 'text' : 'password'}`}
                        />
                        {errors.c_password ? (
                            <p className='error-message simple-warn'>
                                {errors.c_password.message}
                            </p>
                        ) : null}
                    </div>
                    <button
                        className='btn'
                        disabled={!userId}
                        style={{
                            backgroundColor: 'var(--first-color)',
                            color: '#fff',
                        }}
                        type='submit'
                    >
                        Criar conta
                    </button>
                </form>
            </FormStyles>
        </FinishRegisterStyle>
    );
};
export default FinishRegisterPage;

export const FinishRegisterStyle = styled.main`
    width: 100vw;
    height: 100vh;
    background-color: var(--white);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15vh 0;
    gap: 3vh;
`;
