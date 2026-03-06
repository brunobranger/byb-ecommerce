import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import connectDB from './db'

import productRoutes from './routes/productRoutes'
import authRoutes from './routes/authRoutes'
import userRoutes from './routes/userRoutes'
import cartRoutes from './routes/cartRoutes'
import orderRoutes from './routes/orderRoutes'

dotenv.config()

const app = express()
const PORT = process.env.PORT ?? 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// DB connection
connectDB()

// Routes
app.use('/api/products', productRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/cart', cartRoutes)

app.listen(PORT, () => {
    console.log(`Server running in ${PORT}`)
})
