import { useState } from 'react'
import type {
    AllProductSpecs,
    CPUSpecs,
    GPUSpecs,
    RAMSpecs,
    PSUSpecs,
    CASESpecs,
    MonitorSpecs,
} from '../types/specs'
import type { Product } from '../types/product'

interface DataSheetProps {
    product: Product<any>
}

// Tipo auxiliar para representar una fila de especificacion
type SpecRow = { label: string; value: string | number | boolean | undefined | null }

// Tipo auxiliar para representar una seccion de especificaciones (titulo + filas)
type SpecSection = { title: string; rows: SpecRow[] }

// Formatea cualquier valor para mostrarlo como string legible
const fmt = (v: string | number | boolean | undefined | null | string[]): string => {
    if (v === null || v === undefined) return '—'
    if (typeof v === 'boolean') return v ? 'Sí' : 'No'
    if (Array.isArray(v)) return v.join(', ')
    return String(v)
}

//  Builders de secciones por tipo de producto

function buildCPUSections(s: CPUSpecs): SpecSection[] {
    return [
        {
            title: 'Características Generales',
            rows: [
                { label: 'Modelo', value: s.model },
                { label: 'Familia', value: s.family },
                { label: 'Socket', value: s.socket },
                { label: 'GPU integrada', value: s.integratedGpu ?? 'No incluye' },
                { label: 'Overclock', value: s.overclock },
            ],
        },
        {
            title: 'Especificaciones de la CPU',
            rows: [
                { label: 'Núcleos', value: s.cores },
                { label: 'Hilos', value: s.threads },
                { label: 'Frecuencia', value: `${s.frequence} MHz` },
                { label: 'Frecuencia turbo', value: `${s.turboFrequence} MHz` },
            ],
        },
        {
            title: 'Coolers y Disipadores',
            rows: [
                { label: 'Incluye cooler CPU', value: s.coolerCpu },
                { label: 'TDP predeterminado', value: s.tdp },
            ],
        },
        {
            title: 'Memoria Caché',
            rows: [
                { label: 'L1', value: s.l1 },
                { label: 'L2', value: s.l2 },
                { label: 'L3', value: s.l3 },
            ],
        },
    ]
}

function buildGPUSections(s: GPUSpecs): SpecSection[] {
    return [
        {
            title: 'Características Generales',
            rows: [
                { label: 'Marca', value: s.brand },
                { label: 'Modelo', value: s.model },
                { label: 'Arquitectura', value: s.architecture },
                { label: 'Frecuencia núcleo', value: `${s.coreFreq} MHz` },
                { label: 'Frecuencia turbo', value: `${s.turboFreq} MHz` },
            ],
        },
        {
            title: 'Memoria',
            rows: [
                { label: 'Tipo', value: s.memoryType },
                { label: 'Capacidad', value: `${s.memoryCap} GB` },
                { label: 'Frecuencia', value: `${s.memoryFreq} MHz` },
                { label: 'Interfaz', value: `${s.memoryInterface} bits` },
            ],
        },
        {
            title: 'Procesadores de Stream',
            rows: [
                { label: 'Tipo', value: s.processType },
                { label: 'Cantidad', value: s.processQuantity },
            ],
        },
        {
            title: 'Conectividad',
            rows: [
                { label: 'VGA', value: s.vga },
                { label: 'DVI', value: s.dvi },
                { label: 'HDMI', value: s.hdmi },
                { label: 'Display Ports', value: s.displayPorts },
            ],
        },
        {
            title: 'Energía',
            rows: [
                { label: 'Consumo', value: `${s.consumption} W` },
                { label: 'Fuente recomendada', value: `${s.wattsRecommended} W` },
                { label: 'PCIe 6-pin', value: s.pcie6 },
                { label: 'PCIe 8-pin', value: s.pcie8 },
                { label: 'PCIe 16-pin', value: s.pcie16 },
                { label: 'Adaptadores PCIe 16-pin', value: s.pcie16adaptors },
            ],
        },
        {
            title: 'Coolers y Disipadores',
            rows: [
                { label: 'Backplate', value: s.backplate },
                { label: 'Block VGA agua', value: s.blockVgaWater },
                { label: 'Ventiladores', value: s.coolersFan },
            ],
        },
    ]
}

function buildRAMSections(s: RAMSpecs): SpecSection[] {
    return [
        {
            title: 'Características Generales',
            rows: [
                { label: 'Capacidad', value: `${s.capacity} GB` },
                { label: 'Frecuencia', value: `${s.freq} MHz` },
                { label: 'Tipo', value: s.type },
                { label: 'Latencia', value: `CL${s.latency}` },
                { label: 'Consumo', value: `${s.wattage} W` },
                { label: 'SO-DIMM', value: s.sodimm },
            ],
        },
        {
            title: 'Coolers y Disipadores',
            rows: [
                { label: 'Disipador', value: s.heatsink },
                { label: 'Disipador alto', value: s.highHeatsink },
            ],
        },
    ]
}

function buildPSUSections(s: PSUSpecs): SpecSection[] {
    return [
        {
            title: 'Características Generales',
            rows: [
                { label: 'Formato', value: s.format },
                { label: 'Watts nominales', value: `${s.wattsNom} W` },
                { label: 'Watts reales', value: `${s.wattsTrue} W` },
                { label: 'Certificación', value: s.certification ?? 'Sin certificación' },
                { label: 'Tipo de cableado', value: s.cableType },
                { label: 'Modo híbrido', value: s.hibridMode },
                { label: 'PSU digital', value: s.digitalPSU },
                { label: 'Color', value: s.color },
                { label: 'RGB', value: s.rgb },
                { label: 'Presión inferior', value: s.bottomPressure },
            ],
        },
        {
            title: 'Cableado',
            rows: [
                { label: 'Pin 24', value: s.pin24 },
                { label: 'Pin 4', value: s.pin4 },
                { label: 'Pin 4+4', value: s.pin4plus },
                { label: 'Pin 6', value: s.pin6 },
                { label: 'Pin 2+2', value: s.pin2plus },
                { label: 'Conectores SATA', value: s.sataConnections },
                { label: 'Conectores Molex', value: s.molexConnections },
                { label: 'Conectores Floppy', value: s.floppyConnections },
            ],
        },
        {
            title: 'Kit',
            rows: [{ label: 'Cable 220V incluido', value: s.cable220 }],
        },
    ]
}

function buildCASESections(s: CASESpecs): SpecSection[] {
    return [
        {
            title: 'Características Generales',
            rows: [
                { label: 'Tamaño', value: s.caseSize },
                { label: 'Color', value: s.color },
                { label: 'Ventana', value: s.window },
                { label: 'Tipo de ventana', value: s.windowType },
                { label: 'Motherboards soportadas', value: s.motherBoards.join(', ') },
                { label: 'Tipo PSU', value: s.PSUType },
            ],
        },
        {
            title: 'Dimensiones',
            rows: [
                { label: 'Ancho', value: `${s.width} mm` },
                { label: 'Alto', value: `${s.height} mm` },
                { label: 'Profundidad', value: `${s.depth} mm` },
                { label: 'Largo máx. GPU', value: `${s.vgaMaxLength} mm` },
                { label: 'Alto máx. cooler CPU', value: `${s.coolerCpuMaxHeight} mm` },
            ],
        },
        {
            title: 'Conectividad',
            rows: [
                { label: 'USB 2.0', value: s.usbTwo },
                { label: 'USB 3.0', value: s.usbThree },
                { label: 'USB-C', value: s.usbC },
                { label: 'USB-C interno', value: s.usbCinside },
                { label: 'Audio', value: s.audio },
                { label: 'Lector de tarjetas', value: s.cardReader },
            ],
        },
        {
            title: 'Unidades Soportadas',
            rows: [
                { label: '5.25"', value: s.fiveDot25 },
                { label: 'Slots', value: s.slots },
                { label: '2.5"', value: s.twoDotFive },
                { label: '3.5"', value: s.threeDotFive },
                { label: '3.25"', value: s.threeDot25 },
            ],
        },
        {
            title: 'Coolers y Disipadores',
            rows: [
                { label: '80mm soportados', value: s.MmSupported80 },
                { label: '80mm incluidos', value: s.MmIncluded80 },
                { label: '120mm soportados', value: s.MmSupported120 },
                { label: '120mm incluidos', value: s.MmIncluded120 },
                { label: '140mm soportados', value: s.MmSupported140 },
                { label: '140mm incluidos', value: s.MmIncluded140 },
                { label: '200mm soportados', value: s.MmSupported200 },
                { label: '200mm incluidos', value: s.MmIncluded200 },
                { label: 'Iluminación', value: s.lightning },
                { label: 'Controlador iluminación', value: s.lightningController },
                { label: 'Espacio watercooling', value: s.waterCoolingSpace },
            ],
        },
    ]
}

function buildMonitorSections(s: MonitorSpecs): SpecSection[] {
    return [
        {
            title: 'Características Generales',
            rows: [
                { label: 'Tipo de retroiluminación', value: s.lightningType },
                { label: 'Tipo de panel', value: s.panelType },
                { label: 'Pantalla curva', value: s.curveDisplay },
                { label: 'Curvatura', value: s.curveDisplay ? `${s.curvature}R` : '—' },
            ],
        },
        {
            title: 'Dimensiones',
            rows: [
                { label: 'Ancho', value: `${s.width} mm` },
                { label: 'Alto', value: `${s.height} mm` },
                { label: 'Grosor', value: `${s.thickness} mm` },
            ],
        },
        {
            title: 'Conectividad',
            rows: [
                { label: 'HDMI', value: s.hdmiTotal },
                { label: 'Display Port', value: s.dpTotal },
                { label: 'Mini DP', value: s.dpMini },
                { label: 'VGA', value: s.vga },
                { label: 'DVI', value: s.dvi },
                { label: 'USB 2.0', value: s.usbTwo },
                { label: 'USB 3.0', value: s.usbThree },
                { label: 'USB 3.1', value: s.usbThreeDotOne },
                { label: 'Jack 3.5mm', value: s.threeDotFiveJack },
                { label: 'Salida auriculares', value: s.headphonesConnection },
            ],
        },
        {
            title: 'Display',
            rows: [
                { label: 'Pulgadas', value: `${s.inches}"` },
                { label: 'Resolución máxima', value: `${s.maxRes}p` },
                { label: 'Frecuencia máxima', value: `${s.maxHz} Hz` },
                { label: 'Colores', value: s.colorsQuantity },
                { label: 'Tiempo de respuesta', value: `${s.timeResponse} ms` },
                { label: 'Ángulo vertical', value: `${s.verticalAngle}°` },
                { label: 'Ángulo horizontal', value: `${s.horizontalAngle}°` },
                { label: 'Touch', value: s.touchDisplay },
                { label: 'NVIDIA G-Sync', value: s.nvidiaGsync },
                { label: 'AMD FreeSync', value: s.amdFreesync },
            ],
        },
        {
            title: 'Energía',
            rows: [{ label: 'Consumo', value: `${s.consumption} W` }],
        },
    ]
}

// Detecta el tipo de specs segun las propiedades del objeto y devuelve las secciones correspondientes
function buildSections(specs: AllProductSpecs): SpecSection[] {
    if ('cores' in specs) return buildCPUSections(specs as CPUSpecs)
    if ('architecture' in specs) return buildGPUSections(specs as GPUSpecs)
    if ('latency' in specs) return buildRAMSections(specs as RAMSpecs)
    if ('wattsNom' in specs) return buildPSUSections(specs as PSUSpecs)
    if ('caseSize' in specs) return buildCASESections(specs as CASESpecs)
    if ('panelType' in specs) return buildMonitorSections(specs as MonitorSpecs)
    return []
}

const TABS = ['Especificaciones', 'Preguntas'] as const
type Tab = (typeof TABS)[number]

const DataSheet = ({ product }: DataSheetProps) => {
    const { specs } = product

    // Estado para manejar la tab activa
    const [activeTab, setActiveTab] = useState<Tab>('Especificaciones')

    if (!specs)
        return (
            <div className="w-full max-w-7xl mx-auto py-12 px-4">
                <div className="flex items-center justify-center min-h-50">
                    <span>No hay especificaciones de este producto</span>
                </div>
            </div>
        )

    // Construye las secciones a partir de las specs del producto
    const sections = buildSections(specs)

    // Divide las secciones en dos columnas para el layout de la ficha
    const mid = Math.ceil(sections.length / 2)
    const leftSections = sections.slice(0, mid)
    const rightSections = sections.slice(mid)

    return (
        <div className="w-full max-w-7xl mx-auto py-12 px-4">
            {/* Seccion principal que contiene Estadisticas + Preguntas */}
            <section className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
                {/* Aca va un filter tab para cambiar entre especificaciones y preguntas */}
                <div className="flex border-b border-zinc-200 px-6">
                    {/* Especificaciones */}
                    <div>
                        {TABS.map(tab => {
                            const isActive = tab === activeTab
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`
                                        px-5 py-4 text-xs font-bold tracking-widest uppercase transition-colors duration-200
                                        border-b-2 -mb-px
                                        ${
                                            isActive
                                                ? 'border-blue-500 text-blue-500'
                                                : 'border-transparent text-zinc-400 hover:text-zinc-600'
                                        }
                                    `}
                                >
                                    {tab}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Esta seccion contiene varios contenedores con distinta información */}
                <div className="p-7">
                    {/* Tab de Especificaciones */}
                    {activeTab === 'Especificaciones' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10">
                            {/* Columna izquierda */}
                            <div>
                                {leftSections.map(section => (
                                    /* Caracteristicas generales + el resto de secciones de la izquierda */
                                    <div key={section.title} className="mb-7">
                                        {/* Titulo de la seccion con linea separadora */}
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-xs font-bold tracking-widest uppercase text-zinc-800 whitespace-nowrap">
                                                {section.title}
                                            </span>
                                            <div className="flex-1 h-px bg-blue-500" />
                                        </div>

                                        {/* Filas de specs con zebra striping */}
                                        <div className="rounded-xl overflow-hidden border border-zinc-200">
                                            {section.rows.map((row, i) => (
                                                <div
                                                    key={row.label}
                                                    className={`flex justify-between items-center px-4 py-2.5 text-sm ${
                                                        i % 2 === 1 ? 'bg-zinc-50' : 'bg-white'
                                                    }`}
                                                >
                                                    <span className="text-zinc-500 font-medium">
                                                        {row.label}
                                                    </span>
                                                    <span className="text-zinc-800 text-right max-w-[55%]">
                                                        {fmt(
                                                            row.value as
                                                                | string
                                                                | number
                                                                | boolean
                                                                | null
                                                                | undefined,
                                                        )}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Columna derecha */}
                            <div>
                                {rightSections.map(section => (
                                    <div key={section.title} className="mb-7">
                                        {/* Titulo de la seccion con linea separadora */}
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-xs font-bold tracking-widest uppercase text-zinc-800 whitespace-nowrap">
                                                {section.title}
                                            </span>
                                            <div className="flex-1 h-px bg-blue-500" />
                                        </div>

                                        {/* Filas de specs con zebra striping */}
                                        <div className="rounded-xl overflow-hidden border border-zinc-200">
                                            {section.rows.map((row, i) => (
                                                <div
                                                    key={row.label}
                                                    className={`flex justify-between items-center px-4 py-2.5 text-sm ${
                                                        i % 2 === 1 ? 'bg-zinc-50' : 'bg-white'
                                                    }`}
                                                >
                                                    <span className="text-zinc-500 font-medium">
                                                        {row.label}
                                                    </span>
                                                    <span className="text-zinc-800 text-right max-w-[55%]">
                                                        {fmt(
                                                            row.value as
                                                                | string
                                                                | number
                                                                | boolean
                                                                | null
                                                                | undefined,
                                                        )}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tab de Preguntas */}
                    {activeTab === 'Preguntas' && (
                        <div>
                            <span className="text-sm text-zinc-400">No hay preguntas todavía.</span>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

export default DataSheet
