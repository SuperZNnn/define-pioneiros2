import { Router } from "express";
import { PixController } from "../controller/pixController";
import { CorsPermission } from "../middlewares/corspermission";

const PixRouter = Router()

PixRouter.use(CorsPermission)

PixRouter.get('/transactions', PixController.getTransactions)
PixRouter.get('/transactions/all', PixController.getAllTransactions)

PixRouter.post('/pix/sendTo/:to', PixController.SendTo)
PixRouter.post('/pix/systemAdd', PixController.SystemAdd)
PixRouter.post('/pix/systemRemove', PixController.SystemRemove)

export default PixRouter