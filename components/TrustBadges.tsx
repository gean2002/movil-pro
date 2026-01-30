import React from 'react';

const TrustBadges: React.FC = () => {
    const badges = [
        { icon: 'local_shipping', title: 'Envío Gratis', subtitle: 'En todos tus pedidos' },
        { icon: 'replay', title: 'Devoluciones', subtitle: '7 días de prueba' },
        { icon: 'lock', title: 'Pago Seguro', subtitle: 'Encriptación SSL' },
        { icon: 'support_agent', title: 'Atención VIP', subtitle: 'Soporte personalizado' },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {badges.map((badge, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#1d1d1f]">
                        <span className="material-symbols-outlined text-[20px]">{badge.icon}</span>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-[#1d1d1f] uppercase tracking-wide">{badge.title}</h4>
                        <p className="text-[10px] text-gray-500 font-medium">{badge.subtitle}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TrustBadges;
