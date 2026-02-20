import type { Product } from '../types/product'
import { useCart } from '../hooks/useCart'
import { Navigate, useNavigate } from 'react-router'

interface ProductCardProps {
    product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const navigate = useNavigate()
    const { addToCart } = useCart()
    return (
        <article className="group bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 flex flex-col">
            <div className="aspect-square bg-white/95 flex items-center justify-center overflow-hidden hover:cursor-pointer">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    onClick={() => navigate(`/producto/${product.id}`)}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                />
            </div>
            <div className="p-4 flex flex-col grow">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">
                    {product.category}
                </span>
                <h4 className="text-white font-bold text-base leading-tight mb-2 line-clamp-2 min-h-10">
                    {product.name}
                </h4>
                <div className="mt-auto flex items-center justify-between">
                    <span className="text-xl font-black text-white">
                        ${product.price.toLocaleString()}
                    </span>
                </div>
            </div>
            <div className="p-4 pt-0">
                <button
                    type="button"
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className="w-full bg-blue-600 hover:bg-blue-500 hover:cursor-pointer text-white font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-blue-600"
                >
                    {product.stock > 0 ? 'Agregar al carrito' : 'Fuera de stock'}
                </button>
            </div>
        </article>
    )
}

export default ProductCard
