import type { Request, Response } from 'express'
import type { SortOrder } from 'mongoose'
import Product from '../models/Product'

import { PRICE_LIST_MODIFIER } from '../data/products'

const generateSlug = (name: string): string =>
    name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')

// GET /api/products
export const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const { category, subcategory, search, sort } = req.query

        const filter: Record<string, unknown> = { isActive: true }

        if (category) filter['category'] = category
        if (subcategory) filter['subcategory'] = subcategory
        if (search) filter['$text'] = { $search: search }

        const sortOptions: Record<string, Record<string, SortOrder>> = {
            destacados: { creationDate: -1 },
            'price-asc': { price: 1 },
            'price-des': { price: -1 },
        }

        const sortQuery = sortOptions[sort as string] ?? { creationDate: -1 as SortOrder }

        const products = await Product.find(filter).sort(sortQuery)
        res.json(products)
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo productos' })
    }
}

export const getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await Product.findById(req.params['id'])
        if (!product) {
            res.status(404).json({ message: 'Product not found' })
            return
        }

        res.json(product)
    } catch (error) {
        res.status(500).json({ message: 'Error attempting to get product' })
    }
}

// GET /api/products/slug/:slug
export const getProductBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await Product.findOne({ slug: req.params.slug })
        if (!product) {
            res.status(404).json({ message: 'Product not found' })
            return
        }

        res.json(product)
    } catch (error) {
        res.status(500).json({ message: 'Error attempting to get product' })
    }
}

// POST /api/products — admin
export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, price, stock, category, subcategory, imageUrl, images, specs } = req.body

        const slug = generateSlug(name)
        const existing = await Product.findOne({ slug })
        if (existing) {
            res.status(400).json({ message: 'Ya existe un producto con ese nombre' })
            return
        }

        const product = await Product.create({
            name,
            slug,
            price,
            priceList: Math.round(price * PRICE_LIST_MODIFIER),
            stock,
            category,
            subcategory,
            imageUrl,
            images,
            specs,
            isActive: true,
        })

        res.status(201).json(product)
    } catch {
        res.status(500).json({ message: 'Error creando producto' })
    }
}

// PUT /api/products/:id — admin
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, price, stock, subcategory, imageUrl, images, specs, isActive } = req.body

        const update: Record<string, unknown> = {
            stock,
            subcategory,
            imageUrl,
            images,
            specs,
            isActive,
        }

        if (name) {
            update.name = name
            update.slug = generateSlug(name)
        }

        if (price) {
            update.price = price
            update.priceList = Math.round(price * PRICE_LIST_MODIFIER)
        }

        const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true })

        if (!product) {
            res.status(404).json({ message: 'Producto no encontrado' })
            return
        }

        res.json(product)
    } catch {
        res.status(500).json({ message: 'Error actualizando producto' })
    }
}
