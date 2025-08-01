import styled from "styled-components";
import type { User } from "../types/user";

const Selector = ({users, setSelectedUser, selected, all, customAsk}: { customAsk?: string, all?: boolean, selected?: number, users: User[], setSelectedUser: (id: number) => void }) => {
    return (
        <StyleSelect autoFocus style={{ width: '100%' }} id="users-select" className="ipt-basic border simple-box-shadow" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setSelectedUser(parseInt(e.target.value))
        }}>
            <option disabled selected={!selected} className="second-title">{customAsk??'Quem é você?'}</option>
            {(all ? (users??[]) : users.filter(item=>item.reg===0)).map((member, index) => {
                const bday = member.nascimento;
                const birthDate = new Date(bday);
                const currentDate = new Date();
                
                let age = currentDate.getFullYear() - birthDate.getFullYear();
                
                const isBirthdayPassed = 
                    currentDate.getMonth() > birthDate.getMonth() || 
                    (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() >= birthDate.getDate());
                
                if (!isBirthdayPassed) {
                    age--
                }

                return (
                    <option className="second-title" selected={selected===member.id} key={index} value={member.id}>{member.fullname.toUpperCase()} - {age} anos - {member.funcao}</option>
                )
            })}
        </StyleSelect>
    )
}
export default Selector

const StyleSelect = styled.select`
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