import { Router } from 'express'
import { createOrder, getMyOrders, getOrderByNumber } from '../controllers/orderController'
import { authMiddleware } from '../middleware/auth'

const router = Router()

router.use(authMiddleware)

router.post('/', createOrder)
router.get('/', getMyOrders)
router.get('/:orderNumber', getOrderByNumber)

export default router
