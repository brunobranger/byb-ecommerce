import mongoose, { Schema, type Document } from 'mongoose'

export interface IUser extends Document {
    clientNumber: string
    fullName: string
    email: string
    password: string
    phone: string
    claseFiscal: string
    tipoDocumento: string
    dni: string
    province: string
    address: string
    postalCode: string
    role: 'user' | 'admin'
}

const UserSchema = new Schema<IUser>(
    {
        clientNumber: { type: String, unique: true },
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phone: { type: String, default: '' },
        claseFiscal: { type: String, default: 'Consumidor Final' },
        tipoDocumento: { type: String, default: 'DNI' },
        dni: { type: String, default: '' },
        province: { type: String, default: '' },
        address: { type: String, default: '' },
        postalCode: { type: String, default: '' },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
    },
    {
        versionKey: false,
    },
)

export default mongoose.model<IUser>('User', UserSchema)
