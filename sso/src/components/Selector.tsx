import type { User } from "../types/users";

const Selector = ({users, setSelectedUser, selected}: { selected?: number, users: User[], setSelectedUser: (id: number) => void }) => {
    return (
        <select autoFocus style={{ width: '100%' }} id="users-select" className="ipt-basic border simple-box-shadow" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setSelectedUser(parseInt(e.target.value))
        }}>
            <option disabled selected={!selected} className="second-title">Quem é você?</option>
            {users?.filter(item=>item.reg===0).map((member, index) => {
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
        </select>
    )
}
export default Selector