import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router'
import { productService } from '../services/productService'
import type { Product } from '../types/product'
import { CATEGORY_DATA } from '../types/category'
import SpecsForm from '../components/SpecsForm'

const AdminPanel = () => {
    const { user, isAuthenticated, loading } = useAuth()
    const navigate = useNavigate()

    const [products, setProducts] = useState<Product[]>([])
    const [fetching, setFetching] = useState(true)
    const [view, setView] = useState<'list' | 'create' | 'edit'>('list')
    const [selected, setSelected] = useState<Product | null>(null)

    // Filtros
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('')

    useEffect(() => {
        if (!loading && (!isAuthenticated || user?.role !== 'admin')) {
            navigate('/')
        }
    }, [loading, isAuthenticated, user])

    useEffect(() => {
        productService
            .getAll()
            .then(setProducts)
            .finally(() => setFetching(false))
    }, [])

    // Filtrar productos
    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === '' || p.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    if (loading || fetching)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Cargando...</p>
            </div>
        )

    return (
        <div className="w-full max-w-7xl mx-auto py-12 px-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-black uppercase tracking-tighter">Panel Admin</h1>
                {view === 'list' ? (
                    <button
                        onClick={() => {
                            setSelected(null)
                            setView('create')
                        }}
                        className="bg-blue-900 hover:bg-blue-800 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
                    >
                        + Nuevo producto
                    </button>
                ) : (
                    <button
                        onClick={() => setView('list')}
                        className="text-sm text-blue-600 font-bold hover:underline"
                    >
                        ← Volver
                    </button>
                )}
            </div>

            {view === 'list' && (
                <>
                    {/* Buscador y filtros */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm mb-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Buscador */}
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Buscar producto
                                </label>
                                <div className="flex items-center gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                        stroke="currentColor"
                                        className="w-4 h-4 text-gray-400"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.5 5.5a7.5 7.5 0 0 0 10.5 10.5Z"
                                        />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Ej: Procesador, Monitor..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {searchTerm && (
                                        <button
                                            onClick={() => setSearchTerm('')}
                                            className="text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Filtro por categoría */}
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Categoría
                                </label>
                                <select
                                    value={selectedCategory}
                                    onChange={e => setSelectedCategory(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Todas las categorías</option>
                                    {CATEGORY_DATA.map(c => (
                                        <option key={c.name} value={c.name}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Mostrar resultado del filtrado */}
                        <p className="text-xs text-gray-500 mt-3">
                            Mostrando{' '}
                            <span className="font-bold text-gray-700">
                                {filteredProducts.length}
                            </span>{' '}
                            de <span className="font-bold text-gray-700">{products.length}</span>{' '}
                            productos
                        </p>
                    </div>

                    {/* Tabla */}
                    {filteredProducts.length > 0 ? (
                        <ProductTable
                            products={filteredProducts}
                            onEdit={p => {
                                setSelected(p)
                                setView('edit')
                            }}
                            onToggle={async p => {
                                await productService.updateProduct(p.id, {
                                    isActive: !p.isActive,
                                })
                                setProducts(prev =>
                                    prev.map(x =>
                                        x.id === p.id ? { ...x, isActive: !x.isActive } : x,
                                    ),
                                )
                            }}
                            onStockChange={async (p, stock) => {
                                await productService.updateProduct(p.id, { stock })
                                setProducts(prev =>
                                    prev.map(x => (x.id === p.id ? { ...x, stock } : x)),
                                )
                            }}
                        />
                    ) : (
                        <div className="bg-white border border-gray-200 rounded-2xl p-12 shadow-sm text-center">
                            <p className="text-gray-500 text-sm">
                                No se encontraron productos con esos criterios.
                            </p>
                        </div>
                    )}
                </>
            )}

            {(view === 'create' || view === 'edit') && (
                <ProductForm
                    product={selected}
                    onSave={async () => {
                        const updated = await productService.getAll()
                        setProducts(updated)
                        setView('list')
                    }}
                />
            )}
        </div>
    )
}

// ─── Tabla de productos ───────────────────────────────────────────────────────

const ProductTable = ({
    products,
    onEdit,
    onToggle,
    onStockChange,
}: {
    products: Product[]
    onEdit: (p: Product) => void
    onToggle: (p: Product) => void
    onStockChange: (p: Product, stock: number) => void
}) => (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                    <th className="text-left px-4 py-3 font-bold text-gray-600">Producto</th>
                    <th className="text-left px-4 py-3 font-bold text-gray-600">Categoría</th>
                    <th className="text-left px-4 py-3 font-bold text-gray-600">Precio</th>
                    <th className="text-center px-4 py-3 font-bold text-gray-600">Stock</th>
                    <th className="text-center px-4 py-3 font-bold text-gray-600">Estado</th>
                    <th className="text-center px-4 py-3 font-bold text-gray-600">Acciones</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {products.map(p => (
                    <tr key={p.id} className={!p.isActive ? 'opacity-50' : ''}>
                        <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                                {p.imageUrl && (
                                    <img
                                        src={p.imageUrl}
                                        alt={p.name}
                                        className="w-10 h-10 object-contain bg-gray-50 rounded-lg"
                                    />
                                )}
                                <span className="font-medium text-gray-900 line-clamp-1 max-w-xs">
                                    {p.name}
                                </span>
                            </div>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{p.subcategory ?? p.category}</td>
                        <td className="px-4 py-3 font-bold">${p.price.toLocaleString()}</td>
                        <td className="px-4 py-3 text-center">
                            <input
                                type="number"
                                min={0}
                                defaultValue={p.stock}
                                onBlur={e => {
                                    const val = parseInt(e.target.value)
                                    if (!isNaN(val) && val !== p.stock) onStockChange(p, val)
                                }}
                                className="w-16 text-center border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </td>
                        <td className="px-4 py-3 text-center">
                            <button
                                onClick={() => onToggle(p)}
                                className={`text-xs font-bold px-2.5 py-1 rounded-full transition-colors ${
                                    p.isActive
                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                        : 'bg-red-100 text-red-600 hover:bg-red-200'
                                }`}
                            >
                                {p.isActive ? 'Activo' : 'Inactivo'}
                            </button>
                        </td>
                        <td className="px-4 py-3 text-center">
                            <button
                                onClick={() => onEdit(p)}
                                className="text-blue-600 hover:text-blue-500 font-bold text-xs transition-colors"
                            >
                                Editar
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
)

// ─── Formulario crear/editar ──────────────────────────────────────────────────

const ProductForm = ({ product, onSave }: { product: Product | null; onSave: () => void }) => {
    const isEdit = !!product
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [form, setForm] = useState({
        name: product?.name ?? '',
        price: product?.price?.toString() ?? '',
        stock: product?.stock?.toString() ?? '',
        category: product?.category ?? '',
        subcategory: product?.subcategory ?? '',
        imageUrl: product?.imageUrl ?? '',
        images: product?.images?.join('\n') ?? '',
        specs: product?.specs ?? ({} as Record<string, unknown>),
        isActive: product?.isActive ?? true,
    })

    const set = (key: string, value: string | boolean) =>
        setForm(prev => ({ ...prev, [key]: value }))

    const handleSubmit = async () => {
        setSaving(true)
        setError(null)
        try {
            const payload = {
                name: form.name,
                price: Number(form.price),
                stock: Number(form.stock),
                category: form.category,
                subcategory: form.subcategory || undefined,
                imageUrl: form.imageUrl || undefined,
                images: form.images ? form.images.split('\n').filter(Boolean) : [],
                specs: Object.keys(form.specs).length > 0 ? form.specs : undefined,
                isActive: form.isActive,
            }

            if (isEdit) {
                await productService.updateProduct(product.id, payload)
            } else {
                await productService.createProduct(payload)
            }

            onSave()
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Error guardando producto')
        } finally {
            setSaving(false)
        }
    }

    const field = (label: string, key: string, type = 'text', placeholder = '') => (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {label}
            </label>
            <input
                type={type}
                value={form[key as keyof typeof form] as string}
                onChange={e => set(key, e.target.value)}
                placeholder={placeholder}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    )

    const currentCategory = CATEGORY_DATA.find(c => c.name === form.category)

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-6">
                {isEdit ? 'Editar producto' : 'Nuevo producto'}
            </h2>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {field('Nombre', 'name', 'text', 'Procesador AMD Ryzen...')}
                {field('Precio', 'price', 'number', '550000')}
                {field('Stock', 'stock', 'number', '10')}

                {/* Categoría */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Categoría
                    </label>
                    <select
                        value={form.category}
                        onChange={e => set('category', e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Seleccioná una categoría</option>
                        {CATEGORY_DATA.map(c => (
                            <option key={c.name} value={c.name}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Subcategoría */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Subcategoría
                    </label>
                    <select
                        value={form.subcategory}
                        onChange={e => set('subcategory', e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={!currentCategory}
                    >
                        <option value="">Sin subcategoría</option>
                        {currentCategory?.items.map(item => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>

                {field('URL imagen principal', 'imageUrl', 'text', 'https://...')}

                {/* Imágenes adicionales */}
                <div className="flex flex-col gap-1 sm:col-span-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        URLs de imágenes adicionales{' '}
                        <span className="normal-case font-normal">(una por línea)</span>
                    </label>
                    <textarea
                        value={form.images}
                        onChange={e => set('images', e.target.value)}
                        rows={3}
                        placeholder="https://imagen1.jpg&#10;https://imagen2.jpg"
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                </div>

                {/* Specs JSON */}
                <div className="flex flex-col gap-1 sm:col-span-2">
                    <div className="flex flex-col gap-3 sm:col-span-2">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 pb-1">
                            Especificaciones técnicas
                        </p>
                        <SpecsForm
                            category={form.category}
                            value={form.specs}
                            onChange={specs => setForm(prev => ({ ...prev, specs }))}
                        />
                    </div>
                </div>

                {/* Activo */}
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="isActive"
                        checked={form.isActive}
                        onChange={e => set('isActive', e.target.checked)}
                        className="w-4 h-4 accent-blue-900"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                        Producto activo
                    </label>
                </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="bg-blue-900 hover:bg-blue-800 disabled:bg-blue-900/50 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors"
                >
                    {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear producto'}
                </button>
            </div>
        </div>
    )
}

export default AdminPanel
