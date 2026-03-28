// Componente simple sin SDK de React - el backend maneja todo
interface MercadoPagoDetailProps {
    preferenceId: string | null
    loading: boolean
    error: string | null
}

const MercadoPagoDetail: React.FC<MercadoPagoDetailProps> = ({ preferenceId, loading, error }) => {
    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{error}</p>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-900"></div>
                <p className="text-sm text-gray-600 mt-2">Procesando pago...</p>
            </div>
        )
    }

    if (!preferenceId) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm font-medium mb-2">
                    ⏳ Mercado Pago está listo
                </p>
                <p className="text-yellow-600 text-xs">
                    Al confirmar tu pedido, serás redirigido a Mercado Pago para completar el pago
                    de forma segura.
                </p>
            </div>
        )
    }

    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm font-medium mb-2">
                🔗 Serás redirigido a Mercado Pago para completar el pago
            </p>
            <p className="text-blue-600 text-xs">ID de preferencia: {preferenceId}</p>
        </div>
    )
}

export default MercadoPagoDetail
