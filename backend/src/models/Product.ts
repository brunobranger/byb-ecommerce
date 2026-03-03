import mongoose, { Schema, type Document } from 'mongoose'

export interface IProduct extends Document {
    name: string
    price: number
    priceList: number
    stock: number
    category: string
    subcategory?: string
    imageUrl?: string
    images?: string[]
    isActive: boolean
    creationDate: Date
    specs?: Record<string, unknown>
}

const ProductSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        priceList: { type: Number, required: true },
        stock: { type: Number, required: true, default: 0 },
        category: { type: String, required: true },
        subcategory: { type: String },
        imageUrl: { type: String },
        images: [{ type: String }],
        isActive: { type: Boolean, default: true },
        creationDate: { type: Date, default: Date.now },
        specs: { type: Schema.Types.Mixed }, // Mixed para usara diferentes tipos de specs segun el producto que sea
    },
    { versionKey: false },
)

ProductSchema.index({ category: 1 })
ProductSchema.index({ name: 'text' })

export default mongoose.model<IProduct>('Product', ProductSchema)
