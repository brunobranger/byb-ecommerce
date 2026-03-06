import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { userService } from '../services/userService'
import type { User } from '../types/user'

// Tipos

type Section = 'personal-info' | 'order-history' | 'addresses'

// Mock data: Compras y direcciones

const mockOrders = [
    { id: 'ORD-482910', date: '14 ene 2025', status: 'Entregado', total: 89500, items: 3 },
    { id: 'ORD-371204', date: '02 dic 2024', status: 'En camino', total: 142000, items: 1 },
    { id: 'ORD-290031', date: '18 nov 2024', status: 'Entregado', total: 54300, items: 2 },
]

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

// Helpers

const statusColors: Record<string, string> = {
    Entregado: 'bg-green-100 text-green-700',
    'En camino': 'bg-blue-100 text-blue-700',
    Cancelado: 'bg-red-100 text-red-700',
    Pendiente: 'bg-yellow-100 text-yellow-700',
}

const formatPrice = (n: number) =>
    n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })

//  Sub-secciones

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

            {/* Datos Personales */}
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

            {/* Datos de Facturación */}
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

const OrderHistory = () => (
    <div className="space-y-4">
        {mockOrders.map(order => (
            <div
                key={order.id}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex justify-between items-center"
            >
                <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3">
                        <span className="font-bold text-sm">{order.id}</span>
                        <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[order.status]}`}
                        >
                            {order.status}
                        </span>
                    </div>
                    <p className="text-xs text-gray-500">
                        {order.date} · {order.items} productos
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="font-bold text-gray-900">{formatPrice(order.total)}</span>
                    <button className="text-sm text-blue-600 font-medium transition-colors">
                        Ver detalle
                    </button>
                </div>
            </div>
        ))}
    </div>
)

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

// Componente Principal

const UserProfile = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [activeSection, setActiveSection] = useState<Section>('personal-info')

    const handleLogout = () => {
        logout()
        navigate('/ingresar')
    }

    // Si el usuario se desloguea, desaparece el componente
    if (!user) return null

    return (
        <div className="w-full max-w-7xl mx-auto py-12 px-6">
            <div className="flex flex-col lg:flex-row gap-12">
                <aside className="w-full lg:w-64 shrink-0">
                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-8">
                        Mi Cuenta
                    </h2>
                    <nav className="flex flex-col gap-2">
                        <button
                            onClick={() => setActiveSection('personal-info')}
                            className={`text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeSection === 'personal-info' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            Mis datos
                        </button>
                        <button
                            onClick={() => setActiveSection('order-history')}
                            className={`text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeSection === 'order-history' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            Mis compras
                        </button>
                        <button
                            onClick={() => setActiveSection('addresses')}
                            className={`text-left px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeSection === 'addresses' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            Mis direcciones
                        </button>
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
