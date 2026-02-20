import { useParams } from 'react-router'
import sampleProducts from '../data/products'
import ProductCard from './ProductCard'
import type { Product } from '../types/product'
import CustomDropdown from './CustomDropdown'
import { CATEGORY_DATA } from '../types/category'
import { Link } from 'react-router'

const formatSlug = (text: string) => text.toLowerCase().replace(/\s+/g, '-')

const ProductsSection = () => {
    // Soporta ambas rutas:
    // /categoria/:categorySlug
    // /categoria/:categorySlug/:subcategorySlug
    const { categorySlug, subcategorySlug, slug } = useParams()

    // Compatibilidad con la ruta /categoria/:slug (la ruta vieja usa "slug")
    const activeSlug = categorySlug ?? slug

    // Categoría activa basada en el slug
    const currentCategory = CATEGORY_DATA.find(cat => formatSlug(cat.name) === activeSlug)

    // Subcategoría activa (si existe)
    const currentSubcategory = subcategorySlug
        ? currentCategory?.items.find(item => formatSlug(item) === subcategorySlug)
        : undefined

    // Título dinámico: subcategoría > categoría > "Productos"
    const pageTitle = currentSubcategory
        ? currentSubcategory
        : currentCategory
          ? currentCategory.name
          : 'Productos'

    return (
        <div className="w-full max-w-7xl mx-auto py-12 px-6">
            <section>
                {/* Titulo y filtrado */}
                <div className="flex items-end justify-between mb-10 border-b border-gray-800 pb-8">
                    <div>
                        <h2 className="text-black text-3xl font-black uppercase tracking-tighter leading-none">
                            {pageTitle}
                        </h2>
                        {/* Breadcrumb si hay subcategoría */}
                        {currentSubcategory && currentCategory && (
                            <p className="text-sm text-gray-400 mt-1">
                                <Link
                                    to={`/categoria/${activeSlug}`}
                                    className="hover:text-cyan-600 transition-colors"
                                >
                                    {currentCategory.name}
                                </Link>
                                {' / '}
                                <span className="text-cyan-600">{currentSubcategory}</span>
                            </p>
                        )}
                    </div>
                    <div>
                        <CustomDropdown />
                    </div>
                </div>

                {/* Sidebar + Productos */}
                <div className="flex flex-col md:flex-row gap-12">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 shrink-0">
                        <ul className="space-y-2">
                            {activeSlug && currentCategory ? (
                                // MODO CATEGORÍA: muestra subcategorías del slug actual
                                <>
                                    <li className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                                        Filtros de {currentCategory.name}
                                    </li>
                                    {/* Opción "Ver todos" de la categoría */}
                                    <li>
                                        <Link
                                            to={`/categoria/${activeSlug}`}
                                            className={`text-sm cursor-pointer transition-colors py-1 block ${
                                                !subcategorySlug
                                                    ? 'text-cyan-600 font-bold'
                                                    : 'text-gray-600 hover:text-cyan-600'
                                            }`}
                                        >
                                            Todos
                                        </Link>
                                    </li>
                                    {currentCategory.items.map(subItem => {
                                        const subItemSlug = formatSlug(subItem)
                                        const isActive = subItemSlug === subcategorySlug

                                        return (
                                            <li key={subItem}>
                                                <Link
                                                    to={`/categoria/${activeSlug}/${subItemSlug}`}
                                                    className={`text-sm cursor-pointer transition-colors py-1 block ${
                                                        isActive
                                                            ? 'text-cyan-600 font-bold'
                                                            : 'text-gray-600 hover:text-cyan-600'
                                                    }`}
                                                >
                                                    {subItem}
                                                </Link>
                                            </li>
                                        )
                                    })}
                                </>
                            ) : (
                                // MODO GENERAL: todas las categorías
                                <>
                                    <li className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                                        Todas las Categorías
                                    </li>
                                    {CATEGORY_DATA.map(category => (
                                        <li key={category.name} className="group">
                                            <Link
                                                to={`/categoria/${formatSlug(category.name)}`}
                                                className="text-sm font-black uppercase tracking-widest text-gray-900 group-hover:text-cyan-600 transition-colors cursor-pointer block py-1"
                                            >
                                                {category.name}
                                            </Link>
                                        </li>
                                    ))}
                                </>
                            )}
                        </ul>
                    </aside>

                    {/* Grid de productos */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
