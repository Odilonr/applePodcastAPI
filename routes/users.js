import express from 'express'
import { registerNewUser, authenticateUser, refreshToken, logOutUser } from '../controllers/userController.js'
import { asynHandler } from '../middleware/errorHandler.js'

const router = express.Router()

router.post('/register', asynHandler(registerNewUser))
router.post('/auth', asynHandler(authenticateUser))
router.post('/refresh', asynHandler(refreshToken))
router.post('/logout', logOutUser)


export default router
