import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const ExpertTips: React.FC = () => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const RevealOnScroll: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className = '', delay = 0 }) => {
        const [isVisible, setIsVisible] = React.useState(false);
        const ref = React.useRef<HTMLDivElement>(null);

        React.useEffect(() => {
            const observer = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setIsVisible(true), delay);
                    observer.disconnect();
                }
            }, { threshold: 0.1 });

            if (ref.current) observer.observe(ref.current);
            return () => observer.disconnect();
        }, [delay]);

        return (
            <div ref={ref} className={`transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`}>
                {children}
            </div>
        );
    };

    return (
        <div className="bg-[#f5f5f7] min-h-screen">
            {/* Hero Section */}
            <div className="bg-black text-white pt-24 pb-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <span className="inline-block py-1 px-3 border border-white/20 rounded-full text-xs font-bold uppercase tracking-wider mb-6 text-[#a5be31] bg-white/5 backdrop-blur-md">
                        Consejos de Expertos
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
                        Cuida tu tecnología.<br />Alarga su vida.
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
                        Guía definitiva para mantener tu iPhone y Samsung como el primer día. Secretos que las marcas no siempre te cuentan.
                    </p>
                </div>
            </div>

            <div className="max-w-[1000px] mx-auto px-6 -mt-10 relative z-10 pb-20">
                {/* 1. BATTERY SECTION */}
                <RevealOnScroll className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl mb-8 border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                        <span className="material-symbols-outlined text-[150px] md:text-[200px]">battery_charging_full</span>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="w-10 h-10 rounded-full bg-[#e8fce8] text-[#00a300] flex items-center justify-center">
                                <span className="material-symbols-outlined filled">battery_plus</span>
                            </span>
                            <h2 className="text-2xl md:text-3xl font-bold text-[#1d1d1f]">Salud de la Batería</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                            <div>
                                <h3 className="text-lg font-bold mb-3">La Regla de Oro: 20-80%</h3>
                                <p className="text-gray-500 mb-4 leading-relaxed">
                                    Las baterías de litio sufren estrés en los extremos. Intenta mantener tu carga entre el 20% y el 80% para duplicar su vida útil.
                                </p>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center gap-3">
                                    <span className="material-symbols-outlined text-orange-500">warning</span>
                                    <p className="text-sm font-semibold text-gray-700">Evita dejarlo cargando toda la noche si ya está al 100%.</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold mb-3">Errores Comunes</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3 text-gray-600">
                                        <span className="text-red-500 material-symbols-outlined text-[20px]">cancel</span>
                                        <span>Usar cargadores de gasolinera o mala calidad.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-gray-600">
                                        <span className="text-red-500 material-symbols-outlined text-[20px]">cancel</span>
                                        <span>Exponer el móvil al sol directo mientras carga (calor excesivo = muerte de batería).</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-gray-600">
                                        <span className="text-green-500 material-symbols-outlined text-[20px]">check_circle</span>
                                        <span>Usar MagSafe o carga lenta por la noche.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </RevealOnScroll>

                {/* 2. CAMERA SECTION */}
                <RevealOnScroll delay={100} className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-[#1d1d1f] rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-purple-900/20 to-transparent pointer-events-none"></div>
                        <span className="absolute top-6 right-6 material-symbols-outlined text-white/10 text-6xl">photo_camera</span>

                        <h3 className="text-2xl font-bold mb-4 relative z-10">Lentes Impecables</h3>
                        <p className="text-gray-400 mb-6 relative z-10 leading-relaxed">
                            ¿Fotos borrosas? El 90% de las veces es grasa en la lente. Antes de disparar, pasa suavemente una tela de microfibra.
                        </p>
                        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/5 relative z-10">
                            <span className="block text-xs font-bold text-[#b59eff] uppercase tracking-wide mb-1">PRO TIP</span>
                            <p className="text-sm font-medium">Usa el modo "ProRAW" o "Expert RAW" solo si vas a editar las fotos después. Ocupan 10 veces más espacio.</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-lg border border-gray-100 flex flex-col justify-center relative overflow-hidden group">
                        <div className="absolute bottom-0 right-0 p-4 opacity-5 pointer-events-none">
                            <span className="material-symbols-outlined text-[120px]">speed</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-[#1d1d1f]">Rendimiento</h3>
                        <ul className="space-y-4 relative z-10">
                            <li className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">1</span>
                                <span className="text-gray-600 font-medium">Reinicia tu móvil 1 vez a la semana.</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">2</span>
                                <span className="text-gray-600 font-medium">Mantén 5GB de espacio libre siempre.</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">3</span>
                                <span className="text-gray-600 font-medium">Actualiza solo vía Wi-Fi estable.</span>
                            </li>
                        </ul>
                    </div>
                </RevealOnScroll>

                {/* 3. CTA */}
                <RevealOnScroll delay={200} className="bg-gradient-to-r from-[#007aff] to-[#0055b3] rounded-[2rem] p-8 md:p-12 text-center text-white shadow-xl shadow-blue-200">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">¿Tu equipo necesita un cambio?</h2>
                    <p className="text-blue-100 mb-8 font-medium text-lg max-w-lg mx-auto">
                        Si a pesar de estos consejos tu batería no aguanta, quizás es hora de un upgrade.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <Link to="/smartphones" className="inline-block bg-white text-[#0066cc] px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-lg">
                            Ver Novedades
                        </Link>
                        <Link to="/refurbished" className="inline-block bg-[#004494] text-white border border-white/20 px-8 py-3 rounded-full font-bold hover:bg-[#003377] transition-colors">
                            Ver Reacondicionados
                        </Link>
                    </div>
                </RevealOnScroll>
            </div>
        </div>
    );
};

export default ExpertTips;
