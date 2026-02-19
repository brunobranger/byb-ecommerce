import { useParams } from 'react-router'
import sampleProducts from '../data/products'
import ProductCard from './ProductCard'
import type { Product } from '../types/product'
import CustomDropdown from './CustomDropdown'
import { CATEGORY_DATA } from '../types/category'

const ProductsSection = () => {
    const { slug } = useParams()

    // Buscamos la categoría actual basada en el slug de la URL
    const currentCategory = CATEGORY_DATA.find(
        cat => cat.name.toLowerCase().replace(/\s+/g, '-') === slug,
    )

    return (
        <div className="w-full max-w-7xl mx-auto py-12 px-6">
            {/* Seccion "centrada" (no exacto pero no empieza en los bordes) */}
            <section>
                {/* Div que contiene el titulo y el filtrado */}
                <div className="flex items-end justify-between mb-10 border-b border-gray-800 pb-8">
                    {/* Titulo */}
                    <div>
                        <h2 className="text-black text-3xl font-black uppercase tracking-tighter leading-none">
                            {/*Si hay slug muestra la categoría, si no, "Productos" */}
                            {currentCategory ? currentCategory.name : 'Productos'}
                        </h2>
                    </div>
                    {/* Filtro */}
                    <div>
                        <CustomDropdown />
                    </div>
                </div>

                {/* Div que contiene listado de categorias y productos a su lado */}
                <div className="flex flex-col md:flex-row gap-12">
                    {/* Listado de categorias con subcategorias */}
                    <aside className="w-full md:w-64 shrink-0">
                        <ul className="space-y-6">
                            {slug && currentCategory ? (
                                // --- MODO CATEGORÍA: Solo muestra subcategorías del slug actual ---
                                <>
                                    <li className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                                        Filtros de {currentCategory.name}
                                    </li>
                                    {currentCategory.items.map(subItem => (
                                        <li
                                            key={subItem}
                                            className="text-sm text-gray-600 hover:text-cyan-600 cursor-pointer transition-colors py-1"
                                        >
                                            {subItem}
                                        </li>
                                    ))}
                                </>
                            ) : (
                                // --- MODO PRODUCTOS: Muestra el listado general de categorías ---
                                <>
                                    <li className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                                        Todas las Categorías
                                    </li>
                                    {CATEGORY_DATA.map(category => (
                                        <li key={category.name} className="group">
                                            <span className="text-sm font-black uppercase tracking-widest text-gray-900 group-hover:text-cyan-600 transition-colors cursor-pointer">
                                                {category.name}
                                            </span>
                                        </li>
                                    ))}
                                </>
                            )}
                        </ul>
                    </aside>

                    {/* Grid que muestra product cards de la categoria seleccioanda */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {/* El mapeo se encarga de mostrar las cards, el espaciado lo da el gap-8 */}
                            {sampleProducts.map((product: Product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ProductsSection
