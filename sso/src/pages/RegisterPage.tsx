import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ApiRequests } from '../services/api';
import type { User } from '../types/users';
import Selector from '../components/Selector';
import MemberCard from '../components/MemberCard';
import WaySelector from '../components/WaySelector';

const RegisterPage = () => {
    const [users, setUsers] = useState<User[]>();
    const [selectedUser, setSelectedUser] = useState<User>();

    useEffect(() => {
        ApiRequests.getAllMembers()
            .then((res) => {
                setUsers(res);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <RegisterPageStyle>
            <section className='actions-container'>
                {selectedUser ? (
                    <>
                        <div className='left container'>
                            <div className='member-card-wrapper'>
                                <MemberCard border={true} user={selectedUser} />
                            </div>
                        </div>
                        <div className='right container'>
                            <div className='selector-wrapper'>
                                <Selector
                                    selected={selectedUser.id}
                                    users={users ?? []}
                                    setSelectedUser={(id: number) => {
                                        const foundUser = users?.find(
                                            (users) => users.id === id,
                                        );
                                        setSelectedUser(foundUser);
                                    }}
                                />

                                <div className='options'>
                                    <h2 className='second-title'>
                                        Continue seu registro com:
                                    </h2>
                                    <WaySelector user={selectedUser} />
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <Selector
                        users={users ?? []}
                        setSelectedUser={(id: number) => {
                            const foundUser = users?.find(
                                (users) => users.id === id,
                            );
                            setSelectedUser(foundUser);
                        }}
                    />
                )}
            </section>
        </RegisterPageStyle>
    );
};
export default RegisterPage;

const RegisterPageStyle = styled.main`
    width: 100vw;
    height: 100vh;
    background-color: var(--white);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    .actions-container {
        width: 90vh;
        height: 72vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.3);
        padding: 1vh;

        @media (max-width: 670px) {
            width: 90vw;
        }
        @media (max-width: 580px) {
            flex-direction: column;

            .member-card-wrapper {
                transform: scale(0.7) translateY(8vh);
            }

            .selector-wrapper {
                transform: scale(0.7) translateY(-13vh);
            }
        }

        .container {
            width: 45vh;
            height: 70vh;

            &.right {
                padding: 0 1vh;
                display: flex;
                justify-content: space-evenly;
                flex-direction: column;

                h2 {
                    font-size: 1rem;
                }
            }
        }
    }

    select {
        option {
            color: #fff;

            &:nth-child(odd) {
                background-color: var(--third-color);
            }
            &:nth-child(even) {
                background-color: var(--second-color);
            }
        }
    }
`;
