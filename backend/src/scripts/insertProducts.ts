// scripts/seedProducts.ts
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Product from '../models/Product'
import { rawProducts, PRICE_LIST_MODIFIER } from '../data/products'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

// Función para generar slug (es literalmente igual a la que tengo en el frontend)
const generateSlug = (name: string): string =>
    name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')

const seedProducts = async () => {
    try {
        // Conectar a la base de datos
        const uri = process.env.MONGO_URI
        if (!uri) throw new Error('MONGO_URI no definida')
        await mongoose.connect(uri)
        // Borrar la collecction
        await Product.deleteMany({})

        // Transformar los productos al formato que necesitamos
        const productsToInsert = rawProducts.map(product => ({
            ...product,
            slug: generateSlug(product.name),
            priceList: Math.round(product.price * PRICE_LIST_MODIFIER),
            creationDate: new Date(product.creationDate),
        }))

        // Insertamos en la base de datos
        await Product.insertMany(productsToInsert)
        // Terminamos la conexion con MongoDB y los productos deberian estar guardados.
        await mongoose.disconnect()
    } catch (error) {
        console.error('Error en el script:', error)
        process.exit(1)
    }
}

seedProducts()
