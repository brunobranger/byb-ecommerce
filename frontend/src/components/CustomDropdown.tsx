import { useState } from 'react'

interface CustomDropdownProps {
    currentSort: string
    onSortChange: (sort: string) => void
}

const CustomDropdown = ({ currentSort, onSortChange }: CustomDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false)

    const sortOptions = [
        { value: 'relevance', label: 'Relevancia' },
        { value: 'price_asc', label: 'Precio: Menor a Mayor' },
        { value: 'price_desc', label: 'Precio: Mayor a Menor' },
        { value: 'newest', label: 'Más Recientes' },
    ]

    const selectedOption = sortOptions.find(opt => opt.value === currentSort) || sortOptions[0]

    const handleSelect = (value: string) => {
        onSortChange(value)
        setIsOpen(false)
    }

    return (
        <div className="relative w-64">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-900 hover:border-gray-400 transition-colors flex items-center justify-between"
            >
                <span>{selectedOption.label}</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    {sortOptions.map(option => (
                        <button
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                                currentSort === option.value
                                    ? 'bg-blue-50 text-blue-600 font-bold'
                                    : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default CustomDropdown
