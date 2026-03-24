import mongoose, { Schema, type Document } from 'mongoose'
import type { PaymentMethodId } from '../types/paymentMethod'

export interface IOrderItem {
    productId: mongoose.Types.ObjectId
    name: string
    slug: string
    imageUrl?: string
    price: number
    quantity: number
}

export interface IOrder extends Document {
    orderNumber: string
    userId: mongoose.Types.ObjectId
    items: IOrderItem[]
    shippingOption: 'pickup' | 'delivery'
    carrier?: string
    shippingCost: number
    deliveryAddress?: {
        street: string
        city: string
        zip: string
        name: string
        phone: string
    }
    paymentMethod: PaymentMethodId
    subtotal: number
    total: number
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
    createdAt: Date
}

const OrderItemSchema = new Schema<IOrderItem>({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    imageUrl: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
})

const OrderSchema = new Schema<IOrder>(
    {
        orderNumber: { type: String, required: true, unique: true },
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        items: [OrderItemSchema],
        shippingOption: { type: String, enum: ['pickup', 'delivery'], required: true },
        carrier: { type: String },
        shippingCost: { type: Number, required: true, default: 0 },
        deliveryAddress: {
            street: { type: String },
            city: { type: String },
            zip: { type: String },
            name: { type: String },
            phone: { type: String },
        },
        paymentMethod: {
            type: String,
            enum: ['cash', 'bank_deposit', 'credit_card', 'mercado_pago'],
            required: true,
        },
        subtotal: { type: Number, required: true },
        total: { type: Number, required: true },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
            default: 'pending',
        },
    },
    { timestamps: true },
)

OrderSchema.index({ userId: 1 })
OrderSchema.index({ orderNumber: 1 })

export default mongoose.model<IOrder>('Order', OrderSchema)
