import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router'

const Auth = () => {
    const { login, loading: authLoading } = useAuth()
    const navigate = useNavigate()

    // Estados para la vista y visibilidad
    const [isLogin, setIsLogin] = useState(true)
    const [showPassword, setShowPassword] = useState(false)

    // Estados para los datos y errores
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phone, setPhone] = useState('') // Estado para el tel en registro
    const [errors, setErrors] = useState({ email: false, password: false })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validamos si están vacíos
        const emailError = email.trim() === ''
        const passwordError = password.trim() === ''

        setErrors({
            email: emailError,
            password: passwordError,
        })

        if (!emailError && !passwordError) {
            try {
                // Si es login, llamamos a la función del contexto
                if (isLogin) {
                    await login(email, password)
                    navigate('/perfil')
                } else {
                    // Por ahora el register lo simulamos
                    console.log('Registrando con:', { email, password, phone })
                    await login(email, password) // Login automático tras registro
                    navigate('/perfil')
                }
            } catch (error) {
                console.error('Error en la autenticación:', error)
                alert('Credenciales incorrectas')
            }
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen w-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-blue-900/20 via-black to-black px-4">
            <form
                noValidate
                onSubmit={handleSubmit}
                className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-2xl shadow-2xl w-full max-w-md flex flex-col gap-6 text-black"
            >
                <div className="text-center mb-4">
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-black">
                        {isLogin ? 'Bienvenido' : 'Crear Cuenta'}
                    </h2>
                    <p className="text-sm text-gray-400">
                        {isLogin
                            ? 'Ingresa tus credenciales para continuar'
                            : 'Completa los datos para registrarte'}
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    {/* Input Email */}
                    <div className="flex flex-col gap-1">
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Email..."
                            disabled={authLoading}
                            className={`bg-black/40 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all disabled:opacity-50`}
                        />
                        {errors.email && (
                            <span className="text-[10px] text-red-500 font-bold uppercase ml-1 animate-pulse">
                                Por favor ingresa tu mail
                            </span>
                        )}
                    </div>

                    {!isLogin && (
                        <input
                            type="tel"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            placeholder="Número de teléfono..."
                            className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    )}

                    {/* Input Contraseña */}
                    <div className="flex flex-col gap-1">
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Contraseña..."
                                disabled={authLoading}
                                className={`bg-black/40 border ${errors.password ? 'border-red-500' : 'border-white/10'} rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-full disabled:opacity-50`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                            >
                                {showPassword ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 17.772 17.772m0 0a10.451 10.451 0 0 1-5.772 1.728c-4.756 0-8.773-3.162-10.065-7.498a10.523 10.523 0 0 1 4.293-5.774M17.772 17.772 6.228 6.228"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <span className="text-[10px] text-red-500 font-bold uppercase ml-1 animate-pulse">
                                Por favor ingresa tu contraseña
                            </span>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={authLoading}
                    className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg uppercase tracking-widest transition-colors shadow-lg shadow-blue-900/20 mt-2 flex items-center justify-center gap-2"
                >
                    {authLoading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Cargando...
                        </>
                    ) : isLogin ? (
                        'Ingresar'
                    ) : (
                        'Registrarme'
                    )}
                </button>

                <p className="text-gray-400 text-xs text-center">
                    {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                    <button
                        type="button"
                        onClick={() => {
                            setIsLogin(!isLogin)
                            setErrors({ email: false, password: false })
                        }}
                        className="ml-2 text-blue-500 font-bold hover:underline uppercase"
                    >
                        {isLogin ? 'Regístrate' : 'Inicia Sesión'}
                    </button>
                </p>
            </form>
        </div>
    )
}

export default Auth
