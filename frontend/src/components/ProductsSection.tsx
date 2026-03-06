import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router'
import ProductCard from './ProductCard'
import type { Product } from '../types/product'
import CustomDropdown from './CustomDropdown'
import { CATEGORY_DATA } from '../types/category'
import { Link } from 'react-router'
import { productService } from '../services/productService'

const formatSlug = (text: string) => text.toLowerCase().replace(/\s+/g, '-')

// ─── Sidebar para /productos ────

const CategorySidebar = () => {
    const [expanded, setExpanded] = useState<Set<string>>(new Set(CATEGORY_DATA.map(c => c.name)))

    const toggle = (name: string) => {
        setExpanded(prev => {
            const next = new Set(prev)
            next.has(name) ? next.delete(name) : next.add(name)
            return next
        })
    }

    return (
        <ul className="space-y-0">
            <li className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                Todas las Categorías
            </li>

            {CATEGORY_DATA.map(category => {
                const slug = formatSlug(category.name)
                const isOpen = expanded.has(category.name)
                const hasItems = category.items && category.items.length > 0

                return (
                    <li key={category.name}>
                        <div className="flex items-center justify-between group">
                            <Link
                                to={`/categoria/${slug}`}
                                className="text-sm font-black uppercase tracking-widest text-gray-900 hover:text-cyan-600 transition-colors cursor-pointer block py-1.5 flex-1"
                            >
                                {category.name}
                            </Link>
                            {hasItems && (
                                <button
                                    onClick={() => toggle(category.name)}
                                    className="p-1 text-gray-400 hover:text-cyan-600 transition-colors"
                                    aria-label={isOpen ? 'Contraer' : 'Expandir'}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2.5}
                                        stroke="currentColor"
                                        className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m19.5 8.25-7.5 7.5-7.5-7.5"
                                        />
                                    </svg>
                                </button>
                            )}
                        </div>

                        {hasItems && isOpen && (
                            <ul className="mb-1 border-l border-gray-200 ml-1 pl-3 space-y-0">
                                {category.items.map(subItem => (
                                    <li key={subItem}>
                                        <Link
                                            to={`/categoria/${slug}/${formatSlug(subItem)}`}
                                            className="text-xs text-gray-500 hover:text-cyan-600 transition-colors py-1 block"
                                        >
                                            {subItem}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                )
            })}
        </ul>
    )
}

// ─── Componente principal ────

const ProductsSection = () => {
    const { categorySlug, subcategorySlug, slug } = useParams()
    const [searchParams] = useSearchParams()
    const searchQuery = searchParams.get('search') || ''

    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    const activeSlug = categorySlug ?? slug

    const currentCategory = CATEGORY_DATA.find(cat => formatSlug(cat.name) === activeSlug)
    const currentSubcategory = subcategorySlug
        ? currentCategory?.items.find(item => formatSlug(item) === subcategorySlug)
        : undefined

    // Fetch al backend — se re-ejecuta cuando cambia categoría, subcategoría o búsqueda
    useEffect(() => {
        setLoading(true)
        productService
            .getAll({
                category: currentCategory?.name,
                subcategory: currentSubcategory,
                search: searchQuery || undefined,
            })
            .then(setProducts)
            .catch(() => setProducts([]))
            .finally(() => setLoading(false))
    }, [currentCategory?.name, currentSubcategory, searchQuery])

    const pageTitle = searchQuery
        ? `Resultados: ${searchQuery}`
        : currentSubcategory
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
                        <div className="flex gap-2 items-center mt-1">
                            {currentCategory && (
                                <p className="text-sm text-gray-400">
                                    <Link
                                        to={`/categoria/${activeSlug}`}
                                        className="hover:text-cyan-600 transition-colors"
                                    >
                                        {currentCategory.name}
                                    </Link>
                                    {currentSubcategory && (
                                        <>
                                            {' / '}
                                            <span className="text-cyan-600">
                                                {currentSubcategory}
                                            </span>
                                        </>
                                    )}
                                </p>
                            )}
                            {searchQuery && (
                                <p className="text-sm text-gray-400">
                                    Mostrando {products.length} resultados
                                </p>
                            )}
                        </div>
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
                                // MODO CATEGORÍA — sin cambios
                                <>
                                    <li className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                                        Filtros de {currentCategory.name}
                                    </li>
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
                                // MODO GENERAL — acordeón con subcategorías
                                <li className="list-none">
                                    <CategorySidebar />
                                </li>
                            )}
                        </ul>
                    </aside>

                    {/* Grid de productos */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="py-20 text-center">
                                <p className="text-gray-400 font-medium">Cargando productos...</p>
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {products.map((product: Product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center border-2 border-dashed border-gray-200 rounded-xl">
                                <p className="text-gray-500 font-medium">
                                    No se encontraron productos con estos criterios.
                                </p>
                                <Link
                                    to="/productos"
                                    className="text-cyan-600 text-sm font-bold mt-4 block hover:underline"
                                >
                                    Ver todo el catálogo
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ProductsSection
