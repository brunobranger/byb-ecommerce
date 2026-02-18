export const CATEGORY_DATA = [
  { name: 'Procesadores', items: ['AMD', 'Intel'] },
  { name: 'Placas de video', items: ['NVIDIA', 'AMD Radeon', 'Intel'] },
  { name: 'Memorias RAM', items: ['DDR4', 'DDR5'] },
  { name: 'Almacenamiento', items: ['SSD M.2 NVMe', 'SSD SATA', 'HDD'] },
  { name: 'Motherboards', items: [] },
  { name: 'Fuentes', items: ['500W', '650W', '750W', '850W', '1000W'] },
  {
    name: 'Gabinetes',
    items: ['Mini Tower', 'Mid Tower', 'Full Tower', 'Con RGB', 'Minimalistas'],
  },
  {
    name: 'Refrigeración',
    items: ['Coolers CPU', 'Refrigeración Líquida', 'Pasta Térmica', 'Ventiladores'],
  },
  { name: 'Monitores', items: ['1080p', '2K', '4K'] },
  {
    name: 'Periféricos',
    items: [
      'Teclados Mecánicos',
      'Mouse Gaming',
      'Auriculares',
      'Webcams',
      'Micrófonos',
      'Alfombrillas',
    ],
  },
  { name: 'Outlet', items: [] }, // Agregado para consistencia
] as const

// Extracción de tipos automática
export type MainCategoryName = (typeof CATEGORY_DATA)[number]['name']
export type SubcategoryName = (typeof CATEGORY_DATA)[number]['items'][number]

// Tipo para la estructura del Navbar
export interface CategoryMenu {
  readonly name: MainCategoryName
  readonly items: readonly SubcategoryName[]
}
