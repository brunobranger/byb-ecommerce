import { useEffect, useState } from 'react'
import CPUImage from '../images/cpu-image.avif'
import PCGamer from '../images/pc-gamer.avif'

const HeroSection = () => {
  const images = [CPUImage, PCGamer]
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length)
    }, 4000)
    return () => {
      clearInterval(timer)
    }
  }, [currentIndex])

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Imagen del Hero (publicitarias) */}
      <div className="overflow-hidden rounded-2xl shadow-lg">
        <img
          key={currentIndex}
          src={images[currentIndex]}
          className="w-full h-auto aspect-21/9 object-cover animate-slide-right"
        />
      </div>
      {/* Botones para poder cambiar entre imagenes */}
      <div className="pagination-container flex justify-center items-center py-4">
        <div className="pagination-swiper flex gap-2">
          {images.map((_img, index) => {
            const isActive = index == currentIndex
            return (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-500 ease-in-out ${isActive ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'} `}
                onClick={() => setCurrentIndex(index)}
              ></button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default HeroSection
