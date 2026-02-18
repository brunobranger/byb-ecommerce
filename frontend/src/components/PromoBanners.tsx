import PCArmadas from '../images/pc-armadas.avif'
import Monitores from '../images/monitores.avif'

const PromoBanners = () => {
  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Banner de PC Armadas */}
        <a
          href="/categoria/pcs-armadas"
          className="block group overflow-hidden rounded-xl transition-transform duration-300 hover:scale-[1.02]"
        >
          <img
            src={PCArmadas}
            alt="Ver PCs Armadas"
            className="w-full h-auto object-cover shadow-lg"
          />
        </a>
        {/* Banner de Monitores */}
        <a
          href="/categoria/monitores"
          className="block group overflow-hidden rounded-xl transition-transform duration-300 hover:scale-[1.02]"
        >
          <img
            src={Monitores}
            alt="Ver Monitores"
            className="w-full h-auto object-cover shadow-lg"
          />
        </a>
      </section>
    </div>
  )
}

export default PromoBanners
