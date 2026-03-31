import { Router } from 'express'
import { authMiddleware, adminMiddleware } from '../middleware/auth'
import {
    getProducts,
    getProductById,
    getProductBySlug,
    createProduct,
    updateProduct,
} from '../controllers/productController'

const router = Router()

router.get('/', getProducts)
router.get('/slug/:slug', getProductBySlug)
router.get('/:id', getProductById)

router.post('/', authMiddleware, adminMiddleware, createProduct)
router.put('/:id', authMiddleware, adminMiddleware, updateProduct)

export default router
