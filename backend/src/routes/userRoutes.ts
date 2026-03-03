import { Router } from 'express'
import { getMe, updateMe } from '../controllers/userController'
import { authMiddleware } from '../middleware/auth'

const router = Router()

router.get('/me', authMiddleware, getMe)
router.put('/me', authMiddleware, updateMe)

export default router
