import { useState } from 'react'

const CustomDropdown = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [selected, setSelected] = useState('Destacados')

    const options = ['Destacados', 'Precio: Menor a Mayor', 'Precio: Mayor a Menor']

    return (
        <div className="relative inline-block text-left">
            {/* Botón que activa el menú */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-64 px-4 py-2 bg-white border rounded-md shadow-sm"
            >
                {selected}
                <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {/* Menú desplegable */}
            {isOpen && (
                <div className="absolute right-0 z-10 w-64 mt-2 bg-white border rounded-md shadow-lg">
                    {options.map(opt => (
                        <button
                            key={opt}
                            className="block w-full px-4 py-2 text-left hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
                            onClick={() => {
                                setSelected(opt)
                                setIsOpen(false)
                            }}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default CustomDropdown
