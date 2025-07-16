import { Router } from "express"
import { PhotoServerController } from "../controller/photoServerController"

const PhotoServerRouter = Router()

PhotoServerRouter.get('/photoserver/bday/:userid', PhotoServerController.bdayPhoto)

export default PhotoServerRouter