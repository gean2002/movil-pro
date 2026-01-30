import React from 'react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
    image: string;
    name: string;
    price: string;
    colors?: string[];
    tag?: string;
    link?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ image, name, price, colors, tag, link = '#' }) => {
    return (
        <div className="bg-white rounded-2xl p-4 relative hover:shadow-xl transition-all duration-300 group border border-gray-100 flex flex-col h-full">
            {/* Tag */}
            {tag && (
                <div className="absolute top-3 left-3 z-10">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide border ${tag === 'Oferta' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                        {tag}
                    </span>
                </div>
            )}

            {/* Image */}
            <Link to={link} className="aspect-square w-full flex items-center justify-center mb-4 bg-gray-50 rounded-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,white,transparent)] opacity-60"></div>
                <img src={image} alt={name} className="h-[80%] w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110" />
            </Link>

            {/* Info */}
            <div className="flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-bold text-[#1d1d1f] leading-tight line-clamp-2 group-hover:text-[#a5be31] transition-colors">
                        {name}
                    </h3>
                </div>

                {colors && (
                    <div className="flex -space-x-1 mb-3">
                        {colors.map((c, i) => (
                            <div key={i} className="w-3 h-3 rounded-full border border-white shadow-sm" style={{ backgroundColor: c }}></div>
                        ))}
                    </div>
                )}

                <div className="mt-auto flex items-end justify-between gap-2">
                    <span className="text-lg font-black text-[#1d1d1f] tracking-tight">{price}</span>
                    <button className="bg-[#1d1d1f] text-white h-8 px-4 rounded-xl flex items-center gap-1 text-xs font-bold hover:bg-[#a5be31] hover:text-[#111811] transition-colors active:scale-95">
                        <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                        Añadir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
