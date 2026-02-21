import type { MainCategoryName, SubcategoryName } from './category'
import type { AllProductSpecs } from './specs'
// Definimos Product con un genérico T para que acepte cualquier tipo de specs, segun el producto que sea
// (esto sirve para la ficha tecnica del producto)
export type Product<T = AllProductSpecs> = {
    id: string
    name: string
    price: number
    stock: number
    category: MainCategoryName
    subcategory?: SubcategoryName
    imageUrl?: string
    images?: string[]
    isActive: boolean
    creationDate: Date
    specs?: T
}
