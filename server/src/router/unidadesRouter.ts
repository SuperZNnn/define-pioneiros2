import { Router } from "express";
import { UnidadesController } from "../controller/unidadesController";
import { CorsPermission } from "../middlewares/corspermission";

const UnidadesRouter = Router()

UnidadesRouter.use(CorsPermission)

UnidadesRouter.get('/unidades', UnidadesController.getUnidades)

UnidadesRouter.post('/member/:userId', UnidadesController.setNew)
UnidadesRouter.put('/member/:userId', UnidadesController.changeMember)

export default UnidadesRouter