import mongoose, { Schema, type Document } from 'mongoose'

// Tipo del subdocumento con _id garantizado
type IUserAddress = {
    _id: mongoose.Types.ObjectId
    label?: string
    street: string
    number: string
    floor?: string
    apartment?: string
    city: string
    zipCode: string
    province: string
    isDefault: boolean
}

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
    addresses: mongoose.Types.DocumentArray<mongoose.Types.Subdocument & IUserAddress>
}

const AddressSchema = new Schema<IUserAddress>({
    label: { type: String, default: '' },
    street: { type: String, required: true },
    number: { type: String, required: true },
    floor: { type: String, default: '' },
    apartment: { type: String, default: '' },
    city: { type: String, required: true },
    zipCode: { type: String, required: true },
    province: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
})

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
        addresses: { type: [AddressSchema], default: [] },
    },
    {
        versionKey: false,
        timestamps: true,
    },
)

export default mongoose.model<IUser>('User', UserSchema)
