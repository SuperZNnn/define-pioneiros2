import { Router } from 'express';
import { UsersController } from '../controller/usersController';
import { systemMiddleware } from '../middlewares/system';
import { CorsPermission } from '../middlewares/corspermission';

const usersRouter = Router()

usersRouter.use(CorsPermission)

usersRouter.get('/users', UsersController.getAll)
usersRouter.get('/user/display', UsersController.getUserDisplay)
usersRouter.get('/user/:id', UsersController.getUser)

usersRouter.get('/users/display', UsersController.getAllDisplay)
usersRouter.get('/users/getByLogin/:login', UsersController.getByLogin)

usersRouter.put('/users/update/:userId', systemMiddleware, UsersController.updateUsers)
usersRouter.put('/users/inativeUser/:userid', systemMiddleware, UsersController.inativeUser)
usersRouter.put('/users/reativeUser/:userid', systemMiddleware, UsersController.reativeUser)

usersRouter.post('/users/bePathfinderNew', UsersController.bePathfinderNew)

export default usersRouter