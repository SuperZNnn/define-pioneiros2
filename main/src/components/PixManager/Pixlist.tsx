import { useState } from "react"
import { convertToBRL } from "../../hooks/useConvert"
import type { User } from "../../types/user"
import MiniPopup from "../MiniPopup"

const PixList = ({users, from, to, value, fromSystem}: { fromSystem?: number, users: User[], from: number, to: number, value: string }) => {
    const fromUser = users?.find(user => user.id === from)
    const toUser = users?.find(user => user.id === to)

    const [miniPopupView1, setMiniPopupView1] = useState<boolean>(false)
    const [miniPopupView2, setMiniPopupView2] = useState<boolean>(false)

    return (
        <section className="members-row">
            <div className="column">
                {fromSystem === 1?
                <p className="simple-text"><b>SISTEMA</b></p>
                :<p className="simple-text"
                    onMouseEnter={() => {setMiniPopupView1(true)}}
                    onMouseLeave={() => {setMiniPopupView1(false)}}
                >{fromUser?.fullname}</p>}

                {fromSystem !== 1 && miniPopupView1?<MiniPopup valor={fromUser?.pix??''}/>:null}
            </div>
            <div className="column">
                {fromSystem === 2?
                <p className="simple-text"><b>SISTEMA</b></p>
                :<p className="simple-text"
                    onMouseEnter={() => {setMiniPopupView2(true)}}
                    onMouseLeave={() => {setMiniPopupView2(false)}}
                >{toUser?.fullname}</p>}
                {fromSystem !== 2 && miniPopupView2?<MiniPopup valor={toUser?.pix??''}/>:null}
            </div>
            <div className="column">
                <p className="simple-text">{convertToBRL(value)}</p>
            </div>
        </section>
    )
}
export default PixList