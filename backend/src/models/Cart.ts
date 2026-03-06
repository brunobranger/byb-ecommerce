import mongoose, { Schema, type Document } from 'mongoose'

export interface ICartItem {
    productId: mongoose.Types.ObjectId
    name: string
    slug: string
    imageUrl?: string
    price: number
    priceList: number
    quantity: number
    stock: number
    category: string
}

export interface ICart extends Document {
    userId: mongoose.Types.ObjectId
    items: ICartItem[]
    updatedAt: Date
}

const CartItemSchema = new Schema<ICartItem>({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    imageUrl: { type: String },
    price: { type: Number, required: true },
    priceList: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    stock: { type: Number, required: true },
    category: { type: String, required: true }, // ← agregar
})

const CartSchema = new Schema<ICart>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        items: [CartItemSchema],
    },
    { timestamps: true },
)

export default mongoose.model<ICart>('Cart', CartSchema)
