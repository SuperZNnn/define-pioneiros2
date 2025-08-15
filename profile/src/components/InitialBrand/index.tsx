'use client';

import Image from 'next/image';
import style from './initialbrand.module.css';
import { DisplayInfo, User } from '@/types/users';
import ImageCropper from '../Cropper';
import { useState } from 'react';
import { ImageEvents } from '@/services/client_consults';

export const InitialBrand = ({
    user,
    age,
    enableEdit,
}: {
    user: { data: User; display: DisplayInfo };
    age: number;
    enableEdit?: boolean;
}) => {
    const [banner, setBanner] = useState<string>(
        user.display?.banner
            ? `data:image/jpeg;base64,${user.display.banner}`
            : 'https://pioneirosdoadvento.com/assets/images/green_bg.jpg',
    );
    const [profile, setProfile] = useState<string>(
        user.data.photo
            ? `data:image/jpeg;base64,${user.data.photo}`
            : 'https://pioneirosdoadvento.com/assets/images/default_user.jpg',
    );

    const [aspectratio, setAspectratio] = useState<`${number}/${number}`>(
        `${1}/${1}`,
    );

    return (
        <main className={style.main}>
            <section className={style.brand}>
                <div className={style.banner}>
                    <Image
                        className={style.banner}
                        src={banner}
                        alt='banner'
                        width={1280}
                        height={720}
                    />
                    <label
                        style={{
                            position: 'relative',
                            opacity: enableEdit ? 1 : 0,
                            zIndex: enableEdit ? 0 : -99,
                        }}
                        htmlFor='image-cropper'
                    >
                        <button
                            className={`btn hoverAnim1 ${style.editbanner}`}
                            onClick={() => {
                                if (enableEdit) {
                                    document
                                        .getElementById('image-cropper')
                                        ?.click();
                                    setAspectratio(`${5}/${1}`);
                                }
                            }}
                        >
                            <Image
                                alt='Mude seu banner'
                                src={'/assets/images/camera.png'}
                                width={256}
                                height={256}
                            />
                            <p className='simple-text'>Editar foto da capa</p>
                        </button>
                    </label>
                </div>
                <div className={style.profile}>
                    <div className={style.image_container}>
                        <Image
                            className={style.profile_img}
                            alt='profile image'
                            src={profile}
                            width={720}
                            height={720}
                        />
                        {enableEdit && (
                            <div className={`${style.edit_icon} btn`}>
                                <Image
                                    src={
                                        'https://pioneirosdoadvento.com/assets/images/edit-icon.png'
                                    }
                                    alt='Editar perfil'
                                    width={48}
                                    height={48}
                                    onClick={() => {
                                        document
                                            .getElementById('image-cropper')
                                            ?.click();
                                        setAspectratio(`${1}/${1}`);
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    <div className={style.text}>
                        <h3 className='main-title'>
                            {user.display?.display_name ?? user.data.fullname}
                        </h3>
                        <h4
                            className='second-title'
                            style={{ textAlign: 'left' }}
                        >
                            {age} anos - {user.data.funcao}
                        </h4>
                    </div>
                </div>
            </section>

            {enableEdit && (
                <ImageCropper
                    aspectratio={aspectratio}
                    send={(e: string) => {
                        if (aspectratio === `${5}/${1}`){
                            ImageEvents.updateImages({
                                userId: user.data.id,
                                banner: e
                            })
                            .then(res => {
                                if (res.status === 200) setBanner(e)
                            })
                            .catch(err => {
                                console.log(err)
                            })
                        }
                        else if (aspectratio === `${1}/${1}`){
                            ImageEvents.updateImages({
                                userId: user.data.id,
                                profile: e
                            })
                            .then(res => {
                                if (res.status === 200) setProfile(e)
                            })
                            .catch(err => {
                                console.log(err)
                            })
                        }
                    }}
                />
            )}
        </main>
    );
};
