import type {
    CPUSpecs,
    GPUSpecs,
    RAMSpecs,
    PSUSpecs,
    CASESpecs,
    MonitorSpecs,
} from '../types/specs'

type SpecsFormProps = {
    category: string
    value: Record<string, unknown>
    onChange: (specs: Record<string, unknown>) => void
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const inputClass =
    'border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full'
const labelClass = 'text-xs font-semibold text-gray-500 uppercase tracking-wider'

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-1">
        <label className={labelClass}>{label}</label>
        {children}
    </div>
)

type FieldProps = {
    label: string
    value: string | number | boolean | undefined
    onChange: (v: string | number | boolean) => void
    type?: 'text' | 'number' | 'checkbox'
    placeholder?: string
}

const F = ({ label, value, onChange, type = 'text', placeholder }: FieldProps) => (
    <Field label={label}>
        {type === 'checkbox' ? (
            <div className="flex items-center gap-2 mt-1">
                <input
                    type="checkbox"
                    checked={!!value}
                    onChange={e => onChange(e.target.checked)}
                    className="w-4 h-4 accent-blue-900"
                />
                <span className="text-sm text-gray-600">{value ? 'Sí' : 'No'}</span>
            </div>
        ) : (
            <input
                type={type}
                value={(value as string) ?? ''}
                onChange={e =>
                    onChange(type === 'number' ? Number(e.target.value) : e.target.value)
                }
                placeholder={placeholder}
                className={inputClass}
            />
        )}
    </Field>
)

const SectionTitle = ({ title }: { title: string }) => (
    <div className="col-span-1 sm:col-span-2 mt-2">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 pb-1">
            {title}
        </p>
    </div>
)

// ─── Formularios por tipo ─────────────────────────────────────────────────────

const CPUForm = ({ s, set }: { s: Partial<CPUSpecs>; set: (k: string, v: unknown) => void }) => (
    <>
        <SectionTitle title="General" />
        <F label="Modelo" value={s.model} onChange={v => set('model', v)} placeholder="7800X3D" />
        <F
            label="Familia"
            value={s.family}
            onChange={v => set('family', v)}
            placeholder="Ryzen 7000 Series"
        />
        <F label="Socket" value={s.socket} onChange={v => set('socket', v)} placeholder="AM5" />
        <F
            label="GPU integrada"
            value={s.integratedGpu}
            onChange={v => set('integratedGpu', v)}
            placeholder="AMD Radeon Graphics"
        />
        <F
            label="Overclock"
            value={s.overclock}
            onChange={v => set('overclock', v)}
            type="checkbox"
        />

        <SectionTitle title="Rendimiento" />
        <F
            label="Núcleos"
            value={s.cores}
            onChange={v => set('cores', v)}
            type="number"
            placeholder="8"
        />
        <F
            label="Hilos"
            value={s.threads}
            onChange={v => set('threads', v)}
            type="number"
            placeholder="16"
        />
        <F
            label="Frecuencia base (MHz)"
            value={s.frequence}
            onChange={v => set('frequence', v)}
            type="number"
            placeholder="4200"
        />
        <F
            label="Frecuencia turbo (MHz)"
            value={s.turboFrequence}
            onChange={v => set('turboFrequence', v)}
            type="number"
            placeholder="5000"
        />

        <SectionTitle title="Cooler y TDP" />
        <F
            label="Incluye cooler"
            value={s.coolerCpu}
            onChange={v => set('coolerCpu', v)}
            type="checkbox"
        />
        <F label="TDP" value={s.tdp} onChange={v => set('tdp', v)} placeholder="120 W" />

        <SectionTitle title="Caché" />
        <F label="L1" value={s.l1} onChange={v => set('l1', v)} placeholder="512 KB" />
        <F label="L2" value={s.l2} onChange={v => set('l2', v)} placeholder="8 MB" />
        <F label="L3" value={s.l3} onChange={v => set('l3', v)} placeholder="96 MB" />
    </>
)

const GPUForm = ({ s, set }: { s: Partial<GPUSpecs>; set: (k: string, v: unknown) => void }) => (
    <>
        <SectionTitle title="General" />
        <F label="Marca" value={s.brand} onChange={v => set('brand', v)} placeholder="NVIDIA" />
        <F
            label="Modelo"
            value={s.model}
            onChange={v => set('model', v)}
            placeholder="GeForce RTX 4070"
        />
        <F
            label="Arquitectura"
            value={s.architecture}
            onChange={v => set('architecture', v)}
            placeholder="Ada Lovelace (AD104)"
        />
        <F
            label="Frecuencia núcleo (MHz)"
            value={s.coreFreq}
            onChange={v => set('coreFreq', v)}
            type="number"
            placeholder="1920"
        />
        <F
            label="Frecuencia turbo (MHz)"
            value={s.turboFreq}
            onChange={v => set('turboFreq', v)}
            type="number"
            placeholder="2505"
        />

        <SectionTitle title="Memoria" />
        <F
            label="Tipo de memoria"
            value={s.memoryType}
            onChange={v => set('memoryType', v)}
            placeholder="GDDR6X"
        />
        <F
            label="Capacidad (GB)"
            value={s.memoryCap}
            onChange={v => set('memoryCap', v)}
            type="number"
            placeholder="12"
        />
        <F
            label="Frecuencia memoria (MHz)"
            value={s.memoryFreq}
            onChange={v => set('memoryFreq', v)}
            type="number"
            placeholder="21000"
        />
        <F
            label="Interfaz (bits)"
            value={s.memoryInterface}
            onChange={v => set('memoryInterface', v)}
            type="number"
            placeholder="192"
        />

        <SectionTitle title="Procesadores de stream" />
        <F
            label="Tipo"
            value={s.processType}
            onChange={v => set('processType', v)}
            placeholder="CUDA"
        />
        <F
            label="Cantidad"
            value={s.processQuantity}
            onChange={v => set('processQuantity', v)}
            type="number"
            placeholder="5888"
        />

        <SectionTitle title="Dimensiones" />
        <F label="Ancho" value={s.width} onChange={v => set('width', v)} placeholder="126 mm" />
        <F label="Largo" value={s.length} onChange={v => set('length', v)} placeholder="261 mm" />

        <SectionTitle title="Conectividad" />
        <F label="VGA" value={s.vga} onChange={v => set('vga', v)} type="number" placeholder="0" />
        <F label="DVI" value={s.dvi} onChange={v => set('dvi', v)} type="number" placeholder="0" />
        <F
            label="HDMI"
            value={s.hdmi}
            onChange={v => set('hdmi', v)}
            type="number"
            placeholder="1"
        />
        <F
            label="Display Ports"
            value={s.displayPorts}
            onChange={v => set('displayPorts', v)}
            type="number"
            placeholder="3"
        />

        <SectionTitle title="Energía" />
        <F
            label="Consumo (W)"
            value={s.consumption}
            onChange={v => set('consumption', v)}
            type="number"
            placeholder="200"
        />
        <F
            label="Fuente recomendada (W)"
            value={s.wattsRecommended}
            onChange={v => set('wattsRecommended', v)}
            type="number"
            placeholder="650"
        />
        <F
            label="PCIe 6-pin"
            value={s.pcie6}
            onChange={v => set('pcie6', v)}
            type="number"
            placeholder="0"
        />
        <F
            label="PCIe 8-pin"
            value={s.pcie8}
            onChange={v => set('pcie8', v)}
            type="number"
            placeholder="1"
        />
        <F
            label="PCIe 16-pin"
            value={s.pcie16}
            onChange={v => set('pcie16', v)}
            type="number"
            placeholder="0"
        />
        <F
            label="Adaptadores PCIe 16-pin"
            value={s.pcie16adaptors}
            onChange={v => set('pcie16adaptors', v)}
            type="number"
            placeholder="0"
        />

        <SectionTitle title="Cooler" />
        <F
            label="Backplate"
            value={s.backplate}
            onChange={v => set('backplate', v)}
            type="checkbox"
        />
        <F
            label="Block VGA agua"
            value={s.blockVgaWater}
            onChange={v => set('blockVgaWater', v)}
            type="checkbox"
        />
        <F
            label="Ventiladores"
            value={s.coolersFan}
            onChange={v => set('coolersFan', v)}
            type="number"
            placeholder="2"
        />
    </>
)

const RAMForm = ({ s, set }: { s: Partial<RAMSpecs>; set: (k: string, v: unknown) => void }) => (
    <>
        <SectionTitle title="General" />
        <F
            label="Capacidad (GB)"
            value={s.capacity}
            onChange={v => set('capacity', v)}
            type="number"
            placeholder="32"
        />
        <F
            label="Frecuencia (MHz)"
            value={s.freq}
            onChange={v => set('freq', v)}
            type="number"
            placeholder="6000"
        />
        <F
            label="Tipo (DDR4 / DDR5)"
            value={s.type}
            onChange={v => set('type', v)}
            placeholder="DDR5"
        />
        <F
            label="Latencia (CL)"
            value={s.latency}
            onChange={v => set('latency', v)}
            type="number"
            placeholder="36"
        />
        <F
            label="Consumo (W)"
            value={s.wattage}
            onChange={v => set('wattage', v)}
            type="number"
            placeholder="1.35"
        />

        <SectionTitle title="Cooler" />
        <F
            label="Disipador"
            value={s.heatsink}
            onChange={v => set('heatsink', v)}
            type="checkbox"
        />
        <F
            label="Disipador alto"
            value={s.highHeatsink}
            onChange={v => set('highHeatsink', v)}
            type="checkbox"
        />

        <SectionTitle title="Compatibilidad" />
        <F
            label="SO-DIMM (laptop)"
            value={s.sodimm}
            onChange={v => set('sodimm', v)}
            type="checkbox"
        />
    </>
)

const PSUForm = ({ s, set }: { s: Partial<PSUSpecs>; set: (k: string, v: unknown) => void }) => (
    <>
        <SectionTitle title="General" />
        <F label="Formato" value={s.format} onChange={v => set('format', v)} placeholder="ATX" />
        <F
            label="Watts nominales"
            value={s.wattsNom}
            onChange={v => set('wattsNom', v)}
            type="number"
            placeholder="750"
        />
        <F
            label="Watts reales"
            value={s.wattsTrue}
            onChange={v => set('wattsTrue', v)}
            type="number"
            placeholder="750"
        />
        <F
            label="Certificación"
            value={s.certification}
            onChange={v => set('certification', v)}
            placeholder="80 Plus Gold"
        />
        <F
            label="Tipo de cableado"
            value={s.cableType}
            onChange={v => set('cableType', v)}
            placeholder="Modular"
        />
        <F
            label="Modo híbrido"
            value={s.hibridMode}
            onChange={v => set('hibridMode', v)}
            type="checkbox"
        />
        <F
            label="PSU digital"
            value={s.digitalPSU}
            onChange={v => set('digitalPSU', v)}
            type="checkbox"
        />
        <F label="Color" value={s.color} onChange={v => set('color', v)} placeholder="Negro" />
        <F label="RGB" value={s.rgb} onChange={v => set('rgb', v)} type="checkbox" />
        <F
            label="Presión inferior"
            value={s.bottomPressure}
            onChange={v => set('bottomPressure', v)}
            type="checkbox"
        />

        <SectionTitle title="Cableado" />
        <F label="Pin 24" value={s.pin24} onChange={v => set('pin24', v)} type="checkbox" />
        <F
            label="Pin 4"
            value={s.pin4}
            onChange={v => set('pin4', v)}
            type="number"
            placeholder="1"
        />
        <F
            label="Pin 4+4"
            value={s.pin4plus}
            onChange={v => set('pin4plus', v)}
            type="number"
            placeholder="2"
        />
        <F
            label="Pin 6"
            value={s.pin6}
            onChange={v => set('pin6', v)}
            type="number"
            placeholder="0"
        />
        <F
            label="Pin 2+2"
            value={s.pin2plus}
            onChange={v => set('pin2plus', v)}
            type="number"
            placeholder="4"
        />
        <F
            label="SATA"
            value={s.sataConnections}
            onChange={v => set('sataConnections', v)}
            type="number"
            placeholder="6"
        />
        <F
            label="Molex"
            value={s.molexConnections}
            onChange={v => set('molexConnections', v)}
            type="number"
            placeholder="2"
        />
        <F
            label="Floppy"
            value={s.floppyConnections}
            onChange={v => set('floppyConnections', v)}
            type="number"
            placeholder="0"
        />

        <SectionTitle title="Kit" />
        <F
            label="Cable 220V incluido"
            value={s.cable220}
            onChange={v => set('cable220', v)}
            type="checkbox"
        />
    </>
)

const CASEForm = ({ s, set }: { s: Partial<CASESpecs>; set: (k: string, v: unknown) => void }) => (
    <>
        <SectionTitle title="General" />
        <F
            label="Tamaño (Mid-Tower, etc)"
            value={s.caseSize}
            onChange={v => set('caseSize', v)}
            placeholder="Mid-Tower"
        />
        <F label="Color" value={s.color} onChange={v => set('color', v)} placeholder="Negro" />
        <F label="Ventana" value={s.window} onChange={v => set('window', v)} type="checkbox" />
        <F
            label="Tipo de ventana"
            value={s.windowType}
            onChange={v => set('windowType', v)}
            placeholder="Vidrio templado"
        />
        <F
            label="Motherboards soportadas"
            value={(s.motherBoards ?? []).join(', ')}
            onChange={v =>
                set(
                    'motherBoards',
                    String(v)
                        .split(',')
                        .map(x => x.trim()),
                )
            }
            placeholder="ATX, Micro-ATX, Mini-ITX"
        />
        <F
            label="Tipo de fuente"
            value={s.PSUType}
            onChange={v => set('PSUType', v)}
            placeholder="ATX"
        />

        <SectionTitle title="Dimensiones" />
        <F label="Ancho (mm)" value={s.width} onChange={v => set('width', v)} type="number" />
        <F label="Alto (mm)" value={s.height} onChange={v => set('height', v)} type="number" />
        <F label="Profundidad (mm)" value={s.depth} onChange={v => set('depth', v)} type="number" />
        <F
            label="Largo máx. GPU (mm)"
            value={s.vgaMaxLength}
            onChange={v => set('vgaMaxLength', v)}
            type="number"
        />
        <F
            label="Alto máx. cooler CPU (mm)"
            value={s.coolerCpuMaxHeight}
            onChange={v => set('coolerCpuMaxHeight', v)}
            type="number"
        />

        <SectionTitle title="Conectividad frontal" />
        <F
            label="USB 2.0"
            value={s.usbTwo}
            onChange={v => set('usbTwo', v)}
            type="number"
            placeholder="2"
        />
        <F
            label="USB 3.0"
            value={s.usbThree}
            onChange={v => set('usbThree', v)}
            type="number"
            placeholder="2"
        />
        <F
            label="USB-C"
            value={s.usbC}
            onChange={v => set('usbC', v)}
            type="number"
            placeholder="1"
        />
        <F
            label="USB-C interno"
            value={s.usbCinside}
            onChange={v => set('usbCinside', v)}
            type="number"
            placeholder="0"
        />
        <F label="Audio" value={s.audio} onChange={v => set('audio', v)} type="checkbox" />
        <F
            label="Lector de tarjetas"
            value={s.cardReader}
            onChange={v => set('cardReader', v)}
            type="checkbox"
        />

        <SectionTitle title="Bahías" />
        <F
            label='5.25"'
            value={s.fiveDot25}
            onChange={v => set('fiveDot25', v)}
            type="number"
            placeholder="0"
        />
        <F
            label="Slots expansión"
            value={s.slots}
            onChange={v => set('slots', v)}
            type="number"
            placeholder="7"
        />
        <F
            label='2.5"'
            value={s.twoDotFive}
            onChange={v => set('twoDotFive', v)}
            type="number"
            placeholder="2"
        />
        <F
            label='3.5"'
            value={s.threeDotFive}
            onChange={v => set('threeDotFive', v)}
            type="number"
            placeholder="2"
        />
        <F
            label='3.25"'
            value={s.threeDot25}
            onChange={v => set('threeDot25', v)}
            type="number"
            placeholder="0"
        />

        <SectionTitle title="Ventilación" />
        <F
            label="80mm soportados"
            value={s.MmSupported80}
            onChange={v => set('MmSupported80', v)}
            type="number"
            placeholder="0"
        />
        <F
            label="80mm incluidos"
            value={s.MmIncluded80}
            onChange={v => set('MmIncluded80', v)}
            type="number"
            placeholder="0"
        />
        <F
            label="120mm soportados"
            value={s.MmSupported120}
            onChange={v => set('MmSupported120', v)}
            type="number"
            placeholder="3"
        />
        <F
            label="120mm incluidos"
            value={s.MmIncluded120}
            onChange={v => set('MmIncluded120', v)}
            type="number"
            placeholder="1"
        />
        <F
            label="140mm soportados"
            value={s.MmSupported140}
            onChange={v => set('MmSupported140', v)}
            type="number"
            placeholder="2"
        />
        <F
            label="140mm incluidos"
            value={s.MmIncluded140}
            onChange={v => set('MmIncluded140', v)}
            type="number"
            placeholder="0"
        />
        <F
            label="200mm soportados"
            value={s.MmSupported200}
            onChange={v => set('MmSupported200', v)}
            type="number"
            placeholder="0"
        />
        <F
            label="200mm incluidos"
            value={s.MmIncluded200}
            onChange={v => set('MmIncluded200', v)}
            type="number"
            placeholder="0"
        />
        <F
            label="Iluminación"
            value={s.lightning}
            onChange={v => set('lightning', v)}
            placeholder="ARGB"
        />
        <F
            label="Controlador de iluminación"
            value={s.lightningController}
            onChange={v => set('lightningController', v)}
            type="checkbox"
        />
        <F
            label="Espacio water cooling"
            value={s.waterCoolingSpace}
            onChange={v => set('waterCoolingSpace', v)}
            type="checkbox"
        />
    </>
)

const MonitorForm = ({
    s,
    set,
}: {
    s: Partial<MonitorSpecs>
    set: (k: string, v: unknown) => void
}) => (
    <>
        <SectionTitle title="Pantalla" />
        <F
            label="Pulgadas"
            value={s.inches}
            onChange={v => set('inches', v)}
            type="number"
            placeholder="27"
        />
        <F
            label="Resolución máx."
            value={s.maxRes}
            onChange={v => set('maxRes', v)}
            type="number"
            placeholder="2560"
        />
        <F
            label="Frecuencia máx. (Hz)"
            value={s.maxHz}
            onChange={v => set('maxHz', v)}
            type="number"
            placeholder="165"
        />
        <F
            label="Tiempo de respuesta (ms)"
            value={s.timeResponse}
            onChange={v => set('timeResponse', v)}
            type="number"
            placeholder="1"
        />
        <F
            label="Tipo de panel"
            value={s.panelType}
            onChange={v => set('panelType', v)}
            placeholder="IPS"
        />
        <F
            label="Tipo de iluminación"
            value={s.lightningType}
            onChange={v => set('lightningType', v)}
            placeholder="LED"
        />
        <F
            label="Pantalla curva"
            value={s.curveDisplay}
            onChange={v => set('curveDisplay', v)}
            type="checkbox"
        />
        <F
            label="Curvatura"
            value={s.curvature}
            onChange={v => set('curvature', v)}
            type="number"
            placeholder="1500"
        />
        <F
            label="Cantidad de colores"
            value={s.colorsQuantity}
            onChange={v => set('colorsQuantity', v)}
            type="number"
            placeholder="16700000"
        />
        <F
            label="Ángulo vertical"
            value={s.verticalAngle}
            onChange={v => set('verticalAngle', v)}
            type="number"
            placeholder="178"
        />
        <F
            label="Ángulo horizontal"
            value={s.horizontalAngle}
            onChange={v => set('horizontalAngle', v)}
            type="number"
            placeholder="178"
        />
        <F
            label="Touch display"
            value={s.touchDisplay}
            onChange={v => set('touchDisplay', v)}
            type="number"
            placeholder="0"
        />

        <SectionTitle title="Conectividad" />
        <F
            label="HDMI"
            value={s.hdmiTotal}
            onChange={v => set('hdmiTotal', v)}
            type="number"
            placeholder="2"
        />
        <F
            label="Display Port"
            value={s.dpTotal}
            onChange={v => set('dpTotal', v)}
            type="number"
            placeholder="1"
        />
        <F
            label="Mini DP"
            value={s.dpMini}
            onChange={v => set('dpMini', v)}
            type="number"
            placeholder="0"
        />
        <F label="VGA" value={s.vga} onChange={v => set('vga', v)} type="number" placeholder="0" />
        <F label="DVI" value={s.dvi} onChange={v => set('dvi', v)} type="number" placeholder="0" />
        <F
            label="USB 2.0"
            value={s.usbTwo}
            onChange={v => set('usbTwo', v)}
            type="number"
            placeholder="0"
        />
        <F
            label="USB 3.0"
            value={s.usbThree}
            onChange={v => set('usbThree', v)}
            type="number"
            placeholder="0"
        />
        <F
            label="USB 3.1"
            value={s.usbThreeDotOne}
            onChange={v => set('usbThreeDotOne', v)}
            type="number"
            placeholder="0"
        />
        <F
            label="Jack 3.5mm"
            value={s.threeDotFiveJack}
            onChange={v => set('threeDotFiveJack', v)}
            type="checkbox"
        />
        <F
            label="Auriculares"
            value={s.headphonesConnection}
            onChange={v => set('headphonesConnection', v)}
            type="checkbox"
        />

        <SectionTitle title="Energía y sync" />
        <F
            label="Consumo (W)"
            value={s.consumption}
            onChange={v => set('consumption', v)}
            type="number"
            placeholder="30"
        />
        <F
            label="NVIDIA G-Sync"
            value={s.nvidiaGsync}
            onChange={v => set('nvidiaGsync', v)}
            type="checkbox"
        />
        <F
            label="AMD FreeSync"
            value={s.amdFreesync}
            onChange={v => set('amdFreesync', v)}
            type="checkbox"
        />

        <SectionTitle title="Dimensiones" />
        <F label="Ancho (mm)" value={s.width} onChange={v => set('width', v)} type="number" />
        <F label="Alto (mm)" value={s.height} onChange={v => set('height', v)} type="number" />
        <F
            label="Espesor (mm)"
            value={s.thickness}
            onChange={v => set('thickness', v)}
            type="number"
        />
    </>
)

// ─── Mapa categoría → specs ───────────────────────────────────────────────────

const CATEGORY_SPECS_MAP: Record<string, string> = {
    Procesadores: 'cpu',
    'Placas de video': 'gpu',
    'Memorias RAM': 'ram',
    Fuentes: 'psu',
    Gabinetes: 'case',
    Monitores: 'monitor',
    Almacenamiento: 'ssd',
}

// ─── Componente principal ─────────────────────────────────────────────────────

const SpecsForm = ({ category, value, onChange }: SpecsFormProps) => {
    const specType = CATEGORY_SPECS_MAP[category]

    if (!specType) {
        return (
            <p className="text-sm text-gray-400 italic">
                Esta categoría no tiene especificaciones técnicas.
            </p>
        )
    }

    const set = (key: string, val: unknown) => {
        onChange({ ...value, [key]: val })
    }

    const s = value as Record<string, unknown>

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {specType === 'cpu' && <CPUForm s={s as Partial<CPUSpecs>} set={set} />}
            {specType === 'gpu' && <GPUForm s={s as Partial<GPUSpecs>} set={set} />}
            {specType === 'ram' && <RAMForm s={s as Partial<RAMSpecs>} set={set} />}
            {specType === 'psu' && <PSUForm s={s as Partial<PSUSpecs>} set={set} />}
            {specType === 'case' && <CASEForm s={s as Partial<CASESpecs>} set={set} />}
            {specType === 'monitor' && <MonitorForm s={s as Partial<MonitorSpecs>} set={set} />}
        </div>
    )
}

export default SpecsForm
