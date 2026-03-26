import type { Response } from 'express'
import type { AuthRequest } from '../middleware/auth'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import Order from '../models/Order'

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!,
})

// POST /api/payments/create-preference
export const createPreference = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // ── DEBUG COMPLETO: Verificamos todo el flujo ──
        console.log('=== INICIO CREATE PREFERENCE ===')
        console.log('1. Headers recibidos:', Object.keys(req.headers))
        console.log('2. Authorization header:', req.headers.authorization)
        console.log('3. Request body:', req.body)
        console.log('4. req.userId desde middleware:', req.userId)
        console.log('5. req.userRole desde middleware:', req.userRole)
        console.log('6. JWT_SECRET existe:', !!process.env.JWT_SECRET)
        console.log('7. MP_ACCESS_TOKEN existe:', !!process.env.MP_ACCESS_TOKEN)
        console.log(
            '8. MP_ACCESS_TOKEN (primeros 20 chars):',
            process.env.MP_ACCESS_TOKEN?.slice(0, 20),
        )
        console.log('9. FRONTEND_URL:', process.env.FRONTEND_URL)
        console.log('10. BACKEND_URL:', process.env.BACKEND_URL)

        if (!req.userId) {
            console.log('❌ ERROR CRÍTICO: req.userId es undefined - el middleware no funcionó')
            console.log('Posibles causas:')
            console.log('- JWT_SECRET no coincide entre frontend y backend')
            console.log('- Token JWT expirado o inválido')
            console.log('- Middleware auth no se ejecutó correctamente')
            res.status(401).json({ message: 'Usuario no autenticado' })
            return
        }

        console.log('✅ Autenticación OK - userId:', req.userId)
        const { orderNumber } = req.body
        console.log('11. OrderNumber recibido:', orderNumber)

        const order = await Order.findOne({ orderNumber, userId: req.userId })
        if (!order) {
            console.log(
                '❌ Orden no encontrada para orderNumber:',
                orderNumber,
                'userId:',
                req.userId,
            )
            res.status(404).json({ message: 'Orden no encontrada' })
            return
        }

        console.log('✅ Orden encontrada - ID:', order._id, 'Status:', order.status)
        console.log('12. Items en orden:', order.items.length)

        const items = order.items.map(item => ({
            id: item.productId.toString(),
            title: item.name,
            picture_url: item.imageUrl,
            quantity: item.quantity,
            unit_price: item.price,
            currency_id: 'ARS',
        }))

        console.log('13. Items formateados para MP:', items.length, 'items')
        console.log(
            '14. Total calculado:',
            items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0),
        )

        // Log para debuggear — sacalo cuando funcione
        console.log('Creando preferencia MP para orden:', orderNumber)
        console.log('Items:', JSON.stringify(items, null, 2))
        console.log('Token (primeros 20 chars):', process.env.MP_ACCESS_TOKEN?.slice(0, 20))

        console.log('15. Llamando a Mercado Pago API...')

        // ── TEST: Enviar objeto minimalista para identificar el problema ──
        const minimalPreference = {
            items: [
                {
                    id: 'test-123',
                    title: 'Test Product',
                    quantity: 1,
                    unit_price: 50, // Reducido de 100 a 50 ARS
                    currency_id: 'ARS',
                },
            ],
            back_urls: {
                success: 'http://localhost:5173/success',
                failure: 'http://localhost:5173/failure',
                pending: 'http://localhost:5173/pending',
            },
        }

        console.log(
            '16. Enviando preferencia minimalista:',
            JSON.stringify(minimalPreference, null, 2),
        )

        const response = await new Preference(client).create({ body: minimalPreference })

        console.log('✅ Si esto funciona, el problema está en el objeto original')
        console.log('❌ Si esto falla, el problema es más básico (token, permisos, etc.)')

        console.log('✅ Respuesta de Mercado Pago OK:')
        console.log('16. Preference ID:', response.id)
        console.log('17. Init Point:', response.init_point?.slice(0, 50) + '...')
        console.log('18. Sandbox Init Point:', response.sandbox_init_point?.slice(0, 50) + '...')

        res.json({
            preferenceId: response.id,
            initPoint: response.init_point,
            sandboxInitPoint: response.sandbox_init_point,
        })
    } catch (error: any) {
        console.log('=== ERROR EN MERCADO PAGO ===')
        console.error('Error completo:', JSON.stringify(error, null, 2))
        console.error('Status:', error?.status)
        console.error('Code:', error?.code)
        console.error('Message:', error?.message)
        console.error('Cause:', error?.cause)
        console.error('Stack:', error?.stack)

        // Intentamos extraer más información si es un error de axios/fetch
        if (error?.response) {
            console.error('Response data:', error?.response?.data)
            console.error('Response status:', error?.response?.status)
            console.error('Response headers:', error?.response?.headers)
        }

        res.status(500).json({
            message: 'Error creando preferencia de pago',
            error: error?.message,
        })
    }
}

// POST /api/payments/webhook
export const mpWebhook = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { type, data } = req.body

        if (type !== 'payment') {
            res.sendStatus(200)
            return
        }

        const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${data.id}`, {
            headers: {
                Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
            },
        })
        const payment = await paymentResponse.json()

        const orderNumber = payment.external_reference
        if (!orderNumber) {
            res.sendStatus(200)
            return
        }

        const statusMap: Record<string, string> = {
            approved: 'confirmed',
            pending: 'pending',
            in_process: 'pending',
            rejected: 'cancelled',
        }
        const newStatus = statusMap[payment.status] ?? 'pending'

        await Order.findOneAndUpdate({ orderNumber }, { status: newStatus })

        res.sendStatus(200)
    } catch (error) {
        console.error('Error en webhook MP:', error)
        res.sendStatus(500)
    }
}
