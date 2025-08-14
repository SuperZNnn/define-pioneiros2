import Image from "next/image"
import style from './initialbrand.module.css'
import { DisplayInfo, User } from "@/types/users"

export const InitialBrand = ({ user, age }: {user: { data: User, display: DisplayInfo }, age: number}) => {
    
    return (
        <main className={style.main}>
            <section className={style.brand}>
                <div className={style.banner}>
                    <Image
                        className={style.banner}
                        src={'https://pioneirosdoadvento.com/assets/images/bg.png'}
                        alt='banner'
                        width={1280}
                        height={720}
                    />
                    <label>
                        <button className={`btn hoverAnim1 ${style.editbanner}`}>
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
                    <Image
                        alt='profile image'
                        src={user.data.photo?`data:image/jpeg;base64,${user.data.photo}`:'https://pioneirosdoadvento.com/assets/images/default_user.jpg'}
                        width={720}
                        height={720}
                    />

                    <div className={style.text}>
                        <h3 className='main-title'>{user.display?.display_name??user.data.fullname}</h3>
                        <h4 className='second-title' style={{ textAlign: 'left' }}>{age} anos - {user.data.funcao}</h4>
                    </div>
                </div>
            </section>
        </main>
    )
}