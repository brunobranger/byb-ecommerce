import React from 'react'
import { Link } from 'react-router'

interface CartIconProps {
    itemCount?: number
}

const CartIcon: React.FC<CartIconProps> = ({ itemCount = 0 }) => {
    return (
        <Link to="/carrito" className="flex items-center gap-x-2 group">
            <div className="relative">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6 text-white group-hover:text-blue-400 group-hover:scale-110 transition-all duration-300"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                    />
                </svg>
                {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-600 to-blue-500 text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold border-2 border-zinc-900">
                        {itemCount}
                    </span>
                )}
            </div>
            <span className="hidden md:block text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                Carrito
            </span>
        </Link>
    )
}

export default CartIcon
