import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { productService } from '../services/productService'
import ProductDetails from '../components/ProductDetails'
import type { Product } from '../types/product'

const ProductDetailsPage = () => {
    const { slug } = useParams()
    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        if (!slug) return
        productService
            .getBySlug(slug)
            .then(setProduct)
            .catch(() => setError(true))
            .finally(() => setLoading(false))
    }, [slug])

    if (loading)
        return (
            <div className="min-h-screen bg-white flex items-center justify-center text-black">
                Cargando...
            </div>
        )

    if (error || !product)
        return (
            <div className="min-h-screen bg-white flex items-center justify-center text-black">
                Producto no encontrado
            </div>
        )

    return (
        <div className="min-h-screen bg-white">
            <ProductDetails product={product} />
        </div>
    )
}

export default ProductDetailsPage
