import type { Request, Response } from 'express'
import type { SortOrder } from 'mongoose'
import Product from '../models/Product'

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
