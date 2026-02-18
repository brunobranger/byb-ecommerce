import HeroSection from '../components/HeroSection'
import ProductSection from '../components/ProductSection'
import PromoBanners from '../components/PromoBanners'
import sampleProducts from '../data/products'

const Home = () => {
  return (
    <div>
      <HeroSection />
      <ProductSection firstPart="Últimos" secondPart="Ingresos" products={sampleProducts} />
      <PromoBanners />
      <ProductSection firstPart="Productos" secondPart="Destacados" products={sampleProducts} />
      <ProductSection firstPart="Productos en" secondPart="Oferta" products={sampleProducts} />
    </div>
  )
}

export default Home
