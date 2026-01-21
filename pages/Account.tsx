import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchCustomer, updateCustomer } from '../lib/shopify';

const STATUS_MAP: Record<string, { label: string; color: string }> = {
    PAID: { label: 'Pagado', color: 'bg-green-100 text-green-700 border-green-200' },
    PENDING: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    AUTHORIZED: { label: 'Autorizado', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    REFUNDED: { label: 'Reembolsado', color: 'bg-gray-100 text-gray-700 border-gray-200' },
    VOIDED: { label: 'Anulado', color: 'bg-red-100 text-red-700 border-red-200' },
    FULFILLED: { label: 'Enviado', color: 'bg-green-100 text-green-700 border-green-200' },
    UNFULFILLED: { label: 'Procesando', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
};

const Account: React.FC = () => {
    const [customer, setCustomer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ firstName: '', lastName: '' });
    const [updateError, setUpdateError] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [searchOrderNumber, setSearchOrderNumber] = useState('');

    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('shopifyCustomerAccessToken');
        if (!token) {
            navigate('/login');
            return;
        }

        const loadCustomer = async () => {
            const data = await fetchCustomer(token);
            if (data) {
                setCustomer(data);
                setEditForm({
                    firstName: data.firstName || '',
                    lastName: data.lastName || ''
                });
            } else {
                logout();
                navigate('/login');
            }
            setLoading(false);
        };

        loadCustomer();
    }, [navigate, logout]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdateError('');
        setIsUpdating(true);
        try {
            const token = localStorage.getItem('shopifyCustomerAccessToken');
            if (!token) throw new Error('No token found');

            const updatedCustomer = await updateCustomer(token, {
                firstName: editForm.firstName,
                lastName: editForm.lastName,
            });

            if (updatedCustomer) {
                setCustomer((prev: any) => ({
                    ...prev,
                    firstName: updatedCustomer.firstName,
                    lastName: updatedCustomer.lastName
                }));
                setIsEditing(false);
            }
        } catch (error: any) {
            setUpdateError(error.message || 'Error al actualizar perfil');
        } finally {
            setIsUpdating(false);
        }
    };



    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f6f8f6]">
                <div className="w-10 h-10 border-4 border-[#a5be31] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!customer) return null;

    // Helper to find latest tracking info or search specific order
    const latestOrderWithTracking = customer.orders?.edges?.find((edge: any) =>
        edge.node.successfulFulfillments && edge.node.successfulFulfillments.length > 0
    )?.node;

    const displayedTrackingOrder = searchOrderNumber
        ? customer.orders?.edges?.find((edge: any) =>
            edge.node.orderNumber.toString() === searchOrderNumber &&
            edge.node.successfulFulfillments &&
            edge.node.successfulFulfillments.length > 0
        )?.node
        : latestOrderWithTracking;

    return (
        <div className="min-h-screen bg-[#f6f8f6] py-12 px-4 md:px-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6 animate-fade-in relative z-10">
                    <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-white/50 shadow-sm w-full md:w-auto">
                        <h1 className="text-4xl font-black text-[#111811] tracking-tight mb-1">Mi Cuenta</h1>
                        <p className="text-gray-500 font-medium text-lg">Hola, <span className="text-[#a5be31] font-bold">{customer.firstName}</span></p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-6 py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all shadow-sm flex items-center gap-2 group"
                    >
                        <span className="material-symbols-outlined group-hover:rotate-180 transition-transform">logout</span>
                        Cerrar Sesión
                    </button>
                </div>

                <div className="grid md:grid-cols-3 gap-8 items-start">

                    {/* Left Column: Profile & Address */}
                    <div className="md:col-span-1 space-y-6">

                        {/* PROFILE CARD */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-fade-in delay-100">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-[#111811] rounded-2xl flex items-center justify-center text-[#a5be31] shadow-lg shadow-[#a5be31]/20">
                                        <span className="material-symbols-outlined text-3xl">person</span>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-black text-[#111811] uppercase tracking-wide">Perfil</h2>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Tus Datos</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${isEditing ? 'bg-red-100 text-red-500' : 'bg-gray-50 text-gray-400 hover:bg-[#a5be31] hover:text-[#111811]'}`}
                                >
                                    <span className="material-symbols-outlined">{isEditing ? 'close' : 'edit'}</span>
                                </button>
                            </div>

                            {updateError && (
                                <div className="p-3 mb-4 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100">
                                    {updateError}
                                </div>
                            )}

                            {isEditing ? (
                                <form onSubmit={handleUpdateProfile} className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Nombre</label>
                                        <input
                                            type="text"
                                            value={editForm.firstName}
                                            onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-[#111811] focus:outline-none focus:border-[#a5be31] focus:ring-1 focus:ring-[#a5be31]"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Apellido</label>
                                        <input
                                            type="text"
                                            value={editForm.lastName}
                                            onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-[#111811] focus:outline-none focus:border-[#a5be31] focus:ring-1 focus:ring-[#a5be31]"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isUpdating}
                                        className="w-full py-3 bg-[#111811] text-white font-bold rounded-xl hover:bg-[#a5be31] hover:text-[#111811] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isUpdating && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>}
                                        Guardar
                                    </button>
                                </form>
                            ) : (
                                <div className="space-y-6">
                                    <div className="group">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1 group-hover:text-[#a5be31] transition-colors">Nombre Completo</label>
                                        <p className="font-bold text-[#111811] text-lg leading-tight">{customer.firstName} {customer.lastName}</p>
                                    </div>
                                    <div className="h-px bg-gray-100 w-full"></div>
                                    <div className="group">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1 group-hover:text-[#a5be31] transition-colors">Email</label>
                                        <p className="font-medium text-[#111811] break-words">{customer.email}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ADDRESS CARD */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-fade-in delay-150">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#a5be31]/10 rounded-2xl flex items-center justify-center text-[#a5be31]">
                                        <span className="material-symbols-outlined">home_pin</span>
                                    </div>
                                    <h2 className="text-lg font-black text-[#111811] uppercase tracking-wide">Dirección</h2>
                                </div>
                            </div>

                            {customer.defaultAddress ? (
                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <p className="font-bold text-[#111811] text-base mb-1">
                                        {customer.defaultAddress.address1} {customer.defaultAddress.address2 ? `, ${customer.defaultAddress.address2}` : ''}
                                    </p>
                                    <p className="text-gray-500 font-medium text-sm">
                                        {customer.defaultAddress.city}, {customer.defaultAddress.province}
                                    </p>
                                    <p className="text-gray-500 font-medium text-sm">
                                        {customer.defaultAddress.country} - {customer.defaultAddress.zip}
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center py-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                    <p className="text-gray-500 font-medium text-sm px-4">
                                        Tu dirección aparecerá aquí automáticamente después de realizar tu primera compra.
                                    </p>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Right Column: Tracking & Orders */}
                    <div className="md:col-span-2 space-y-8">

                        {/* TRACKING SECTION */}
                        <div className="bg-[#111811] rounded-3xl p-8 shadow-lg shadow-[#111811]/20 text-white animate-fade-in delay-200 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#a5be31] rounded-full blur-[100px] opacity-20 -mr-10 -mt-10"></div>

                            <div className="flex flex-wrap items-end justify-between gap-4 mb-6 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-[#a5be31] backdrop-blur-sm">
                                        <span className="material-symbols-outlined">local_shipping</span>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-black text-white uppercase tracking-wide">Seguimiento</h2>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Rastrea tus envíos</p>
                                    </div>
                                </div>

                                {/* Order Search Input */}
                                <div className="flex bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/10 w-full md:w-auto">
                                    <input
                                        type="text"
                                        placeholder="# Pedido (ej. 1003)"
                                        value={searchOrderNumber}
                                        onChange={(e) => setSearchOrderNumber(e.target.value)}
                                        className="bg-transparent text-white font-bold placeholder-gray-500 text-sm px-3 focus:outline-none w-full md:w-32"
                                    />
                                    <div className="bg-[#a5be31] text-[#111811] rounded-lg p-1.5 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-sm">search</span>
                                    </div>
                                </div>
                            </div>

                            {displayedTrackingOrder ? (
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm relative z-10">
                                    <div className="flex flex-wrap justify-between items-center gap-4">
                                        <div>
                                            <p className="text-xs text-[#a5be31] font-black uppercase tracking-widest mb-1">
                                                {searchOrderNumber ? `Pedido Found (#${displayedTrackingOrder.orderNumber})` : 'Último Envío'}
                                            </p>
                                            <p className="font-bold text-white text-lg">
                                                {displayedTrackingOrder.successfulFulfillments[0].trackingCompany}
                                            </p>
                                            <p className="text-gray-400 font-mono text-sm mt-1">
                                                {displayedTrackingOrder.successfulFulfillments[0].trackingInfo[0]?.number}
                                            </p>
                                        </div>
                                        <a
                                            href={displayedTrackingOrder.successfulFulfillments[0].trackingInfo[0]?.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-6 py-3 bg-[#a5be31] text-[#111811] font-black rounded-xl hover:bg-white transition-colors flex items-center gap-2"
                                        >
                                            Ver Estado
                                            <span className="material-symbols-outlined text-sm">open_in_new</span>
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 relative z-10">
                                    <p className="text-gray-400 font-medium">
                                        {searchOrderNumber
                                            ? 'No encontramos tracking para este pedido.'
                                            : 'No tienes envíos activos recientes. Busca por # de pedido.'}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* ORDERS LIST */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 animate-fade-in delay-300">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-800">
                                        <span className="material-symbols-outlined text-3xl">shopping_bag</span>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-black text-[#111811] uppercase tracking-wide">Pedidos</h2>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Historial completo</p>
                                    </div>
                                </div>
                                <div className="bg-gray-100 px-3 py-1 rounded-lg text-xs font-bold text-gray-500">
                                    Total: {customer.orders?.edges?.length || 0}
                                </div>
                            </div>

                            {!customer.orders?.edges?.length ? (
                                <div className="text-center py-20 bg-[#f9faf9] rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-4">
                                    <div className="w-20 h-20 bg-[#e7ebe5] rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-4xl text-gray-400">add_shopping_cart</span>
                                    </div>
                                    <div>
                                        <p className="text-[#111811] font-bold text-lg">Aún no tienes pedidos</p>
                                        <p className="text-gray-400 text-sm font-medium">¡Explora nuestra tienda y encuentra lo mejor!</p>
                                    </div>
                                    <button onClick={() => navigate('/smartphones')} className="mt-2 px-6 py-2 bg-[#111811] text-white rounded-xl font-bold text-sm hover:bg-[#a5be31] hover:text-[#111811] transition-all">
                                        Ir a la Tienda
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {customer.orders.edges.map(({ node: order }: any) => {
                                        const financial = STATUS_MAP[order.financialStatus] || { label: order.financialStatus, color: 'bg-gray-100 text-gray-600' };
                                        const fulfillment = STATUS_MAP[order.fulfillmentStatus] || { label: order.fulfillmentStatus || 'No enviado', color: 'bg-gray-100 text-gray-600' };

                                        return (
                                            <div key={order.id} className="group border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:border-[#a5be31]/30 transition-all bg-white hover:bg-[#fcfdfc]">
                                                <div className="flex flex-wrap justify-between items-start gap-4 mb-6 border-b border-gray-100 pb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-[#111811] rounded-full flex items-center justify-center text-white font-black text-xs">
                                                            #{order.orderNumber}
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-400 font-bold uppercase">Pedido</p>
                                                            <p className="font-bold text-[#111811] text-sm">
                                                                {new Date(order.processedAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs text-gray-400 font-bold uppercase">Total</p>
                                                        <p className="font-black text-[#111811] text-lg">
                                                            {order.totalPrice.currencyCode === 'PEN' ? 'S/' : order.totalPrice.currencyCode} {parseFloat(order.totalPrice.amount).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-2 mb-6">
                                                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${financial.color}`}>
                                                        {financial.label}
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${fulfillment.color}`}>
                                                        {fulfillment.label}
                                                    </span>
                                                </div>

                                                <div className="bg-gray-50 rounded-xl p-4 group-hover:bg-white group-hover:shadow-inner transition-colors">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Productos</p>
                                                    <div className="space-y-3">
                                                        {order.lineItems.edges.map(({ node: item }: any, idx: number) => (
                                                            <div key={idx} className="flex justify-between items-center text-sm">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="w-6 h-6 bg-white rounded-md border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 shadow-sm">{item.quantity}</span>
                                                                    <span className="font-bold text-[#111811]">{item.title}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;
