import { useRef } from "react"
import { FormStyles } from "../pages/ProfilePage"
import type { User } from "../types/user"
import ModalContainer from "./ModalContainer"
import type { Unidade, UnidadeMembro } from "../pages/admPages/UnidadesManager"
import styled from "styled-components"
import { UnidadesEvents } from "../services/api"

const ModifyUserUnidade = ({setUserToModify, userToModify, unidades, setMembrosUnidades}: {
        setUserToModify: (user: User|undefined) => void
        userToModify: User
        unidades: Unidade[]
        setMembrosUnidades: React.Dispatch<React.SetStateAction<UnidadeMembro[] | undefined>>
    }) => {

    const UnidadeSelectRef = useRef<HTMLSelectElement>(null)
    const UnidadeCargoRef = useRef<HTMLInputElement>(null)
    return (
        <ModalContainer
            color="white"
            close={() => {setUserToModify(undefined)}}
        >
            {(handleClose) => (
                <EditModal>
                    <h4 className="second-title">{userToModify.fullname}</h4>

                    <FormStyles>
                        <div className="input-group">
                            <select className="ipt-basic" ref={UnidadeSelectRef} style={{ width: '100%' }}>
                                <option value="-1" disabled selected>Deseja trocar o membro de unidade?</option>
                                {unidades?.map(item=>(
                                    <option key={item.un_id} value={item.un_id}>{item.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="input-group">
                            <input placeholder="Cargo do membro" className="ipt-basic" ref={UnidadeCargoRef}/>
                            
                        </div>

                        <div className="flex-bts">
                            <button className="btn hoverAnim1" style={{ width: '20vh', backgroundColor: 'var(--first-color)', color: 'var(--white)' }}
                                onClick={() => {
                                    const cargo = UnidadeCargoRef.current!.value?UnidadeCargoRef.current!.value:null
                                    const unidade = UnidadeSelectRef.current!.value !== '-1'?parseInt(UnidadeSelectRef.current!.value):null

                                    UnidadesEvents.update(userToModify.id, unidade, cargo)
                                    .then(res => {
                                        if (res.status === 200){
                                            if (UnidadeCargoRef.current && UnidadeCargoRef.current.value.length > 0){
                                                setMembrosUnidades(prev => {
                                                    if (!prev) return prev

                                                    return prev.map(membro => {
                                                        if (membro.member_id === userToModify.id){
                                                            return { ...membro, cargo: UnidadeCargoRef.current!.value }
                                                        }
                                                        return membro
                                                    })
                                                })
                                            }
                                            if (UnidadeSelectRef.current && UnidadeSelectRef.current.value !== '-1'){
                                                setMembrosUnidades(prev => {
                                                    if (!prev) return prev

                                                    return prev.map(membro => {
                                                        if (membro.member_id === userToModify.id){
                                                            return { ...membro, unidade_cod: parseInt(UnidadeSelectRef.current?.value??'1') }
                                                        }
                                                        return membro
                                                    })
                                                })
                                            }

                                            handleClose()
                                        }
                                    })
                                    .catch(err => {
                                        console.log(err)
                                    })
                                }}
                            >Alterar</button>
                            <button className="btn hoverAnim1" style={{ width: '20vh', backgroundColor: 'var(--fourth-color)' }}
                                onClick={handleClose}   
                            >Cancelar</button>
                        </div>
                    </FormStyles>
                </EditModal>
            )}
        </ModalContainer>
    )
}
export default ModifyUserUnidade

const EditModal = styled.section`
    .close{
        font-weight: bolder;
        font-size: 1.2rem;
        background: transparent;
        border-radius: 1vh;
        border: .3vh solid var(--black);
        padding: .5vh 1vh;
        transition: .2s;
        cursor: pointer;

        &:hover{
            background-color: var(--black);
            color: #969696;
        }
    }
`