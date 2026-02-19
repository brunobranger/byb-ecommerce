import HeroSection from '../components/HeroSection'
import CarouselSection from '../components/CarouselSection'
import PromoBanners from '../components/PromoBanners'
import sampleProducts from '../data/products'

const Home = () => {
    return (
        <div>
            <HeroSection />
            <CarouselSection firstPart="Últimos" secondPart="Ingresos" products={sampleProducts} />
            <PromoBanners />
            <CarouselSection
                firstPart="Productos"
                secondPart="Destacados"
                products={sampleProducts}
            />
            <CarouselSection
                firstPart="Productos en"
                secondPart="Oferta"
                products={sampleProducts}
            />
        </div>
    )
}

export default Home
