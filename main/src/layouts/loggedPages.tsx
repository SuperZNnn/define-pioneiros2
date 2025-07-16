import { Outlet } from "react-router-dom"
import { LoggedSidebar } from "../components/Sidebar"
import Nav from "../components/Nav"

const LoggedPagesLayout = () => {
    return(
        <>
            <Outlet/>
            <LoggedSidebar/>
            <Nav/>
        </>
    )
}
export default LoggedPagesLayout