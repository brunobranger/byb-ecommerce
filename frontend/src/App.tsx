import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ProductsSection from './components/ProductsSection'
import Auth from './pages/Auth'
import CartScreen from './pages/Cart'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import ProductDetailsPage from './pages/ProductDetailsPage'
import UserProfile from './pages/UserProfile'
import { useAuth } from './context/AuthContext'

import AdminPanel from './pages/AdminPanel'

// Componente para proteger la ruta /perfil
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, loading } = useAuth()

    if (loading) return null // Evita parpadeos mientras carga el localStorage
    return isAuthenticated ? children : <Navigate to="/ingresar" replace />
}

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, loading, user } = useAuth()
    if (loading) return null
    if (!isAuthenticated) return <Navigate to="/ingresar" replace />
    if (user?.role !== 'admin') return <Navigate to="/" replace />
    return children
}

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <BrowserRouter>
                    <div className="min-h-screen bg-white">
                        <Navbar />
                        <Routes>
                            <Route
                                path="/admin"
                                element={
                                    <AdminRoute>
                                        <AdminPanel />
                                    </AdminRoute>
                                }
                            />
                            <Route path="/" element={<Home />} />
                            <Route path="/categoria/:slug" element={<ProductsSection />} />
                            <Route
                                path="/categoria/:categorySlug/:subcategorySlug"
                                element={<ProductsSection />}
                            />
                            <Route path="/producto/:slug" element={<ProductDetailsPage />} />{' '}
                            <Route path="/productos" element={<ProductsSection />} />
                            <Route path="/ingresar" element={<Auth />} />
                            <Route path="/carrito" element={<CartScreen />} />
                            {/* FIX: Ahora la ruta de perfil está protegida */}
                            <Route
                                path="/perfil"
                                element={
                                    <ProtectedRoute>
                                        <UserProfile />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </div>
                </BrowserRouter>
            </CartProvider>
        </AuthProvider>
    )
}

export default App
