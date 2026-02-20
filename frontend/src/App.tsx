import { BrowserRouter, Routes, Route } from 'react-router'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ProductsSection from './components/ProductsSection'
import Auth from './pages/Auth'
import CartScreen from './pages/Cart'
import { CartProvider } from './context/CartContext'
import ProductDetailsPage from './pages/ProductDetailsPage'

function App() {
    return (
        <CartProvider>
            {' '}
            {/* El "paraguas" que cubre toda la app */}
            <BrowserRouter>
                <div className="min-h-screen">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/categoria/:slug" element={<ProductsSection />} />
                        <Route
                            path="/categoria/:categorySlug/:subcategorySlug"
                            element={<ProductsSection />}
                        />
                        <Route path="/producto/:id" element={<ProductDetailsPage />} />
                        <Route path="/productos" element={<ProductsSection />} />
                        <Route path="/ingresar" element={<Auth />} />
                        <Route path="/carrito" element={<CartScreen />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </CartProvider>
    )
}

export default App
