import CartIcon from './CartIcon'
import LoginIcon from './LoginIcon'
import Subcategories from './Subcategories'
import { CATEGORY_DATA, type MainCategoryName } from '../types/category'
import { Link } from 'react-router'
import { useCart } from '../hooks/useCart'

const Navbar = () => {
    // Definimos qué categorías se muestran directamente en la barra inferior.
    // TypeScript validará que estos strings existan exactamente en CATEGORY_DATA.
    const { cartItems } = useCart()
    const mainCategoriesToShow: readonly MainCategoryName[] = [
        'Procesadores',
        'Placas de video',
        'Memorias RAM',
        'Fuentes',
        'Gabinetes',
        'Monitores',
        'Periféricos',
        'Outlet',
    ]

    return (
        <header className="w-full bg-linear-to-b from-zinc-900 to-zinc-950 text-white sticky top-0 z-50 shadow-xl backdrop-blur-sm">
            {/* Contenedor principal con padding lateral */}
            <div className="max-w-7xl mx-auto px-4">
                {/* FILA SUPERIOR: Logo, Buscador y Acciones */}
                <div className="flex items-center justify-between py-4 gap-x-6 md:gap-x-10">
                    {/* 1. Logo moderno */}
                    <div className="shrink-0 cursor-pointer group">
                        <Link to="/" className="flex items-center gap-x-2">
                            <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center font-black text-xl transform group-hover:scale-105 transition-transform duration-300">
                                B
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-xl font-black tracking-tighter bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                                    ByB
                                </span>
                                <span className="text-[10px] font-semibold text-zinc-500 tracking-widest uppercase">
                                    Tech Store
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* 2. Buscador simplificado */}
                    <div className="flex-1 hidden sm:flex items-center">
                        <div className="relative w-full flex items-center bg-zinc-800/50 backdrop-blur-sm rounded-lg border border-zinc-700 overflow-hidden focus-within:border-blue-500 transition-all duration-300">
                            <input
                                type="text"
                                placeholder="Buscar productos..."
                                className="bg-transparent flex-1 px-5 py-2.5 text-sm outline-none placeholder:text-zinc-500 text-white"
                            />
                            <button className="px-4 text-white hover:text-blue-400 transition-colors duration-300">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* 3. Acciones: Login y Carrito */}
                    <div className="flex items-center gap-x-4 md:gap-x-6">
                        <LoginIcon onClick={() => console.log('Login clicked')} />
                        <CartIcon itemCount={cartItems.length} />
                    </div>
                </div>

                {/* FILA INFERIOR: Navegación de categorías dinámicas */}
                <Subcategories categories={CATEGORY_DATA} mainCategories={mainCategoriesToShow} />
            </div>
        </header>
    )
}

export default Navbar
