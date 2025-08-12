import { useEffect, useState } from 'react';
import styled from 'styled-components';
import LoginForm from './Login';
import ForgotPassword from './Forgotpassword';
import ImageSlider from '../ImageSlider/ImageSlider';
import MemberCard from '../MemberCard';
import { type User } from '../../types/users';
import WaySelector from '../WaySelector';

const FormWrapper = () => {
    const [formType, setFormType] = useState<boolean>(false);
    const [showUser, setShowUser] = useState<User | undefined>();

    useEffect(() => {
        if (!formType) setShowUser(undefined);
    }, [formType]);

    return (
        <FormStyle invert={formType}>
            <div className='side-info container'>
                {showUser ? (
                    <div className='user-wrapper'>
                        <div className='member-card-wrapper'>
                            <MemberCard border={true} user={showUser} />
                        </div>
                        <div className='way-selector-wrapper'>
                            <WaySelector to='recover' user={showUser} />
                        </div>
                    </div>
                ) : (
                    <>
                        <ImageSlider />
                        <div className='lore'>
                            <h3 className='main-title'>Sobre</h3>
                            <p
                                className='simple-text'
                                style={{ textAlign: 'justify' }}
                            >
                                O clube de desbravadores é um programa religioso
                                centrado no tripé físico-mental-espiritual, que
                                desenvolve atividades para atender às
                                necessidades e interesses de crianças e
                                adolescentes (juvenis) entre 10 e 15 anos de
                                idade, com foco específico nesta faixa etária.
                            </p>
                        </div>
                    </>
                )}
            </div>
            <div className='form-container container'>
                <ForgotPassword
                    setUser={(user: User) => {
                        setShowUser(user);
                    }}
                    setFormType={() => {
                        setFormType(false);
                    }}
                    formType={formType}
                />
                <LoginForm
                    setFormType={() => {
                        setFormType(true);
                    }}
                    formType={formType}
                />
            </div>
        </FormStyle>
    );
};
export default FormWrapper;

const FormStyle = styled.section<{ invert: boolean }>`
    width: 90vh;
    height: 70vh;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: transform 0.3s ease;
    background-color: rgba(218, 218, 218, 0.4);

    border: 0.3vh solid var(--white);
    border-radius: 0.5vh;
    overflow: hidden;

    @media (max-width: 650px) {
        flex-direction: column;
        justify-content: flex-start;
        width: 45vh;
    }

    .user-wrapper {
        @media (max-width: 650px) {
            display: flex;
        }
    }
    .member-card-wrapper {
        transform: scale(0.7) translateY(-12vh);

        @media (max-width: 650px) {
            transform: scale(0.45) translate(10vh, -39vh);
        }
    }
    .way-selector-wrapper {
        width: 100%;
        transform: translateY(-21.5vh) scale(0.7);

        @media (max-width: 650px) {
            width: 30vh;
            transform: scale(0.7) translate(-16.5vh, 0vh);
        }
    }

    .container {
        width: 45vh;
        height: 70vh;
        transition: transform 0.3s ease;

        @media (max-width: 650px) {
            height: 35vh;
        }
    }

    .side-info {
        background-color: var(--white);
        transform: ${({ invert }) =>
            invert ? 'translate(45vh, 0)' : 'translate(0, 0)'};
        position: relative;
        z-index: 1;

        display: flex;
        justify-content: space-evenly;
        align-items: center;
        flex-direction: column;

        .lore {
            padding: 1vh;

            @media (max-width: 650px) {
                padding: 0 1vh;
            }
        }

        @media (max-width: 650px) {
            transform: ${({ invert }) =>
                invert ? 'translate(0, 35vh)' : 'translate(0, 0)'};
        }
    }

    .form-container {
        transform: ${({ invert }) =>
            invert ? 'translate(-45vh, 0)' : 'translate(0, 0)'};

        @media (max-width: 650px) {
            transform: ${({ invert }) =>
                invert ? 'translate(0, -35vh)' : 'translate(0, 0)'};
        }
    }
`;
