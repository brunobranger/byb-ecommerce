import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'

// Inicializamos MP una sola vez fuera del componente
initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, { locale: 'es-AR' })

interface MercadoPagoDetailProps {
    preferenceId: string | null
    loading: boolean
    error: string | null
}

const MercadoPagoDetail = ({ preferenceId, loading, error }: MercadoPagoDetailProps) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <p className="text-sm text-gray-400">Preparando Mercado Pago...</p>
            </div>
        )
    }

    if (error) {
        return <p className="text-sm text-red-500 text-center py-4">{error}</p>
    }

    if (!preferenceId) return null

    return (
        <div className="flex flex-col items-center gap-4 py-2">
            <p className="text-xs text-gray-400 text-center">
                Hacé clic en el botón para completar el pago de forma segura en Mercado Pago.
            </p>
            {/* El componente Wallet renderiza el botón oficial de MP */}
            <Wallet initialization={{ preferenceId, redirectMode: 'blank' }} />
        </div>
    )
}

export default MercadoPagoDetail
