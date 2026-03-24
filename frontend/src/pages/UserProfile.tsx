import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { userService } from '../services/userService'
import { orderService } from '../services/orderService'
import type { User } from '../types/user'

type Section = 'personal-info' | 'order-history' | 'addresses'

interface OrderItem {
    name: string
    quantity: number
    price: number
    imageUrl?: string
}

interface Order {
    _id: string
    orderNumber: string
    createdAt: string
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
    total: number
    items: OrderItem[]
    paymentMethod: string
    shippingOption: 'pickup' | 'delivery'
    carrier?: string
    shippingCost: number
}

const mockAddresses = [
    {
        id: 1,
        label: 'Casa',
        street: 'Av. Corrientes 1234',
        city: 'Buenos Aires',
        province: 'CABA',
        zip: '1043',
        isDefault: true,
    },
]

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
}

const statusLabels: Record<string, string> = {
    pending: 'Pendiente',
    confirmed: 'Confirmado',
    shipped: 'En camino',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
}

const formatPrice = (n: number) =>
    n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })

// ─── PersonalInfo (sin cambios) ───

const PersonalInfo = ({ user }: { user: User }) => {
    const [editingPersonal, setEditingPersonal] = useState(false)
    const [editingBilling, setEditingBilling] = useState(false)
    const [form, setForm] = useState(user)
    const [saving, setSaving] = useState(false)
    const [saveError, setSaveError] = useState<string | null>(null)

    useEffect(() => {
        setForm(user)
    }, [user])

    const handleSave = async () => {
        setSaving(true)
        setSaveError(null)
        try {
            await userService.updateMe({
                fullName: form.fullName,
                phone: form.phone,
                claseFiscal: form.claseFiscal,
                tipoDocumento: form.tipoDocumento,
                dni: form.dni,
                province: form.province,
                address: form.address,
                postalCode: form.postalCode,
            })
            setEditingPersonal(false)
            setEditingBilling(false)
        } catch {
            setSaveError('No se pudieron guardar los cambios')
        } finally {
            setSaving(false)
        }
    }

    const field = (label: string, key: keyof User, editing: boolean, disabled = false) => (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {label}
            </label>
            {editing && !disabled ? (
                <input
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-400 transition-colors"
                    value={(form[key] as string) || ''}
                    onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                />
            ) : (
                <span className="text-sm text-gray-900">{(form[key] as string) || '---'}</span>
            )}
        </div>
    )

    return (
        <div className="space-y-8">
            {saveError && <p className="text-sm text-red-500 font-medium">{saveError}</p>}

            <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold tracking-tight">Datos Personales</h3>
                    <button
                        onClick={() => setEditingPersonal(e => !e)}
                        className="text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors"
                    >
                        {editingPersonal ? 'Cancelar' : 'Editar'}
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {field('Número de cliente', 'clientNumber', editingPersonal, true)}
                    {field('Apellido y Nombre', 'fullName', editingPersonal)}
                    {field('Correo electrónico', 'email', editingPersonal, true)}
                    {field('Número telefónico', 'phone', editingPersonal)}
                    {field('Clase fiscal', 'claseFiscal', editingPersonal)}
                    {field('Tipo de documento', 'tipoDocumento', editingPersonal)}
                    {field('DNI', 'dni', editingPersonal)}
                </div>
                {editingPersonal && (
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-blue-900 hover:bg-blue-800 disabled:bg-blue-900/50 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors"
                        >
                            {saving ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                    </div>
                )}
            </section>

            <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold tracking-tight">Datos de Facturación</h3>
                    <button
                        onClick={() => setEditingBilling(e => !e)}
                        className="text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors"
                    >
                        {editingBilling ? 'Cancelar' : 'Editar'}
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {field('Provincia', 'province', editingBilling)}
                    {field('Dirección', 'address', editingBilling)}
                    {field('Código Postal', 'postalCode', editingBilling)}
                </div>
                {editingBilling && (
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-blue-900 hover:bg-blue-800 disabled:bg-blue-900/50 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors"
                        >
                            {saving ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                    </div>
                )}
            </section>
        </div>
    )
}

// ─── OrderHistory — ahora con datos reales ───

const OrderHistory = () => {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [expandedId, setExpandedId] = useState<string | null>(null)

    useEffect(() => {
        orderService
            .getMyOrders()
            .then(setOrders)
            .catch(() => setOrders([]))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <p className="text-sm text-gray-400">Cargando órdenes...</p>

    if (orders.length === 0)
        return (
            <div className="py-20 text-center border-2 border-dashed border-gray-200 rounded-xl">
                <p className="text-gray-500 font-medium">Todavía no realizaste ninguna compra.</p>
            </div>
        )

    return (
        <div className="space-y-4">
            {orders.map(order => (
                <div
                    key={order._id}
                    className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
                >
                    {/* Fila principal */}
                    <div className="p-5 flex justify-between items-center">
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-sm">{order.orderNumber}</span>
                                <span
                                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[order.status]}`}
                                >
                                    {statusLabels[order.status]}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500">
                                {formatDate(order.createdAt)} · {order.items.length}{' '}
                                {order.items.length === 1 ? 'producto' : 'productos'}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="font-bold text-gray-900">
                                {formatPrice(order.total)}
                            </span>
                            <button
                                onClick={() =>
                                    setExpandedId(prev => (prev === order._id ? null : order._id))
                                }
                                className="text-sm text-blue-600 font-medium hover:text-blue-500 transition-colors"
                            >
                                {expandedId === order._id ? 'Ocultar' : 'Ver detalle'}
                            </button>
                        </div>
                    </div>

                    {/* Detalle expandible */}
                    {expandedId === order._id && (
                        <div className="border-t border-gray-100 px-5 pb-5 pt-4 space-y-4">
                            {/* Productos */}
                            <div className="space-y-3">
                                {order.items.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        {item.imageUrl && (
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                className="w-12 h-12 object-contain rounded-lg bg-gray-50 border border-gray-100"
                                            />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {item.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                x{item.quantity} · {formatPrice(item.price)} c/u
                                            </p>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-800">
                                            {formatPrice(item.price * item.quantity)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Resumen */}
                            <div className="border-t border-gray-100 pt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
                                <span>
                                    Envío:{' '}
                                    {order.shippingOption === 'pickup'
                                        ? 'Retiro en local'
                                        : (order.carrier ?? 'A domicilio')}
                                </span>
                                <span>
                                    Pago:{' '}
                                    {{
                                        cash: 'Efectivo',
                                        bank_deposit: 'Transferencia / Depósito',
                                        credit_card: 'Tarjeta de crédito',
                                        mercado_pago: 'Mercado Pago',
                                    }[order.paymentMethod] ?? order.paymentMethod}
                                </span>
                                <span>
                                    Subtotal: {formatPrice(order.total - order.shippingCost)}
                                </span>
                                <span>
                                    Envío:{' '}
                                    {order.shippingCost === 0
                                        ? 'Gratis'
                                        : formatPrice(order.shippingCost)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

// ─── MyAddresses (sin cambios por ahora) ───

const MyAddresses = () => (
    <div className="space-y-4">
        {mockAddresses.map(addr => (
            <div
                key={addr.id}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex justify-between items-center"
            >
                <div className="flex-1 space-y-0.5">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">{addr.label}</span>
                        {addr.isDefault && (
                            <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                                Principal
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-700">{addr.street}</p>
                </div>
                <button className="text-gray-400 hover:text-red-500 transition-colors text-sm">
                    Eliminar
                </button>
            </div>
        ))}
    </div>
)

// ─── Componente Principal ───

const UserProfile = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [activeSection, setActiveSection] = useState<Section>('personal-info')

    const handleLogout = () => {
        logout()
        navigate('/ingresar')
    }

    if (!user) return null

    return (
        <div className="w-full max-w-7xl mx-auto py-12 px-6">
            <div className="flex flex-col lg:flex-row gap-12">
                <aside className="w-full lg:w-64 shrink-0">
                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-8">
                        Mi Cuenta
                    </h2>
                    <nav className="flex flex-col gap-2">
                        {(
                            [
                                { id: 'personal-info', label: 'Mis datos' },
                                { id: 'order-history', label: 'Mis compras' },
                                { id: 'addresses', label: 'Mis direcciones' },
                            ] as { id: Section; label: string }[]
                        ).map(({ id, label }) => (
                            <button
                                key={id}
                                onClick={() => setActiveSection(id)}
                                className={`text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                                    activeSection === id
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-500 hover:bg-gray-50'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                        <button
                            onClick={handleLogout}
                            className="text-left px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors mt-4"
                        >
                            Cerrar sesión
                        </button>
                    </nav>
                </aside>

                <main className="flex-1">
                    {activeSection === 'personal-info' && <PersonalInfo user={user} />}
                    {activeSection === 'order-history' && <OrderHistory />}
                    {activeSection === 'addresses' && <MyAddresses />}
                </main>
            </div>
        </div>
    )
}

export default UserProfile
