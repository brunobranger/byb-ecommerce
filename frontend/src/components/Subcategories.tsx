import React from 'react'
import CategoryDropdown from './CategoryDropdown'

interface Subcategory {
  name: string
  items: string[]
}

interface SubcategoriesProps {
  categories: Subcategory[]
  mainCategories: string[]
}

const Subcategories: React.FC<SubcategoriesProps> = ({ categories, mainCategories }) => {
  return (
    <nav className="border-t border-zinc-800 py-3 overflow-x-auto relative">
      <ul className="flex items-center gap-x-8 whitespace-nowrap uppercase text-xs font-bold tracking-wide">
        {/* Botón de Categorías expandible */}
        <CategoryDropdown categories={categories} />

        {/* Categorías principales (sin dropdown) */}
        {mainCategories.map(category => (
          <li
            key={category}
            className="relative cursor-pointer transition-all duration-300 text-zinc-400 hover:text-white group"
          >
            <a href={`/categoria/${category.toLowerCase().replace(/\s+/g, '-')}`}>
              <span
                className={`relative z-10 ${category === 'Outlet' ? 'bg-gradient-to-r from-blue-500 to-blue-400 bg-clip-text text-transparent font-extrabold' : ''}`}
              >
                {category}
              </span>
            </a>
            <span
              className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-300 ${category === 'Outlet' ? 'w-full' : 'w-0 group-hover:w-full'}`}
            ></span>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Subcategories
