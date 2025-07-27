import { Router } from "express";
import { PixController } from "../controller/pixController";

const PixRouter = Router()

PixRouter.get('/transactions', PixController.getTransactions)

PixRouter.post('/pix/sendTo/:to', PixController.SendTo)

export default PixRouter