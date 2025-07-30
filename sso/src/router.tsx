import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import RedirectPage from "./pages/Redirect";
import RegisterPage from "./pages/RegisterPage";
import FinishRegisterPage from "./pages/FinishRegister";
import ResetPasswordPage from "./pages/ResetPassword";
import UpdateOldPage from "./pages/UpdateOldUser";
import CreateSession from "./pages/CreateSession";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/redirect" element={<RedirectPage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>
            <Route path="/oldupdate" element={<UpdateOldPage/>}/>

            <Route path="/createsession/:token/:name" element={<CreateSession/>}/>
            <Route path="/finishregister/:token/:name" element={<FinishRegisterPage/>}/>
            <Route path="/resetpassword/:token/:name" element={<ResetPasswordPage/>}/>
        </Routes>
    )
}
export default AppRoutes