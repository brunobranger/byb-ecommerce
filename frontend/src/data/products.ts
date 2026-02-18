import type { Product } from '../types/product'

// Datos de ejemplo (Mocks) siguiendo el tipo Product
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Procesador AMD Ryzen 7 7800X3D AM5',
    price: 550000,
    stock: 5,
    category: 'Procesadores',
    imageUrl: 'https://via.placeholder.com/400',
    isActive: true,
    creationDate: new Date(),
  },
  {
    id: '2',
    name: 'Placa de Video NVIDIA RTX 4070 Ti Super',
    price: 1150000,
    stock: 0,
    category: 'Placas de video',
    imageUrl: 'https://via.placeholder.com/400',
    isActive: true,
    creationDate: new Date(),
  },
  {
    id: '3',
    name: 'Memoria RAM Corsair Vengeance 32GB DDR5',
    price: 185000,
    stock: 12,
    category: 'Memorias RAM',
    imageUrl: 'https://via.placeholder.com/400',
    isActive: true,
    creationDate: new Date(),
  },
  {
    id: '4',
    name: 'Monitor Samsung Odyssey G5 27" 165Hz',
    price: 480000,
    stock: 3,
    category: 'Monitores',
    imageUrl: 'https://via.placeholder.com/400',
    isActive: true,
    creationDate: new Date(),
  },
  {
    id: '5',
    name: 'Fuente EVGA 750W 80 Plus Gold',
    price: 120000,
    stock: 8,
    category: 'Fuentes',
    imageUrl: 'https://via.placeholder.com/400',
    isActive: true,
    creationDate: new Date(),
  },
]

export default sampleProducts
