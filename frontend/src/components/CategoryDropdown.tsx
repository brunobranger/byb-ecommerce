import React, { useState, useRef, useEffect } from 'react'

interface Subcategory {
  name: string
  items: string[]
}

interface CategoryDropdownProps {
  categories: Subcategory[]
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ categories }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const buttonRef = useRef<HTMLLIElement>(null)

  // Referencias para los timeouts (cierre del menú principal y de submenús)
  const closeTimeoutRef = useRef<NodeJS.Timeout>()
  const submenuTimeoutRef = useRef<NodeJS.Timeout>()

  // Actualiza la posición del dropdown cuando se abre
  useEffect(() => {
    const updatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        setDropdownPosition({
          top: rect.bottom + 8,
          left: rect.left,
        })
      }
    }

    if (isOpen) {
      updatePosition()
      window.addEventListener('scroll', updatePosition)
      window.addEventListener('resize', updatePosition)
    }

    return () => {
      window.removeEventListener('scroll', updatePosition)
      window.removeEventListener('resize', updatePosition)
    }
  }, [isOpen])

  // Limpia los timeouts al desmontar el componente
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
      if (submenuTimeoutRef.current) clearTimeout(submenuTimeoutRef.current)
    }
  }, [])

  // --- Manejadores para el menú principal (botón "Categorías" y el dropdown) ---
  const handleMainMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = undefined
    }
    setIsOpen(true)
  }

  const handleMainMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false)
      setActiveCategory(null) // También ocultamos subcategorías al cerrar el menú
    }, 150) // Pequeño retraso para permitir volver a entrar
  }

  // --- Manejadores para cada categoría (hover sobre el ítem del menú) ---
  const handleCategoryMouseEnter = (categoryName: string) => {
    if (submenuTimeoutRef.current) {
      clearTimeout(submenuTimeoutRef.current)
      submenuTimeoutRef.current = undefined
    }
    setActiveCategory(categoryName)
  }

  const handleCategoryMouseLeave = () => {
    submenuTimeoutRef.current = setTimeout(() => {
      setActiveCategory(null)
    }, 150) // Retraso antes de ocultar el submenú, permite moverse hacia él
  }

  // --- Manejadores para el submenú (cuando el mouse está sobre las subcategorías) ---
  const handleSubmenuMouseEnter = (categoryName: string) => {
    if (submenuTimeoutRef.current) {
      clearTimeout(submenuTimeoutRef.current)
      submenuTimeoutRef.current = undefined
    }
    setActiveCategory(categoryName) // Aseguramos que la categoría siga activa
  }

  const handleSubmenuMouseLeave = () => {
    submenuTimeoutRef.current = setTimeout(() => {
      setActiveCategory(null)
    }, 150)
  }

  return (
    <>
      <li
        ref={buttonRef}
        className="flex items-center gap-x-2 bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 rounded-lg cursor-pointer hover:from-blue-500 hover:to-blue-400 transition-all duration-300 transform hover:scale-105"
        onMouseEnter={handleMainMouseEnter}
        onMouseLeave={handleMainMouseLeave}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
        <span>Categorías</span>
      </li>

      {/* Dropdown principal */}
      {isOpen && (
        <div
          className="fixed w-72 bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 rounded-lg shadow-2xl overflow-visible" // ← Cambiado a overflow-visible
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            zIndex: 9999,
          }}
          onMouseEnter={handleMainMouseEnter}
          onMouseLeave={handleMainMouseLeave}
        >
          {categories.map(category => (
            <div
              key={category.name}
              className="relative"
              onMouseEnter={() => handleCategoryMouseEnter(category.name)}
              onMouseLeave={handleCategoryMouseLeave}
            >
              <a
                href={`/categoria/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="block px-5 py-3 hover:bg-zinc-800/80 cursor-pointer transition-colors border-b border-zinc-800/50 last:border-b-0 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {category.name}
                  </span>
                  {category.items.length > 0 && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-4 h-4 text-zinc-500 group-hover:text-blue-400 transition-colors"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m8.25 4.5 7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  )}
                </div>
              </a>

              {/* Submenú de subcategorías (solo si hay items y la categoría está activa) */}
              {activeCategory === category.name && category.items.length > 0 && (
                <div
                  className="absolute left-full top-0 ml-1 w-64 bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 rounded-lg shadow-2xl max-h-96 overflow-y-auto" // ← Eliminado overflow-hidden
                  style={{ zIndex: 10000 }}
                  onMouseEnter={() => handleSubmenuMouseEnter(category.name)}
                  onMouseLeave={handleSubmenuMouseLeave}
                >
                  {category.items.map(item => (
                    <a
                      key={item}
                      href={`/categoria/${category.name.toLowerCase().replace(/\s+/g, '-')}/${item.toLowerCase().replace(/\s+/g, '-')}`}
                      className="block px-5 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors border-b border-zinc-800/30 last:border-b-0"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default CategoryDropdown
