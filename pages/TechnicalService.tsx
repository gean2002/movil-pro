import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const TechnicalService: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-white text-[#1d1d1f]">
            {/* Hero Section */}
            <section className="relative bg-black text-white py-20 md:py-32">
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src="/images/service-store.jpg"
                        alt="Tienda Movil Pro"
                        className="w-full h-full object-cover opacity-50"
                    />
                </div>
                <div className="relative z-10 max-w-[1200px] mx-auto px-6 text-center">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-[#a5be31]/20 border border-[#a5be31] text-[#a5be31] font-bold text-xs uppercase tracking-widest mb-6 backdrop-blur-md">
                        Servicio Técnico Multimarca
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                        Reparamos tu dispositivo <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a5be31] to-emerald-400">al instante</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
                        Especialistas en Apple, Samsung, Xiaomi y todas las marcas. <br className="hidden md:block" />
                        Diagnóstico gratuito y reparaciones express en horas o hasta 4 días.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <a
                            href={`https://wa.me/51989000015?text=${encodeURIComponent('Hola, me gustaría saber si tienen disponibilidad para agendar una cita con el técnico.')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center gap-2 bg-[#a5be31] text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:scale-105 transition-all shadow-lg"
                        >
                            Agendar Cita
                            <span className="material-symbols-outlined text-[24px]">calendar_month</span>
                        </a>
                        <a
                            href="#services"
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="inline-flex items-center justify-center gap-2 bg-white/10 text-white backdrop-blur-md border border-white/20 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
                        >
                            Ver Servicios
                            <span className="material-symbols-outlined text-[24px]">arrow_downward</span>
                        </a>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section id="services" className="py-20 bg-[#f5f5f7]">
                <div className="max-w-[1200px] mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Soluciones para todo problema</h2>
                        <p className="text-gray-500 max-w-xl mx-auto">
                            Utilizamos repuestos de alta calidad y ofrecemos garantía en todas nuestras reparaciones.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Service 1 */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all group">
                            <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[32px]">battery_charging_full</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Cambio de Batería</h3>
                            <p className="text-gray-500 mb-6 leading-relaxed">
                                Recupera la autonomía de tu equipo. Reemplazamos tu batería desgastada por una nueva de alta capacidad en menos de 1 hora.
                            </p>
                            <ul className="text-sm text-gray-500 space-y-2">
                                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#a5be31]"></span> Condición de batería al 100%</li>
                                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#a5be31]"></span> Sin mensajes de error (según modelo)</li>
                            </ul>
                        </div>

                        {/* Service 2 */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all group">
                            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[32px]">phonelink_setup</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Pantalla Rota</h3>
                            <p className="text-gray-500 mb-6 leading-relaxed">
                                Reparamos cristales rotos y pantallas LCD/OLED dañadas. Mantenemos la función True Tone y la sensibilidad táctil original.
                            </p>
                            <ul className="text-sm text-gray-500 space-y-2">
                                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#a5be31]"></span> Calidad Original / Premium</li>
                                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#a5be31]"></span> Instalación en 1-2 horas</li>
                            </ul>
                        </div>

                        {/* Service 3 */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all group">
                            <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[32px]">charging_station</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Puerto de Carga</h3>
                            <p className="text-gray-500 mb-6 leading-relaxed">
                                ¿Tu celular no carga o el cable se mueve? Reparamos o cambiamos el flex de carga y limpieza de puertos obstruidos.
                            </p>
                        </div>

                        {/* Service 4 */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all group">
                            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[32px]">perm_device_information</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Tapa Trasera / Housing</h3>
                            <p className="text-gray-500 mb-6 leading-relaxed">
                                Cambio de cristal trasero con tecnología láser (iPhone) o cambio de chasis completo para dejar tu equipo como nuevo estéticamente.
                            </p>
                        </div>

                        {/* Service 5 */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all group">
                            <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[32px]">volume_up</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Audio y Micrófono</h3>
                            <p className="text-gray-500 mb-6 leading-relaxed">
                                Solución a problemas de audio en llamadas, parlantes que suenan bajo o micrófonos que no captan tu voz.
                            </p>
                        </div>

                        {/* Service 6 */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all group">
                            <div className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[32px]">build_circle</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Mantenimiento y Software</h3>
                            <p className="text-gray-500 mb-6 leading-relaxed">
                                Limpieza interna profunda, restablecimiento de fábrica, actualizaciones de software y recuperación de equipos mojados.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-20 bg-white">
                <div className="max-w-[1000px] mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1">
                            <h2 className="text-4xl font-bold mb-6">¿Cómo trabajamos?</h2>
                            <div className="space-y-8">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#a5be31] text-black font-bold flex items-center justify-center shrink-0">1</div>
                                    <div>
                                        <h4 className="font-bold text-lg">Diagnóstico</h4>
                                        <p className="text-gray-500">Evaluamos tu equipo al instante para identificar la falla exacta.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#a5be31] text-black font-bold flex items-center justify-center shrink-0">2</div>
                                    <div>
                                        <h4 className="font-bold text-lg">Presupuesto</h4>
                                        <p className="text-gray-500">Te indicamos el costo y el tiempo estimado (desde 30 min hasta 4 días).</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#a5be31] text-black font-bold flex items-center justify-center shrink-0">3</div>
                                    <div>
                                        <h4 className="font-bold text-lg">Reparación</h4>
                                        <p className="text-gray-500">Técnicos certificados realizan el trabajo con repuestos de calidad.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-[#a5be31] text-black font-bold flex items-center justify-center shrink-0">4</div>
                                    <div>
                                        <h4 className="font-bold text-lg">Entrega y Garantía</h4>
                                        <p className="text-gray-500">Te entregamos tu equipo 100% funcional y con garantía por el servicio.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-10">
                                <p className="text-sm text-gray-400 mb-4">* Aceptamos todas las marcas: Apple, Samsung, Xiaomi, Huawei, Motorola, etc.</p>
                                <Link to="/" className="text-[#a5be31] font-bold hover:underline">
                                    &larr; Volver al inicio
                                </Link>
                            </div>
                        </div>
                        <div className="flex-1 w-full relative">
                            <div className="aspect-square rounded-[40px] overflow-hidden shadow-2xl bg-gray-100">
                                <img
                                    src="/images/tech-workstation.jpg"
                                    alt="Estación de trabajo Servicio Técnico"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Floating Badge */}
                            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl max-w-xs">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="material-symbols-outlined text-[#a5be31] text-3xl">verified</span>
                                    <span className="font-bold text-lg">Garantía Asegurada</span>
                                </div>
                                <p className="text-sm text-gray-500">Confianza y seguridad en cada reparación que realizamos.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TechnicalService;
