import type { Response } from 'express'
import type { AuthRequest } from '../middleware/auth'
import Order from '../models/Order'
import Cart from '../models/Cart'
import Product from '../models/Product'
import mongoose from 'mongoose'

const generateOrderNumber = () => `ORD-${Math.floor(100000 + Math.random() * 900000)}`

// POST /api/orders — crea la orden, descuenta stock, vacía el carrito
export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
    // En produccion:: descomentar para transacciones atómicas con MongoDB Atlas (replica set)
    // const session = await mongoose.startSession()
    // session.startTransaction()

    try {
        const {
            shippingOption,
            carrier,
            shippingCost,
            deliveryAddress,
            paymentMethod,
            subtotal,
            total,
        } = req.body

        // En produccion:: agregar .session(session) a todas las queries
        const cart = await Cart.findOne({ userId: req.userId })
        if (!cart || cart.items.length === 0) {
            // En produccion:: await session.abortTransaction()
            res.status(400).json({ message: 'El carrito está vacío' })
            return
        }

        // Validamos stock y descontamos
        for (const item of cart.items) {
            // En produccion:: agregar .session(session)
            const product = await Product.findById(item.productId)
            if (!product) {
                // En produccion:: await session.abortTransaction()
                res.status(404).json({ message: `Producto no encontrado: ${item.name}` })
                return
            }
            if (product.stock < item.quantity) {
                // En produccion:: await session.abortTransaction()
                res.status(400).json({ message: `Stock insuficiente para: ${item.name}` })
                return
            }
            product.stock -= item.quantity
            await product.save() // En produccion:: await product.save({ session })
        }

        // Creamos la orden
        // En produccion:: agregar { session } como segundo argumento
        const order = await Order.create([
            {
                orderNumber: generateOrderNumber(),
                userId: new mongoose.Types.ObjectId(req.userId),
                items: cart.items.map(item => ({
                    productId: item.productId,
                    name: item.name,
                    slug: item.slug,
                    imageUrl: item.imageUrl,
                    price: item.price,
                    quantity: item.quantity,
                })),
                shippingOption,
                carrier,
                shippingCost,
                deliveryAddress,
                paymentMethod,
                subtotal,
                total,
                status: 'pending',
            },
        ])

        // Vaciamos el carrito
        // En produccion:: agregar { session } como segundo argumento
        await Cart.findOneAndDelete({ userId: req.userId })

        // En produccion:: await session.commitTransaction()
        res.status(201).json(order[0])
    } catch {
        // En produccion:: await session.abortTransaction()
        res.status(500).json({ message: 'Error creando la orden' })
    }
    // En produccion:: agregar finally { session.endSession() }
}

// GET /api/orders — órdenes del usuario logueado
export const getMyOrders = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 })
        res.json(orders)
    } catch {
        res.status(500).json({ message: 'Error obteniendo órdenes' })
    }
}

// GET /api/orders/:orderNumber — detalle de una orden
export const getOrderByNumber = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const order = await Order.findOne({
            orderNumber: req.params.orderNumber,
            userId: req.userId, // solo puede ver sus propias órdenes
        })
        if (!order) {
            res.status(404).json({ message: 'Orden no encontrada' })
            return
        }
        res.json(order)
    } catch {
        res.status(500).json({ message: 'Error obteniendo la orden' })
    }
}
