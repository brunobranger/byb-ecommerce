export type AllProductSpecs = CPUSpecs | GPUSpecs | RAMSpecs | PSUSpecs | CASESpecs | MonitorSpecs

export type CPUSpecs = {
    // General
    model: string // Ejemplo: 5700x
    family: string
    cores: number
    threads: number
    frequence: number
    turboFrequence: number
    integratedGpu?: string
    socket: string
    // Coolers y disipadores
    coolerCpu: boolean // Si incluye o no cooler de CPU
    tdp: string // TDP de watts
    overclock?: boolean // Si se puede overclockear o no
    // Memoria
    l1: string
    l2: string
    l3: string
}

export type GPUSpecs = {
    // General
    brand: string
    model: string
    architecture: string
    coreFreq: number
    turboFreq: number
    memoryType: string // GDDR6, GDDR7
    memoryCap: number
    memoryFreq: number
    memoryInterface: number // 512 bits
    processType: string // Cuda e.g
    processQuantity: number
    // Dimensiones
    width: string
    length: string
    // Conectividad
    vga: number
    dvi: number
    hdmi: number
    displayPorts: number
    // Energia
    consumption: number
    wattsRecommended: number // Watts de fuente recomendada para la placa
    pcie6: number
    pcie8: number
    pcie16adaptors: number
    pcie16: number
    // Coolers y disipadores
    backplate: boolean
    blockVgaWater: boolean // block vga watter cooling
    coolersFan: number
}

export type RAMSpecs = {
    // General
    capacity: number
    freq: number
    type: string // ddr4/ddr5
    latency: number
    wattage: number
    // Coolers y disipadores
    heatsink: boolean
    highHeatsink: boolean
    // Compatibilidad
    sodimm: boolean
}

export type PSUSpecs = {
    // General
    format: string // atx, etc
    wattsNom: number
    wattsTrue: number
    bottomPressure: boolean // Si es compatible con presion inferior o no
    certification?: string // 80 plus bronce, 80 plus silver
    cableType: string // Tipo de cableado
    hibridMode: boolean
    digitalPSU?: boolean
    color: string
    rgb?: boolean
    // Cableado
    pin24: boolean
    pin4: number
    pin4plus: number
    pin6: number
    pin2plus: number
    sataConnections: number
    molexConnections: number
    floppyConnections: number
    // Detalles del kit
    cable220: boolean // Si incluye cable de 220v o no
}

export type CASESpecs = {
    // General
    motherBoards: string[] // mother que soporta
    window: boolean
    windowType: string
    color: string
    caseSize: string // Mid-tower, etc
    // Dimensiones
    width: number
    height: number
    depth: number
    vgaMaxLength: number
    coolerCpuMaxHeight: number
    // Conectividad
    usbTwo: number
    usbThree: number
    usbC: number
    usbCinside: number
    audio: boolean
    cardReader: boolean
    // Unidades soportadas
    fiveDot25: number
    slots: number
    twoDotFive: number
    threeDotFive: number
    threeDot25: number
    // Energy
    PSUType: string
    // Coolers y disipadores
    MmSupported80: number
    MmIncluded80: number
    MmSupported120: number
    MmIncluded120: number
    MmSupported140: number
    MmIncluded140: number
    MmSupported200: number
    MmIncluded200: number
    lightning: string // argb, rgb
    lightningController: boolean
    waterCoolingSpace: boolean
}

export type MonitorSpecs = {
    // General
    lightningType: string // led, lcd
    panelType: string // ips, va, tn, oled
    curveDisplay: boolean
    // Dimensiones
    width: number
    height: number
    thickness: number
    curvature: number
    // Conectividad
    hdmiTotal: number
    dpTotal: number // display port
    dpMini: number
    vga: number
    dvi: number
    usbTwo: number
    usbThree: number
    usbThreeDotOne: number
    threeDotFiveJack: boolean
    headphonesConnection: boolean
    // Energia
    consumption: number
    // Display
    inches: number
    maxRes: number
    maxHz: number
    colorsQuantity: number
    timeResponse: number
    verticalAngle: number
    horizontalAngle: number
    touchDisplay: number
    nvidiaGsync?: boolean
    amdFreesync?: boolean
}
