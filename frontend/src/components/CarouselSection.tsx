import { useRef } from 'react'
import ProductCard from './ProductCard'
import type { Product } from '../types/product'

interface CarouselSectionProps {
    firstPart: string // Ejemplo: "Últimos" o "Productos"
    secondPart: string // Ejemplo: "Ingresos" o "Destacados"
    products: Product[]
}

const CarouselSection: React.FC<CarouselSectionProps> = ({ firstPart, secondPart, products }) => {
    const scrollRef = useRef<HTMLDivElement>(null)

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef
            const scrollAmount = 350

            current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            })
        }
    }

    return (
        <div className="w-full max-w-7xl mx-auto py-12 px-4">
            <section>
                {/* ENCABEZADO: Título y Botones alineados */}
                <div className="flex items-end justify-between mb-8 border-b border-zinc-800 pb-5">
                    <div className="flex flex-col">
                        <h3 className="text-black text-3xl font-black uppercase tracking-tighter leading-none">
                            <span className="mr-2">{firstPart}</span>
                            <span className="text-blue-500">{secondPart}</span>
                        </h3>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => scroll('left')}
                            className="w-11 h-11 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-blue-600 hover:border-blue-500 transition-all duration-300 text-white group shadow-xl"
                            aria-label="Anterior"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={3}
                                stroke="currentColor"
                                className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 19.5 8.25 12l7.5-7.5"
                                />
                            </svg>
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="w-11 h-11 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-blue-600 hover:border-blue-500 transition-all duration-300 text-white group shadow-xl"
                            aria-label="Siguiente"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={3}
                                stroke="currentColor"
                                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* CONTENEDOR DEL CARRUSEL */}
                <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-6 hide-scrollbar"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {products.map(prod => (
                        <div
                            key={prod.id}
                            className="min-w-70 sm:min-w-75 md:min-w-[320px] snap-start"
                        >
                            <ProductCard product={prod} />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default CarouselSection
