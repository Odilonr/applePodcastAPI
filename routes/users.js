import express from 'express'
import { registerNewUser, authenticateUser, refreshToken, logOutUser } from '../controllers/userController.js'

const router = express.Router()

router.post('/register', registerNewUser)
router.post('/auth', authenticateUser)
router.post('/refresh', refreshToken)
router.post('/logout', logOutUser)


export default router
