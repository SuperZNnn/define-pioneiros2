import { Router } from "express";
import { SystemController } from "../controller/systemController";
import { systemMiddleware } from "../middlewares/system";

const SystemRouter = Router()

SystemRouter.use(systemMiddleware)

SystemRouter.get('/system/getAllTokens', SystemController.getAllTokens)

SystemRouter.put('/system/add30minutes/:token', SystemController.add30minutes)

SystemRouter.delete('/system/token/:token', SystemController.deleteToken)

export default SystemRouter