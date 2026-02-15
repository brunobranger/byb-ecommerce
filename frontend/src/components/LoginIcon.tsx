import React from 'react'

interface LoginIconProps {
  onClick?: () => void
}

const LoginIcon: React.FC<LoginIconProps> = ({ onClick }) => {
  return (
    <button onClick={onClick} className="flex items-center gap-x-2 group">
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
          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
        />
      </svg>
      <span className="hidden md:block text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
        Ingresar
      </span>
    </button>
  )
}

export default LoginIcon
