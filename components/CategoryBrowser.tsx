import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
    { name: 'SMARTPHONES', icon: 'smartphone', price: '2.100', path: '/smartphones' },
    { name: 'TABLETS', icon: 'tablet_mac', price: '1.700', path: '/tablets' },
    { name: 'COMPUTADORAS', icon: 'laptop_mac', price: '3.699', path: '/computadoras' },
    { name: 'AURICULARES', icon: 'headphones', price: '600', path: '/audio' },
    { name: 'ACCESORIOS', icon: 'cases', price: '35', path: '/accesorios' },
    { name: 'REACONDICIONADOS', icon: 'verified', price: '1.000', path: '/reacondicionados' },
    { name: 'PROMOCIONES', icon: 'local_offer', price: '0', path: '/promociones' },
];

const CategoryBrowser: React.FC = () => {
    return (
        <section className="bg-white pt-12 pb-6 border-b border-gray-100">
            <div className="max-w-[1200px] mx-auto px-6">
                <h2 className="text-2xl md:text-3xl font-bold text-[#1d1d1f] mb-6">Ver todos los productos.</h2>

                <div className="relative group">
                    <div className="flex justify-between items-center gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide">
                        {categories.map((cat) => (
                            <Link
                                key={cat.name}
                                to={cat.path}
                                className="flex flex-col items-center min-w-[100px] gap-3 snap-start group/item cursor-pointer hover:opacity-100 transition-opacity"
                            >
                                {/* Icon Placeholder - In a real app these would be product images */}
                                <div className="w-[80px] h-[60px] flex items-center justify-center">
                                    <span className={`material-symbols-outlined text-[48px] group-hover/item:scale-110 transition-transform duration-300 ${cat.name === 'REACONDICIONADOS' ? 'text-[#8bc34a]' : cat.name === 'PROMOCIONES' ? 'text-[#ef4444]' : 'text-[#1d1d1f]'}`}>
                                        {cat.icon}
                                    </span>
                                </div>

                                <div className="text-center">
                                    <span className={`block text-sm font-semibold mb-1 ${cat.name === 'REACONDICIONADOS' ? 'text-[#8bc34a]' : cat.name === 'PROMOCIONES' ? 'text-[#ef4444]' : 'text-[#1d1d1f]'}`}>{cat.name}</span>
                                    <span className="block text-xs text-gray-500">desde S/ {cat.price}</span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Fade effect on right for scrolling indication */}
                    <div className="absolute right-0 top-0 bottom-8 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none md:hidden"></div>
                </div>
            </div>
        </section>
    );
};

export default CategoryBrowser;
