import React from 'react'
import CategoryDropdown from './CategoryDropdown'
import type { CategoryMenu, MainCategoryName } from '../types/category'
import { Link } from 'react-router'

interface SubcategoriesProps {
    categories: readonly CategoryMenu[]
    mainCategories: readonly MainCategoryName[]
}

const Subcategories: React.FC<SubcategoriesProps> = ({ categories, mainCategories }) => {
    const formatSlug = (text: string) => text.toLowerCase().replace(/\s+/g, '-')

    return (
        <nav className="border-t border-zinc-800 py-3 overflow-x-auto relative">
            <ul className="flex items-center gap-x-8 whitespace-nowrap uppercase text-xs font-bold tracking-wide">
                <CategoryDropdown categories={categories} />

                {mainCategories.map(category => (
                    <li
                        key={category}
                        className="relative cursor-pointer transition-all duration-300 text-zinc-400 hover:text-white group"
                    >
                        <Link to={`/categoria/${formatSlug(category)}`}>
                            <span
                                className={`relative z-10 ${category === 'Outlet' ? 'bg-linear-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent font-extrabold' : ''}`}
                            >
                                {category}
                            </span>
                        </Link>
                        <span
                            className={`absolute bottom-0 left-0 h-0.5 bg-linear-to-r from-blue-600 to-blue-400 transition-all duration-300 ${category === 'Outlet' ? 'w-full' : 'w-0 group-hover:w-full'}`}
                        ></span>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

export default Subcategories
