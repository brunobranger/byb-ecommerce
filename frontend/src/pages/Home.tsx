import { useState, useEffect } from 'react'
import HeroSection from '../components/HeroSection'
import CarouselSection from '../components/CarouselSection'
import PromoBanners from '../components/PromoBanners'
import { productService } from '../services/productService'
import type { Product } from '../types/product'

const Home = () => {
    const [products, setProducts] = useState<Product[]>([])

    useEffect(() => {
        productService
            .getAll({})
            .then(setProducts)
            .catch(() => setProducts([]))
    }, [])

    return (
        <div>
            <HeroSection />
            <CarouselSection firstPart="Últimos" secondPart="Ingresos" products={products} />
            <PromoBanners />
            <CarouselSection firstPart="Productos" secondPart="Destacados" products={products} />
            <CarouselSection firstPart="Productos en" secondPart="Oferta" products={products} />
        </div>
    )
}

export default Home
