import type { Product } from '../types/product'
import type { CPUSpecs, GPUSpecs } from '../types/specs'

// Datos de ejemplo (Mocks) siguiendo el tipo Product
const sampleProducts: Product[] = [
    {
        id: '1',
        name: 'Procesador AMD Ryzen 7 7800X3D AM5',
        price: 550000,
        stock: 5,
        category: 'Procesadores',
        imageUrl:
            'https://fullh4rd.com.ar/img/productos/1/micro-amd-ryzen-7-7800x3d-cvideo-scooler-am5-0.jpg',
        images: [
            'https://fullh4rd.com.ar/img/productos/1/micro-amd-ryzen-7-7800x3d-cvideo-scooler-am5-0.jpg',
            'https://app.contabilium.com/files/explorer/7026/Productos-Servicios/concepto-19782081.jpg',
        ],
        isActive: true,
        creationDate: new Date(),
        specs: {
            // General
            model: '7800X3D',
            family: 'Ryzen 7000 Series',
            socket: 'AM5',
            integratedGpu: 'AMD Radeon Graphics (RDNA 2)',
            overclock: false,
            // Especificaciones de la CPU
            cores: 8,
            threads: 16,
            frequence: 4200,
            turboFrequence: 5000,
            // Coolers y disipadores
            coolerCpu: false,
            tdp: '120 W',
            // Memoria cache
            l1: '512 KB',
            l2: '8 MB',
            l3: '96 MB',
        } satisfies CPUSpecs,
    },
    {
        id: '2',
        name: 'Placa de Video NVIDIA RTX 4070 Ti Super',
        price: 1150000,
        stock: 0,
        category: 'Placas de video',
        imageUrl:
            'https://asset.msi.com/resize/image/global/product/product_17046991811c9eb5d51a82095c16a47e5200365e92.png62405b38c58fe0f07fcef2367d8a9ba1/1024.avif',
        isActive: true,
        creationDate: new Date(),
        specs: {
            // General
            brand: 'NVIDIA',
            model: 'GeForce RTX 4070 Ti Super',
            architecture: 'Ada Lovelace (AD103)',
            coreFreq: 2340,
            turboFreq: 2610,
            // Memoria
            memoryType: 'GDDR6X',
            memoryCap: 16,
            memoryFreq: 21000,
            memoryInterface: 256,
            // Procesadores de stream
            processType: 'CUDA',
            processQuantity: 8448,
            // Dimensiones
            width: '137 mm',
            length: '304 mm',
            // Conectividad
            vga: 0,
            dvi: 0,
            hdmi: 1,
            displayPorts: 3,
            // Energia
            consumption: 285,
            wattsRecommended: 700,
            pcie6: 0,
            pcie8: 0,
            pcie16adaptors: 1,
            pcie16: 1,
            // Coolers y disipadores
            backplate: true,
            blockVgaWater: false,
            coolersFan: 3,
        } satisfies GPUSpecs,
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
