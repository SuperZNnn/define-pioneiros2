import { Router } from "express";
import { PixController } from "../controller/pixController";
import { CorsPermission } from "../middlewares/corspermission";
import { allowByCookie, systemMiddleware } from "../middlewares/system";

const PixRouter = Router()

PixRouter.use(CorsPermission)

PixRouter.get('/transactions', PixController.getTransactions)
PixRouter.get('/transactions/all', PixController.getAllTransactions)

PixRouter.post('/pix/sendTo/:to', allowByCookie, PixController.SendTo)
PixRouter.post('/pix/systemAdd', systemMiddleware, PixController.SystemAdd)
PixRouter.post('/pix/systemRemove', systemMiddleware, PixController.SystemRemove)

export default PixRouter