import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Financing: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <div className="bg-[#ff4d4f] text-white py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#ff7875_0%,transparent_40%)]"></div>
                <div className="max-w-[1100px] mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full mb-6 border border-white/20">
                        <span className="material-symbols-outlined text-sm">credit_card</span>
                        <span className="text-xs font-bold uppercase tracking-wider">Alianza Oficial Movil Pro & Izipay</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                        Compra lo que amas.<br />Págalo como quieras.
                    </h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium">
                        Llévate hoy tu nuevo iPhone o Samsung y divídelo en cuotas sin complicaciones con la seguridad de Izipay.
                    </p>
                </div>
            </div>

            <div className="max-w-[1100px] mx-auto px-6 py-20">
                {/* How it works */}
                <div className="mb-20">
                    <h2 className="text-3xl font-black text-center text-[#1d1d1f] mb-12">¿Cómo funciona?</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-gray-50 rounded-[2rem] p-8 text-center hover:shadow-lg transition-shadow duration-300">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 text-[#ff4d4f]">
                                <span className="material-symbols-outlined text-3xl">shopping_bag</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3">1. Elige tu equipo</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Navega por nuestro catálogo y añade tu iPhone o Samsung favorito al carrito.
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-[2rem] p-8 text-center hover:shadow-lg transition-shadow duration-300 relative">
                            <div className="absolute top-1/2 -left-4 hidden md:block text-gray-300">
                                <span className="material-symbols-outlined text-3xl">arrow_forward</span>
                            </div>
                            <div className="w-16 h-16 bg-[#ff4d4f] rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-6 text-white transform -rotate-3">
                                <span className="font-black text-xl italic">izipay</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3">2. Selecciona Izipay</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                En el checkout, elige "Izipay" como método de pago. Es 100% seguro y rápido.
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-[2rem] p-8 text-center hover:shadow-lg transition-shadow duration-300 relative">
                            <div className="absolute top-1/2 -left-4 hidden md:block text-gray-300">
                                <span className="material-symbols-outlined text-3xl">arrow_forward</span>
                            </div>
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 text-[#00c950]">
                                <span className="material-symbols-outlined text-3xl">check_circle</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3">3. Disfruta</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Elige tus cuotas, confirma el pago y recibe tu pedido. ¡Así de fácil!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Benefits Grid */}
                <div className="bg-[#1d1d1f] rounded-[2.5rem] p-8 md:p-16 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-10 opacity-10">
                        <span className="material-symbols-outlined text-[300px]">lock</span>
                    </div>

                    <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black mb-6">¿Por qué elegir Izipay?</h2>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <span className="material-symbols-outlined text-[#ff4d4f] text-3xl">verified_user</span>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">Pagos 100% Seguros</h3>
                                        <p className="text-gray-400 text-sm">Tecnología de encriptación avanzada para proteger tus datos.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <span className="material-symbols-outlined text-[#ff4d4f] text-3xl">calendar_month</span>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">Flexibilidad Total</h3>
                                        <p className="text-gray-400 text-sm">Tú decides en cuántas cuotas pagar. Sin presiones.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <span className="material-symbols-outlined text-[#ff4d4f] text-3xl">credit_score</span>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1">Aceptamos todas las tarjetas</h3>
                                        <p className="text-gray-400 text-sm">Visa, Mastercard, Amex y Diners Club.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <div className="bg-white p-6 rounded-3xl shadow-2xl transform rotate-3 max-w-xs w-full text-center text-black">
                                <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                                    <span className="font-bold text-lg">Resumen de Pago</span>
                                    <span className="text-xs text-gray-500">Izipay Checkout</span>
                                </div>
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                        <span className="text-sm font-medium text-gray-600">Total a pagar</span>
                                        <span className="font-bold text-[#1d1d1f]">S/ 4,599.00</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-[#ffebeb] p-3 rounded-lg border border-[#ffcdcd]">
                                        <span className="text-sm font-bold text-[#ff4d4f]">12 Cuotas de</span>
                                        <span className="font-bold text-[#ff4d4f]">S/ 383.25</span>
                                    </div>
                                </div>
                                <button className="w-full bg-[#ff4d4f] text-white py-3 rounded-xl font-bold hover:bg-[#ff2a2d] transition-colors shadow-lg shadow-red-200">
                                    Pagar Ahora
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-20 text-center">
                    <h2 className="text-2xl font-bold mb-6">¿Listo para estrenar?</h2>
                    <Link to="/smartphones" className="inline-flex items-center gap-2 bg-[#1d1d1f] text-white px-8 py-4 rounded-full font-bold hover:bg-black transition-all hover:scale-105 shadow-xl">
                        Ver Catálogo <span className="material-symbols-outlined">arrow_forward</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Financing;
