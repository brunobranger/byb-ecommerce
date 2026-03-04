import { useParams } from 'react-router'
import sampleProducts from '../data/products'
import ProductDetails from '../components/ProductDetails'

const ProductDetailsPage = () => {
    const { slug } = useParams()
    const product = sampleProducts.find(p => p.slug === slug)

    if (!product)
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
