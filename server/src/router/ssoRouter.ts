import { Router } from "express";
import { SsoController } from "../controller/ssoController";

const SsoRouter = Router()

SsoRouter.get('/sso/validateRedirect', SsoController.validateRedirect)
SsoRouter.get('/sso/validateToken/:token', SsoController.validateCode)
SsoRouter.get('/sso/getSession', SsoController.verifySession)

SsoRouter.post('/sso/createToken', SsoController.createToken)
SsoRouter.post('/sso/createUser', SsoController.createUser)
SsoRouter.post('/sso/login', SsoController.loginUser)
SsoRouter.post('/sso/firebaseLogin', SsoController.firebaseLogin)

SsoRouter.put('/sso/resetPassword', SsoController.resetPassword)
SsoRouter.put('/sso/changeInfo/:userId', SsoController.changeInfos)

SsoRouter.delete('/sso/destroySession', SsoController.destroySession)

export default SsoRouter