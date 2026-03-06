import { Router } from 'express'
import { getCart, addItem, updateItem, removeItem, clearCart } from '../controllers/cartController'
import { authMiddleware } from '../middleware/auth'

const router = Router()

// Todas las rutas del carrito requieren autenticación
router.use(authMiddleware)

router.get('/', getCart)
router.post('/items', addItem)
router.put('/items/:productId', updateItem)
router.delete('/items/:productId', removeItem)
router.delete('/', clearCart)

export default router
