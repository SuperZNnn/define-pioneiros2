import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { type User } from "../../types/user"
import { ApiRequests, deleteCache, setInternal, UserEvents } from "../../services/api"
import { formatDate, formatInputCPF, formatInputPhone, PhoneStringToNumber } from "../../hooks/useConvert"
import ModalContainer from "../../components/ModalContainer"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { FormStyles } from "../ProfilePage"
import * as Yup from 'yup'
import { yupResolver } from "@hookform/resolvers/yup"
import ImageCropper from "../../components/Cropper"
import { useAuth } from "../../hooks/useAuth"
import { useToasts } from "../../hooks/useToasts"
import { AdmFuncs } from "../../types/user"

const MembersListPage = () => {
    const { getUser } = useAuth()
    const { addToast } = useToasts()
    const navigate = useNavigate()
    const location = useLocation()

    const [users, setUsers] = useState<User[]>()
    const [displayList, setDisplayList] = useState<User[]>()

    useEffect(() => {
        getUser()
        .then(response=>{
            if (response){
                ApiRequests.getMember(response)
                .then(res=>{
                    const resData = res.data as { message: string, user: User }
                    if (!AdmFuncs.includes(resData.user.funcao)){
                        addToast({message: 'Sem permissão!', time: 3, type: 'error'})
                        navigate('/')
                        return
                    }
                })
                .catch(()=>{
                    addToast({message: 'Sessão inválida!', time: 3, type: 'error'})
                    navigate('/')
                    return
                })
            }
        })
        .catch(error => {
            if (error.status == 401){
                addToast({message: 'Sessão inválida!', time: 3, type: 'error'})
                navigate('/')
                return
            }
        })

        const fetchUsers = async () => {
            const response = await ApiRequests.getAllMembers()

            if (Array.isArray(response)){
                const EveryHasSGC = response.every(user => user.sgc_code !== undefined)
                if (EveryHasSGC){
                    setUsers(response)
                    setDisplayList([...response])
                }
                else{
                    deleteCache()
                    fetchUsers()
                }
            }
        }

        fetchUsers()
    }, [location])

    return (
        <MembersListPageStyle>
            <section className="filters">
                <select className="ipt-basic border"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>)=>{
                        if (Number(e.target.value) === 1) setDisplayList(users)
                        else if (Number(e.target.value) === 2) setDisplayList(users?.filter(item => item.funcao === 'Desbravador' || item.funcao === 'Desbravadora'))
                        else if (Number(e.target.value) === 3) setDisplayList(users?.filter(item => item.funcao !== 'Desbravador' && item.funcao !== 'Desbravadora'))
                    }}
                >
                    <option value={1}>Todos</option>
                    <option value={2}>Desbravadores</option>
                    <option value={3}>Liderança</option>
                </select>

                <input type="text" className="ipt-basic border" placeholder="Pesquise pelo nome"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (e.target.value.length === 0) setDisplayList(users)
                        else {
                            setDisplayList(users?.filter(item=> item.fullname.toLowerCase().startsWith(e.target.value.toLowerCase())))
                        }
                    }}
                />
            </section>

            <table width='100%'>
                <section className="members-row invert">
                    <div className="column">
                        <p className="simple-text">Código SGC</p>
                    </div>
                    <div className="column">
                        <p className="simple-text">Nome Completo</p>
                    </div>
                    <div className="column">
                        <p className="simple-text">Nascimento</p>
                    </div>
                    <div className="column">
                        <p className="simple-text">Função</p>
                    </div>
                    <div className="column">
                        <p className="simple-text">Ações</p>
                    </div>
                </section>

                {displayList?.map((item)=>(
                    <MembersListMember
                        key={item.id}
                        user={item}
                    />
                ))}
            </table>
        </MembersListPageStyle>
    )
}
export const MemberEditModal = () => {
    const navigate = useNavigate()
    const { userid } = useParams()
    const { addToast } = useToasts()

    const [user, setUser] = useState<User>()

    const ImageRef = useRef<HTMLImageElement>(null)
    const NameRef = useRef<HTMLHeadingElement>(null)

    const schema = Yup.object({
        fullname: Yup.string().required('Nome completo é obrigatório'),
        cpf: Yup.string().required('CPF é obrigatório'),
        telefone: Yup.string(),
        telefone_responsavel: Yup.string(),
        email: Yup.string().email('E-mail inválido!'),
        email_responsavel: Yup.string().email('E-mail inválido'),
        responsavel: Yup.string(),
        mae: Yup.string(),
        pai: Yup.string(),
        nascimento: Yup.string().required('Data de nascimento é obrigatória'),
        funcao: Yup.string(),
        photo: Yup.string()
    })
    const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
        resolver: yupResolver(schema)
    })

    useEffect(()=>{
        ApiRequests.getAllMembers()
        .then(res =>{
            const foundedUser = res.find(item => item.id === Number(userid))
            setUser(foundedUser)
            if (foundedUser) {
                reset({
                    fullname: foundedUser.fullname || '',
                    cpf: formatInputCPF(foundedUser.cpf??'' as string) || '',
                    telefone: typeof foundedUser.telefone === 'string' ? formatInputPhone(foundedUser.telefone??'') : '',
                    telefone_responsavel: typeof foundedUser.telefone_responsavel === 'string' ? formatInputPhone(foundedUser.telefone_responsavel??'') : '',
                    email: typeof foundedUser.email === 'string' ? foundedUser.email : '',
                    email_responsavel: typeof foundedUser.email_responsavel === 'string' ? foundedUser.email_responsavel : '',
                    responsavel: foundedUser.responsavel || '',
                    mae: foundedUser.mae || '',
                    pai: foundedUser.pai || '',
                    nascimento: new Date(foundedUser.nascimento).toISOString().split('T')[0],
                    funcao: foundedUser.funcao || '',
                    photo: foundedUser.photo || ''
                })
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }, [])

    const onSubmit = (data: any) => {
        const InfoData = {
            cpf: data.cpf?.replace(/\D/g, '')??'',
            email: data.email,
            email_responsavel: data.email_responsavel,
            fullname: data.fullname,
            funcao: data.funcao,
            pai: data.pai,
            mae: data.mae,
            responsavel: data.responsavel,
            nascimento: data.nascimento,
            telefone: data.telefone.replace(/\D/g, ''),
            telefone_responsavel: PhoneStringToNumber(data.telefone_responsavel)
        }
        const DisplayData: { photo:string } = {
            photo: data.photo??''
        }

        if (DisplayData.photo.startsWith('blob:')){
            UserEvents.updateDisplay(Number(userid), { photo: DisplayData.photo })
            .then(res=>{
                if (res.status === 200){
                    setUser((prev) => ({
                        ...prev!,
                        photo: DisplayData.photo
                    }))
                    addToast({ message: 'Dados alterados com sucesso!', type: 'success', time: 3 })
                }
            })
            .catch(error=> {
                if (error.status === 400){
                    addToast({ message: 'Nenhum dado precisa de alteração', type: 'warn', time: 3 })
                }

                else{
                    addToast({ message: 'Erro interno! Por favor tente novamente', type: 'error', time: 3 })
                }
                return
            })

        }
        UserEvents.updateInfoData(InfoData as User, Number(userid))
        .then(res=> {
            const resData = res.data as { message: string, updateduser: User }
            
            setUser((prev) => ({
                ...prev!,
                ...resData.updateduser,
                photo: prev?.photo||''
            }))

            setInternal(Number(userid), InfoData as User)

            addToast({ message: 'Dados alterados com sucesso', type: 'success', time: 3 })
        })
        .catch(err => {
            console.log(err)
        })
    }

    return (
        <ModalContainer close={() => {
            navigate('/secretaria/membros')
        }} color="white">
            {(handleClose) => (
                <EditModal>
                    <button onClick={handleClose} className="second-title close">
                        X
                    </button>

                    <div className="top-info">
                        <img alt="profile" ref={ImageRef} src={`${user?.photo?.startsWith('blob:')?user.photo:`data:image/jpeg;base64,${user?.photo}`}`}/>
                        <h6 className="second-title" ref={NameRef}>{user?.fullname}</h6>
                    </div>
                    <FormStyles>
                        <form onSubmit={handleSubmit(onSubmit)} className="noresp">
                            <div className="input-group noresp">
                                <input {...register("fullname")} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    if (NameRef.current) NameRef.current.innerHTML = e.target.value
                                }} className="ipt-basic border" placeholder="Nome completo"/>
                                <p className="error-message simple-warn">{errors.fullname?.message}</p>
                            </div>

                            <div className="input-group noresp">
                                <input
                                {...register("cpf")}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const formatted = formatInputCPF(e.target.value)
                                    setValue("cpf", formatted)
                                    e.target.value = formatted
                                }}
                                value={watch("cpf")}
                                className="ipt-basic border"
                                placeholder="CPF"
                                />
                                <p className="error-message simple-warn">{errors.cpf?.message}</p>
                            </div>

                            <div className="input-group noresp">
                                <input type="date" {...register("nascimento")} className="ipt-basic border"/>
                                <p className="error-message simple-warn">{errors.nascimento?.message}</p>
                            </div>

                            <div className="input-group noresp">
                                <input
                                {...register("telefone")}
                                onChange={(e) => {
                                    const formatted = formatInputPhone(e.target.value)
                                    setValue("telefone", formatted)
                                }}
                                value={watch("telefone")}
                                className="ipt-basic border"
                                placeholder="Telefone"
                                />
                            </div>

                            <div className="input-group noresp">
                                <input
                                {...register("telefone_responsavel")}
                                onChange={(e) => {
                                    const formatted = formatInputPhone(e.target.value)
                                    setValue("telefone_responsavel", formatted)
                                }}
                                value={watch("telefone_responsavel")}
                                className="ipt-basic border"
                                placeholder="Telefone do Responsável"
                                />
                            </div>

                            <div className="input-group noresp">
                                <input {...register("email")} className="ipt-basic border" placeholder="Email"/>
                                <p className="error-message simple-warn">{errors.email?.message}</p>
                            </div>

                            <div className="input-group noresp">
                                <input {...register("email_responsavel")} className="ipt-basic border" placeholder="Email do Responsável"/>
                                <p className="error-message simple-warn">{errors.email_responsavel?.message}</p>
                            </div>

                            <div className="input-group noresp">
                                <input {...register("responsavel")} className="ipt-basic border" placeholder="Responsável"/>
                            </div>

                            <div className="input-group noresp">
                                <input {...register("mae")} className="ipt-basic border" placeholder="Nome da Mãe"/>
                            </div>

                            <div className="input-group noresp">
                                <input {...register("pai")} className="ipt-basic border" placeholder="Nome do Pai"/>
                            </div>

                            <div className="input-group noresp">
                                <input {...register("funcao")} className="ipt-basic border" placeholder="Função"/>
                            </div>

                            <div className="input-group noresp">
                                <label htmlFor="profile-select" className="ipt-basic border" style={{ width: '45vh', marginTop: '1vh' }}>Mudar foto</label>
                                <input type='hidden' {...register("photo")} className="ipt-basic border" placeholder="Base64 da Foto"/>
                            </div>

                            <div className="flex-bts">
                                <button type="submit" className="btn hoverAnim1" style={{ width: '47%', backgroundColor: 'var(--first-color)', color: 'var(--white)' }}>Salvar</button>
                                <button type="button" onClick={handleClose} className="btn hoverAnim1" style={{ width: '47%', backgroundColor: 'var(--fourth-color)'}}>Cancelar</button>
                            </div>
                        </form>
                    </FormStyles>
                    
                    <ImageCropper
                        type="secEdit"
                        send={(image: string) => {
                            setValue('photo', image)
                            if (ImageRef.current) ImageRef.current.src = image
                        }}
                    />
                </EditModal>
            )}
        </ModalContainer>
    )
}
const MembersListMember = ({user}: { user: User }) => {
    const { addToast } = useToasts()

    const [displayUser, setDisplayUser] = useState<User>(user)

    return (
        <section className={`members-row ${displayUser.status === 0?'deactivated':''}`}>
            <div className="column">
                <p className="simple-text">{displayUser.sgc_code}</p>
            </div>
            <div className="column">
                <Link to={`/secretaria/membros/${displayUser.id}`}><p className="simple-text">{displayUser.fullname}</p></Link>
            </div>
            <div className="column">
                <p className="simple-text">{formatDate(displayUser.nascimento)}</p>
            </div>
            <div className="column">
                <p className="simple-text">{displayUser.funcao}</p>
            </div>
            <div className="column flex-bts">
                <Link to={`/secretaria/membros/${displayUser.id}`}><button className="btn hoverAnim1" style={{ backgroundColor: 'var(--fourth-color)' }}>Editar</button></Link>
                {displayUser.status===1?
                <button
                    onClick={() => {
                        UserEvents.inativeUser(displayUser.id)
                        .then(res=>{
                            if (res.status === 200){
                                addToast({ message: 'Usuário Inativado', type: 'warn', time: 3 })
                                setDisplayUser((prev) => ({
                                    ...prev!,
                                    status: 0
                                }))
                            }
                        })
                        .catch(()=>{
                            addToast({ message: 'Erro interno! Por favor tente novamente', type: 'error', time: 3 })
                        })
                    }}              
                className="btn hoverAnim1" style={{ backgroundColor: 'var(--black)', color: 'var(--white)' }}>Inativar</button>:
                <button
                    onClick={() => {
                        UserEvents.reativeUser(displayUser.id)
                        .then(res=>{
                            if (res.status === 200){
                                addToast({ message: 'Usuário reativado', type: 'success', time: 3 })
                                setDisplayUser((prev) => ({
                                    ...prev!,
                                    status: 1
                                }))
                            }
                        })
                        .catch(()=>{
                            addToast({ message: 'Erro interno! Por favor tente novamente', type: 'error', time: 3 })
                        })
                    }}              
                className="btn hoverAnim1" style={{ backgroundColor: 'var(--black)', color: 'var(--white)' }}>Reativar</button>}
            </div>
        </section>
    )
}
export default MembersListPage

const MembersListPageStyle = styled.main`
    background-color: var(--white);
    min-height: 100vh;
    width: 100%;

    padding: 3vh;

    .filters{
        background-color: var(--third-color);
        padding: 1vh;
        display: flex;
        gap: 1vh;

        input{
            @media (max-width: 420px){
                width: 60%;
            }
        }
    }

    .members-row{
        display: flex;
        
        &.deactivated{
            background-color: rgba(128, 0, 0, .3)
        }
        &.invert{
            background-color: var(--black);
            color: var(--white);
            padding: 1vh;
        }
        &:not(.invert){
            .column{
                &:nth-child(2){
                    p{
                        text-decoration: underline;
                    }
                }
            }
            p{
                color: var(--black);
            }
        }
        .column{
            padding: 1vh;

            border-left: .3vh solid var(--black);
            border-bottom: .3vh solid var(--black);

            &:nth-child(1){
                width: 20%;

                @media (max-width: 700px){
                    width: 25%;
                }
                @media (max-width: 550px){
                    display: none;
                }
            }
            &:nth-child(2){
                width: 30%;
                @media (max-width: 550px){
                    width: 40%;
                }
                @media (max-width: 480px){
                    width: 50%;
                }
            }
            &:nth-child(3){
                width: 15%;

                @media (max-width: 700px){
                    width: 20%;
                }
                @media (max-width: 550px){
                    width: 30%;
                }
                @media (max-width: 480px){
                    display: none;
                }
            }
            &:nth-child(4){
                width: 15%;

                @media (max-width: 700px){
                    display: none;
                }
            }
            &:nth-child(5){
                width: 20%;
                border-right: .3vh solid var(--black);

                @media (max-width: 700px){
                    width: 25%;
                }
                @media (max-width: 550px){
                    width: 30%;
                }
                @media (max-width: 480px){
                    width: 50%;
                }
            }
        }
    }
`

const EditModal = styled.section`
    button.close{
        font-weight: 600;
        font-size: 2.3vh;
        position: absolute;
        left: 45.5vh;
        padding: .5vh 1vh;
        background: transparent;
        border: .3vh solid var(--black);
        cursor: pointer;
        transition: .2s;
        color: var(--black);
        border-radius: 1vh;

        &:hover{
            color: #969696;
            background: var(--black);
        }
    }

    .top-info{
        display: flex;
        align-items: center;
        gap: 1vh;

        h6{
            width: 30vh;
            text-align: left;
        }

        img{
            width: 12vh;
            border: .3vh solid var(--second-color);
            border-radius: 50%;
            aspect-ratio: 1/1;
            object-fit: cover;
        }
    }
`