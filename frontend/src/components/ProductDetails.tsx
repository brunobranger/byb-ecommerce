import { useState } from 'react'
import { ShoppingCart, Shield, Truck, CheckCircle, Copy } from 'lucide-react'
import type { Product } from '../types/product'
import DataSheet from './DataSheet'

interface ProductDetailsProps {
    product: Product
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
    // Estado para manejar qué imagen se muestra en grande (índice de la imagen activa)
    const [selectedImage, setSelectedImage] = useState(0)

    // Imágenes del producto
    const images = product.images?.length
        ? product.images
        : [product.imageUrl ?? '', product.imageUrl ?? '', product.imageUrl ?? '']

    // Precio con tarjeta: 15% más que el precio base (despues seguramente lo cambie)
    const cardPrice = (product.price * 1.15).toLocaleString('es-AR')
    const cashPrice = product.price.toLocaleString('es-AR')
    const installmentPrice = ((product.price * 1.15) / 6).toLocaleString('es-AR', {
        maximumFractionDigits: 0,
    })

    return (
        <div className="w-full max-w-7xl mx-auto py-12 px-6">
            {/* Seccion que muestra la imagen del producto a la izquierda y sus detalles con precio a la derecha */}
            <section className="flex flex-col lg:flex-row gap-12">
                {/* Div que muestra la imagen */}
                <div className="flex flex-col gap-4 lg:w-120 shrink-0">
                    {/* Imagen principal (cambia según el estado selectedImage) */}
                    <div className="bg-white rounded-2xl border border-zinc-800 flex items-center justify-center p-8 aspect-square overflow-hidden">
                        <img
                            src={images[selectedImage]}
                            alt={product.name}
                            className="w-full h-full object-contain transition-opacity duration-300"
                        />
                    </div>

                    {/* Swiper con imagenes (la primera siempre es la que se esta mostrando apenas se entra a la pagina) */}
                    <div className="flex gap-3">
                        {images.map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImage(index)}
                                className={`w-24 h-24 rounded-xl border-2 overflow-hidden bg-white flex items-center justify-center p-2 transition-all duration-200 shrink-0
                                    ${
                                        selectedImage === index
                                            ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                                            : 'border-zinc-800 hover:border-zinc-600'
                                    }`}
                            >
                                <img
                                    src={img}
                                    alt={`Vista ${index + 1}`}
                                    className="w-full h-full object-contain"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Div que muestra los details */}
                <div className="flex-1 flex flex-col gap-6">
                    {/* Este div muestra la categoria/subcategoria, por ejemplo, Procesadores > AMD si es un Ryzen 5 el producto */}
                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                        <span className="hover:text-zinc-300 cursor-pointer transition-colors">
                            {product.category}
                        </span>
                        {product.subcategory && (
                            <>
                                <span className="text-zinc-700">›</span>
                                <span className="text-blue-400">{product.subcategory}</span>
                            </>
                        )}
                    </div>

                    {/* Este div muestra el nombre del producto */}
                    <div>
                        <span className="text-black text-2xl font-black leading-tight tracking-tight">
                            {product.name}
                        </span>
                    </div>

                    {/* Este div muestra el SKU o ID (el SKU todavia no lo tengo implementado) */}
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-zinc-400 bg-white border border-zinc-700 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                            ID: {product.id} {/* Aca muestra el ID */}
                            <Copy
                                size={11}
                                className="text-zinc-500 cursor-pointer hover:text-zinc-300 transition-colors"
                            />
                        </span>
                    </div>

                    {/* Este div es un container que va a mostrar dos secciones distintas, una con el precio y otra con el precio con tarjeta */}
                    <div className="flex flex-col gap-3">
                        {/* Mejor precio (efectivo / transferencia / depósito) */}
                        <div className="bg-white border border-zinc-800 rounded-2xl p-5 flex flex-col gap-1">
                            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                                Mejor precio
                            </span>
                            <span className="text-3xl font-black text-zinc-800">$ {cashPrice}</span>
                            {/* Aca van algunos detalles como "abonando con efectivo o transferencia o deposito bancario" */}
                            <span className="text-sm text-blue-400 font-medium">
                                5% de descuento abonando con efectivo, transferencia o depósito
                            </span>
                        </div>

                        {/* Otros medios de pago | Pago con tarjeta (12 cuotas fijas) */}
                        <div className="bg-white border border-zinc-800 rounded-2xl p-5 flex flex-col gap-1">
                            {/* Aca va el precio de pago con tarjeta y algun texto de "Ver Cuotas" para mostrar ese detalle. Tambien un "6 cuotas sin interes con..."*/}
                            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                                Otros medios de pago
                            </span>
                            <div className="flex items-center justify-between">
                                <span className="text-2xl font-black text-zinc-800">
                                    $ {cardPrice}
                                </span>
                                <button className="text-xs text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors">
                                    Ver cuotas
                                </button>
                            </div>
                            <span className="text-sm text-zinc-400">
                                6 cuotas sin interés de{' '}
                                <span className="text-blue-400 font-bold">
                                    $ {installmentPrice}
                                </span>
                            </span>
                        </div>
                    </div>

                    {/* Div que muestra stock disponible + garantia + envios a todo el pais */}
                    <div className="flex flex-col gap-2.5">
                        <span className="flex items-center gap-2 text-sm text-zinc-900">
                            <CheckCircle size={16} className="text-emerald-400 shrink-0" />
                            Stock disponible
                        </span>
                        <span className="flex items-center gap-2 text-sm text-zinc-900">
                            <Shield size={16} className="text-blue-400 shrink-0" />
                            Garantía — 24 meses
                        </span>
                        <span className="flex items-center gap-2 text-sm text-zinc-900">
                            <Truck size={16} className="text-blue-400 shrink-0" />
                            Envíos a todo el país
                        </span>
                    </div>

                    <button
                        type="button"
                        className="flex items-center justify-center gap-3 w-full sm:w-auto sm:px-10 py-4 rounded-xl font-black text-white text-base tracking-wide bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 active:scale-95 transition-all duration-200 shadow-lg shadow-blue-600/30"
                    >
                        <ShoppingCart size={20} />
                        Agregar al carrito
                    </button>
                </div>
            </section>
            <DataSheet product={product} />
        </div>
    )
}

export default ProductDetails
