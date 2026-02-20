import type { MainCategoryName, SubcategoryName } from './category'

export type Product = {
    id: string
    name: string
    price: number
    stock: number
    category: MainCategoryName // Solo permitirá nombres del array CATEGORY_DATA
    subcategory?: SubcategoryName // Solo permitirá items de las subcategorías
    imageUrl?: string
    images?: string[] // La diferencia con imageUrl es que, imageUrl es la principal de los carrusel e images es la de productDetails
    isActive: boolean
    creationDate: Date
}
