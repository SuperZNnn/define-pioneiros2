import { Router } from "express";
import { UnidadesController } from "../controller/unidadesController";
import { CorsPermission } from "../middlewares/corspermission";
import { systemMiddleware } from "../middlewares/system";

const UnidadesRouter = Router()

UnidadesRouter.use(CorsPermission)

UnidadesRouter.get('/unidades', UnidadesController.getUnidades)

UnidadesRouter.post('/member/:userId', systemMiddleware, UnidadesController.setNew)
UnidadesRouter.put('/member/:userId', systemMiddleware, UnidadesController.changeMember)

export default UnidadesRouter