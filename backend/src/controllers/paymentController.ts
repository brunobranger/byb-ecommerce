import { text, type Response } from 'express'
import type { AuthRequest } from '../middleware/auth'
import { MercadoPagoConfig } from 'mercadopago'
import Order from '../models/Order'

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!,
})

console.log('Token completo:', process.env.MP_ACCESS_TOKEN)

// POST /api/payments/create-preference
export const createPreference = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                items: [
                    {
                        id: 'test',
                        title: 'Producto de prueba',
                        quantity: 1,
                        unit_price: 100,
                    },
                ],
            }),
        })

        const data = await response.json()
        console.log('MP Response status:', response.status)
        console.log('MP Response data:', data)

        if (!response.ok) {
            res.status(500).json({ message: 'Error MP', error: data })
            return
        }

        res.json({ initPoint: data.init_point, sandboxInitPoint: data.sandbox_init_point })
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({ message: 'Error creando preferencia' })
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
