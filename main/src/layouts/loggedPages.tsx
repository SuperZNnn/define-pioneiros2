import { Outlet } from "react-router-dom"
import { LoggedSidebar } from "../components/Sidebar"

const LoggedPagesLayout = () => {
    return(
        <>
            <Outlet/>
            <LoggedSidebar/>
        </>
    )
}
export default LoggedPagesLayout