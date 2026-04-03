export interface UserAddress {
    _id?: string
    label?: string
    street: string
    number: string
    floor?: string
    apartment?: string
    city: string
    zipCode: string
    province: string
    isDefault?: boolean
}

export interface User {
    _id: string
    clientNumber: string
    email: string
    fullName: string
    phone: string
    claseFiscal: string
    tipoDocumento: string
    dni: string
    province: string
    address: string
    postalCode: string
    addresses: UserAddress[]
    role: 'user' | 'admin'
    createdAt: string
}
