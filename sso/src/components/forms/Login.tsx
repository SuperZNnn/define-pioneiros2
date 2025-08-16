import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import * as Yup from 'yup';
import { UsersEvents } from '../../services/api';
import { useToasts } from '../../hooks/useToasts';
import { googleLogin } from '../../hooks/useAuth';

const LoginForm = ({
    setFormType,
    formType,
}: {
    setFormType: () => void;
    formType: boolean;
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { addToast } = useToasts();

    const containerRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (formType) {
            setTimeout(() => {
                if (containerRef.current)
                    containerRef.current.style.display = 'none';
            }, 100);
        } else {
            if (containerRef.current) containerRef.current.style.display = '';
        }
    }, [formType]);

    const schema = Yup.object({
        login: Yup.string().required('O login é obrigatório!'),
        password: Yup.string().required('A senha é obrigatória!'),
    });
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data: { login: string; password: string }) => {
        UsersEvents.Login(data.login, data.password)
            .then((res) => {
                if (res.status === 200) {
                    addToast({
                        message: 'Logado com sucesso!',
                        type: 'success',
                        time: 3,
                    });
                    const resData = res.data as {
                        message: string;
                        user: {
                            display_name: string;
                            login: string;
                            origin_id: number;
                            password: string;
                            is_old: number;
                        };
                    };

                    const redirectUrl = location.state.redirectUrl as string;
                    if (/\/show\/\d+\/?$/.test(redirectUrl)) {
                        const newUrl = redirectUrl.replace(
                            /(\/show\/)\d+/,
                            `$1${resData.user.origin_id}`,
                        );

                        if (resData.user.is_old === 1) {
                            navigate('/oldupdate', {
                                state: { url: newUrl, user: resData.user },
                            });
                        } else {
                            window.location.href = newUrl;
                        }
                    } else {
                        if (resData.user.is_old === 1) {
                            navigate('/oldupdate', {
                                state: { url: redirectUrl, user: resData.user },
                            });
                        } else {
                            window.location.href = redirectUrl;
                        }
                    }
                }
            })
            .catch((err) => {
                if (err.status === 401) {
                    addToast({
                        message: 'Senha incorreta',
                        type: 'error',
                        time: 3,
                    });
                } else if (err.status === 404) {
                    addToast({
                        message: 'Usuário não encontrado',
                        type: 'error',
                        time: 3,
                    });
                } else {
                    addToast({
                        message: 'Erro interno! Por favor tente novamente',
                        type: 'error',
                        time: 3,
                    });
                }
            });
    };

    return (
        <FormStyles>
            <form
                ref={containerRef}
                style={{
                    animation: !formType
                        ? 'fadein .1s ease-in-out forwards'
                        : 'fadeout .1s ease-in-out forwards',
                    display: 'none',
                    height: '68vh',
                }}
                onSubmit={handleSubmit(onSubmit)}
            >
                <h2 className='main-title resp2'>Login</h2>

                <div className='actions'>
                    <div className='input-group'>
                        <input
                            type='text'
                            placeholder='Seu Login'
                            className='ipt-basic resp1'
                            {...register('login')}
                        />
                        {errors.login ? (
                            <p className='error-message simple-warn'>
                                {errors.login.message}
                            </p>
                        ) : null}
                    </div>
                    <div className='input-group'>
                        <input
                            type='password'
                            placeholder='Sua senha'
                            className='ipt-basic resp1'
                            {...register('password')}
                        />
                        {errors.password ? (
                            <p className='error-message simple-warn'>
                                {errors.password.message}
                            </p>
                        ) : null}
                    </div>

                    <div className='flex-bts'>
                        <button className='btn form resp1' type='submit'>
                            Fazer Login
                        </button>
                        <button
                            type='button'
                            className='btn form yellow resp1'
                            onClick={() => {
                                window.open('http://localhost:4000/register')
                            }}
                        >
                            Registre-se
                        </button>
                    </div>
                    <p
                        className='redirect simple-warn underline-anim'
                        onClick={setFormType}
                    >
                        Esqueci minha senha
                    </p>
                </div>

                <div className='third-ways'>
                    <h3 className='second-title'>Continue com:</h3>
                    <button
                        type='button'
                        className='third-party'
                        onClick={() => {
                            googleLogin((data) => {
                                UsersEvents.firebaseLogin(data.user.accessToken)
                                    .then((res) => {
                                        const resData = res.data as {
                                            message: string;
                                            user: {
                                                id: number;
                                                reg_users: {
                                                    display_name: string;
                                                    is_old: number;
                                                    login: string;
                                                    origin_id: number;
                                                    password: string;
                                                };
                                                is_old: number;
                                            };
                                        };
                                        resData.user.is_old = 0;

                                        if (
                                            res.status === 200 ||
                                            res.status === 201
                                        ) {
                                            const redirectUrl = location.state
                                                .redirectUrl as string;
                                            if (
                                                /\/show\/\d+\/?$/.test(
                                                    redirectUrl,
                                                )
                                            ) {
                                                const newUrl =
                                                    redirectUrl.replace(
                                                        /(\/show\/)\d+/,
                                                        `$1${resData.user.id}`,
                                                    );

                                                if (resData.user.is_old === 1) {
                                                    navigate('/oldupdate', {
                                                        state: {
                                                            url: newUrl,
                                                            user: resData.user,
                                                        },
                                                    });
                                                } else {
                                                    window.location.href =
                                                        newUrl;
                                                }
                                            } else {
                                                if (resData.user.is_old === 1) {
                                                    navigate('/oldupdate', {
                                                        state: {
                                                            url: redirectUrl,
                                                            user: resData.user,
                                                        },
                                                    });
                                                } else {
                                                    window.location.href =
                                                        redirectUrl;
                                                }
                                            }
                                        }
                                    })
                                    .catch((err) => {
                                        if (err.status === 404) {
                                            addToast({
                                                message:
                                                    'E-mail não cadastrado',
                                                type: 'error',
                                                time: 3,
                                            });
                                        }
                                    });
                            });
                        }}
                    >
                        <img
                            src='https://pioneirosdoadvento.com/assets/images/google_logo.png'
                            alt='Login com google'
                        />
                    </button>
                </div>
            </form>
        </FormStyles>
    );
};
export default LoginForm;

export const FormStyles = styled.div`
    form {
        padding: 1vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 1vh;

        @media (max-width: 650px) {
            height: 33vh !important;
        }
    }

    .input-group {
        height: 9.5vh;

        @media (max-width: 650px) {
            height: 7vh;
        }

        input {
            width: 100%;
        }

        p.error-message {
            color: #5e1111;
            position: relative;
            text-align: center;
        }

        .view-icon {
            position: absolute;
            transform: translate(-4vh, 1vh);
            width: 3vh;
            cursor: pointer;
        }
    }
    button.form {
        width: 100%;
        background-color: var(--second-color);
        color: #fff;

        &:hover {
            background-color: var(--first-color);
        }

        &.yellow {
            background-color: var(--fourth-color);
            color: var(--black);

            &:hover {
                background-color: #b48700;
            }
        }
    }

    .third-ways {
        margin-top: 2vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1vh;

        @media (max-width: 650px) {
            margin-top: 1vh;
        }

        h3 {
            font-size: 0.9rem;
        }
    }

    button.third-party {
        width: 10vh;
        border: none;
        border-radius: 0.5vh;
        transition: 0.2s;
        cursor: pointer;

        @media (max-width: 650px) {
            width: 6vh;
            height: 6vh;
        }

        &:hover {
            background-color: #d8d8d8;
        }

        img {
            width: 10vh;

            @media (max-width: 650px) {
                width: 6vh;
            }
        }
    }

    p.redirect {
        text-align: right;
    }
`;
