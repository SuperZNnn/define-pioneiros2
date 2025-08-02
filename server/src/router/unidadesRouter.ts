import { Router } from "express";
import { UnidadesController } from "../controller/unidadesController";

const UnidadesRouter = Router()

UnidadesRouter.get('/unidades', UnidadesController.getUnidades)

UnidadesRouter.post('/member/:userId', UnidadesController.setNew)
UnidadesRouter.put('/member/:userId', UnidadesController.changeMember)

export default UnidadesRouter