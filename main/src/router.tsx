import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/Home"
import MemberModal from "./components/MembersModal"
import ProfilePage from "./pages/ProfilePage"
import LoggedPagesLayout from "./layouts/loggedPages"
import TokenManagerPage from "./pages/admPages/TokensManager"
import MembersListPage, { MemberEditModal } from "./pages/admPages/MembersList"

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/show/:id" element={<><HomePage/><MemberModal/></>}/>

            <Route path="/" element={<LoggedPagesLayout/>}>
                <Route path="/profile" element={<ProfilePage/>}/>
                <Route path="/tokenmanager" element={<TokenManagerPage/>}/>
                
                <Route path="/secretaria/membros" element={<MembersListPage/>}/>
                <Route path="/secretaria/membros/:userid" element={<><MembersListPage/><MemberEditModal/></>}/>
            </Route>
        </Routes>
    )
}
export default AppRouter