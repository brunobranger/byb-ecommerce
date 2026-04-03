import { Router } from 'express'
import {
    getMe,
    updateMe,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
} from '../controllers/userController'
import { authMiddleware } from '../middleware/auth'

const router = Router()

router.get('/me', authMiddleware, getMe)
router.put('/me', authMiddleware, updateMe)

// Direcciones
router.post('/addresses', authMiddleware, addAddress)
router.patch('/addresses/:addressId', authMiddleware, updateAddress)
router.delete('/addresses/:addressId', authMiddleware, deleteAddress)
router.patch('/addresses/:addressId/default', authMiddleware, setDefaultAddress)

export default router
