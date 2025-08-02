import styled from "styled-components";
import ModalContainer from "./ModalContainer";
import { useToasts } from "../hooks/useToasts";
import type { Unidade, UnidadeMembro } from "../pages/admPages/UnidadesManager";
import { useRef } from "react";
import type { User } from "../types/user";
import { UnidadesEvents } from "../services/api";

const AddUserUnidade = ({userToAdd, unidades, setUserToAdd, setMembrosUnidades, noUnidadeUser, setNoUnidadeUser}:
    {
        userToAdd: User,
        setUserToAdd: (user: User|undefined)=>void 
        unidades: Unidade[]
        setMembrosUnidades: React.Dispatch<React.SetStateAction<UnidadeMembro[] | undefined>>
        noUnidadeUser: User[]
        setNoUnidadeUser: React.Dispatch<React.SetStateAction<User[] | undefined>>
    }) => {
    const { addToast } = useToasts()

    const UnidadeSelectRef = useRef<HTMLSelectElement>(null)
    const UnidadeCargoRef = useRef<HTMLInputElement>(null)

    return(
        <ModalContainer
            close={() => {setUserToAdd(undefined)}}
        >
            {(handleClose) => (
                <AddModal>
                    <h4 className="main-title">{userToAdd.fullname}</h4>
                    <select className="ipt-basic" ref={UnidadeSelectRef}>
                        <option value="-1" disabled selected>A qual unidade deseja adicionar esse membro?</option>
                        {unidades?.map(item=>(
                            <option key={item.un_id} value={item.un_id}>{item.name}</option>
                        ))}
                    </select>
                    <input placeholder="Cargo do membro" className="ipt-basic" ref={UnidadeCargoRef}/>
                    <div className="flex-bts">
                        <button
                            className="btn hoverAnim1"
                            style={{ width: '20vh', backgroundColor: 'var(--first-color)', color: 'var(--white)' }}
                            onClick={() => {
                                if (
                                UnidadeCargoRef.current &&
                                UnidadeCargoRef.current.value.length > 0 &&
                                UnidadeSelectRef.current &&
                                UnidadeSelectRef.current.value !== '-1'
                                ) {
                                    UnidadesEvents.setNew(userToAdd.id, parseInt(UnidadeSelectRef.current.value), UnidadeCargoRef.current.value)
                                    .then(res => {
                                        if (res.status === 201){
                                            setMembrosUnidades(prev => [
                                                ...(prev ?? []),
                                                {
                                                member_id: userToAdd.id,
                                                unidade_cod: parseInt(UnidadeSelectRef.current!.value),
                                                cargo: UnidadeCargoRef.current!.value
                                                }
                                            ]);

                                            const foundIndex = noUnidadeUser?.findIndex(item => item.id === userToAdd.id);
                                            if (foundIndex !== undefined && foundIndex > -1) {
                                                setNoUnidadeUser(prev => {
                                                if (!prev) return prev;
                                                const copy = [...prev];
                                                copy.splice(foundIndex, 1);
                                                return copy;
                                                });
                                            }
                                            handleClose();
                                        }
                                    })
                                    .catch(err => {
                                        console.log(err)
                                    })
                                }
                                else {
                                    addToast({ message: 'Preencha corretamente!', type: 'error', time: 3 });
                                }
                            }}
                            >
                            Adicionar
                            </button>

                        <button className="btn hoverAnim1" style={{ width: '20vh', backgroundColor: 'var(--fourth-color)' }}
                            onClick={handleClose}   
                        >Cancelar</button>
                    </div>
                </AddModal>
            )}
        </ModalContainer>
    )
}
export default AddUserUnidade

const AddModal = styled.section`
    display: flex;
    flex-direction: column;
    gap: 1vh;

    option{
        color: #fff;

        &:nth-child(odd){
            background-color: var(--third-color)
        }
        &:nth-child(even){
            background-color: var(--second-color)
        }
    }
`