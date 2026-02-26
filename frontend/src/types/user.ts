export interface UserAddress {
    street: string
    number: string
    floor?: string
    apartment?: string
    city: string
    zipCode: string
    province: string
}

export interface User {
    id: string
    clientNumber: string
    fullName: string
    email: string
    phone: string
    claseFiscal: string
    tipoDocumento: string
    dni: string
    province: string
    address: string
    postalCode: string
    role: 'user' | 'admin'
}
