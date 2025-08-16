'use client'

import React, { useEffect, useRef, useState } from 'react';

export type Toasttype = {
    type: 'warn' | 'success' | 'error';
    message: string;
    time: number;
    removeToast?: () => void;
};

export const ToastsContainer = () => {
    const { toasts, removeToast } = useToasts();

    return (
        <ToastContainerStyle>
            {toasts.map((message, index) => (
                <Toast
                    key={index}
                    message={message.message}
                    type={message.type}
                    time={message.time}
                    removeToast={() => {
                        removeToast(message.id!);
                    }}
                />
            ))}
        </ToastContainerStyle>
    );
};
export const Toast = ({ type, message, time, removeToast }: Toasttype) => {
    const [hideAnim, setHideAnim] = useState<boolean>(false);
    const toastRef = useRef<HTMLDivElement>(null);

    const toastRemover = () => {
        setHideAnim(true);
        setTimeout(() => {
            setHideAnim(false);

            if (removeToast) removeToast();
        }, 500);
    };

    useEffect(() => {
        setTimeout(() => {
            setHideAnim(true);
            setTimeout(() => {
                setHideAnim(false);

                if (removeToast) removeToast();
            }, 500);
        }, time * 1000);
    });

    return (
        <div
            className={`toast ${hideAnim ? 'hide' : ''}`}
            style={{
                backgroundColor: `${type === 'success' ? '#008000' : ''}${type === 'error' ? '#800000' : ''}${type === 'warn' ? '#808000' : ''}`,
            }}
            ref={toastRef}
        >
            <button
                onClick={() => {
                    toastRemover();
                }}
            >
                X
            </button>
            <p dangerouslySetInnerHTML={{ __html: message }}></p>
            <div className='load-bar'>
                <div
                    className='load'
                    style={{ '--time': `${time}s` } as React.CSSProperties}
                />
            </div>
        </div>
    );
};

import styled from 'styled-components';
import { useToasts } from '../hooks/useToasts';

const ToastContainerStyle = styled.section`
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 45vh;
    z-index: 5;

    .toast {
        width: 90%;
        height: 7.5vh;
        position: relative;
        left: 50%;
        transform: translate(-50%);
        margin-top: 1vh;
        border-radius: 1vh;
        animation: toastShow 0.5s ease-in-out forwards;
        &.hide {
            animation: toastHide 0.5s ease-in-out forwards;
        }

        p {
            font-family: 'Inter', sans-serif;
            color: #fff;
            font-size: 0.8rem;
            text-align: center;
            position: relative;
            left: 50%;
            transform: translate(-50%);
            top: 1vh;
            height: 4.5vh;
        }

        button {
            position: absolute;
            top: 0.5vh;
            right: 0.5vh;
            padding: 0.25vh 0.5vh;
            border: 0.3vh solid #fff;
            background-color: transparent;
            border-radius: 0.5vh;

            font-family: 'Inter', sans-serif;
            color: #fff;
            z-index: 1;

            transition: 0.2s;
            cursor: pointer;

            &:hover {
                background-color: #fff;
                color: #000;
            }
        }

        .load-bar {
            width: 90%;
            position: relative;
            left: 50%;
            transform: translate(-50%);
            height: 0.5vh;
            background-color: rgba(0, 0, 0, 0.3);
            border-radius: 0.5vh;
            top: 1.5vh;
            overflow: hidden;

            .load {
                width: 0%;
                height: 0.5vh;
                background-color: rgba(0, 0, 0, 0.5);
                border-radius: 0.5vh;
                animation: loadbar var(--time) ease-in-out forwards;
            }
        }
    }
`;
