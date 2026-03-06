import type { Response } from 'express'
import type { AuthRequest } from '../middleware/auth'
import Cart from '../models/Cart'
import Product from '../models/Product'
import mongoose from 'mongoose'

// GET /api/cart
export const getCart = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const cart = await Cart.findOne({ userId: req.userId })
        res.json(cart ?? { items: [] })
    } catch {
        res.status(500).json({ message: 'Error obtaining cart' })
    }
}

// POST /api/cart/items — agrega o incrementa un item
export const addItem = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { productId, quantity = 1 } = req.body

        const product = await Product.findById(productId)
        if (!product) {
            res.status(404).json({ message: 'Product not found' })
            return
        }
        if (product.stock < quantity) {
            res.status(400).json({ message: 'Insufficient stock' })
            return
        }

        let cart = await Cart.findOne({ userId: req.userId })

        if (!cart) {
            cart = await Cart.create({
                userId: new mongoose.Types.ObjectId(req.userId),
                items: [
                    {
                        productId: product._id,
                        name: product.name,
                        slug: product.slug,
                        imageUrl: product.imageUrl,
                        price: product.price,
                        priceList: product.priceList,
                        quantity,
                        stock: product.stock,
                        category: product.category,
                    },
                ],
            })
            res.json(cart)
            return
        }

        const existingIndex = cart.items.findIndex(item => item.productId.toString() === productId)

        if (existingIndex >= 0) {
            const newQty = cart.items[existingIndex]!.quantity + quantity
            if (newQty > product.stock) {
                res.status(400).json({ message: 'Insufficient stock' })
                return
            }
            cart.items[existingIndex]!.quantity = newQty
        } else {
            cart.items.push({
                productId: product._id as mongoose.Types.ObjectId,
                name: product.name,
                slug: product.slug,
                imageUrl: product.imageUrl,
                price: product.price,
                priceList: product.priceList,
                quantity,
                stock: product.stock,
                category: product.category,
            })
        }

        await cart.save()
        res.json(cart)
    } catch {
        res.status(500).json({ message: 'Error adding item' })
    }
}

// PUT /api/cart/items/:productId — cambia la cantidad
export const updateItem = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { productId } = req.params
        const { action } = req.body // 'inc' | 'dec'

        const cart = await Cart.findOne({ userId: req.userId })
        if (!cart) {
            res.status(404).json({ message: 'Cart not found' })
            return
        }

        const index = cart.items.findIndex(item => item.productId.toString() === productId)
        if (index < 0) {
            res.status(404).json({ message: 'Item not found' })
            return
        }

        const item = cart.items[index]!
        const newQty = action === 'inc' ? item.quantity + 1 : item.quantity - 1

        if (newQty < 1) {
            cart.items.splice(index, 1)
        } else if (newQty > item.stock) {
            res.status(400).json({ message: 'Insufficient stock' })
            return
        } else {
            cart.items[index]!.quantity = newQty
        }

        await cart.save()
        res.json(cart)
    } catch {
        res.status(500).json({ message: 'Error updating item' })
    }
}

// DELETE /api/cart/items/:productId — elimina un item
export const removeItem = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { productId } = req.params

        const cart = await Cart.findOne({ userId: req.userId })
        if (!cart) {
            res.status(404).json({ message: 'Cart not found' })
            return
        }

        cart.items = cart.items.filter(item => item.productId.toString() !== productId)
        await cart.save()
        res.json(cart)
    } catch {
        res.status(500).json({ message: 'Error deleting item' })
    }
}

// DELETE /api/cart — vacía el carrito completo (post-compra)
export const clearCart = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        await Cart.findOneAndDelete({ userId: req.userId })
        res.json({ message: 'Cart empty successfully' })
    } catch {
        res.status(500).json({ message: 'Error clearing cart' })
    }
}
