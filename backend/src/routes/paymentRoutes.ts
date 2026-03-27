import { Router } from 'express'
import { createPreference, mpWebhook } from '../controllers/paymentController'
import { authMiddleware } from '../middleware/auth'

const router = Router()

// El webhook no lleva auth porque lo llama MP directamente
router.post('/webhook', mpWebhook)

// Crear preferencia sí requiere auth
router.post('/create-preference', authMiddleware, createPreference)

export default router
