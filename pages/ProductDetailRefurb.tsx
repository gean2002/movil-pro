import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { fetchProductByHandle } from '../lib/shopify';

// --- Reusing the Enriched Data Logic from ProductDetailNew for consistency ---
interface ProductData {
    id: string;
    name: string;
    description: string;
    price: string;
    images: { src: string, altText: string }[];
    options: { name: string; values: string[] }[];
    variants: {
        id: string;
        title: string;
        price: { amount: string; currencyCode: string };
        availableForSale: boolean;
        quantityAvailable: number;
        selectedOptions: { name: string; value: string }[];
    }[];
    specs: {
        label: string;
        value: string;
        icon: string;
    }[];
    boxContent: { name: string; image: string }[];
}

const ENRICHED_DATA: Record<string, any> = {
    'iphone': {
        specs: [
            { label: 'Pantalla', value: 'Super Retina XDR', icon: 'smartphone' }, // Generic for varied refurb/new
            { label: 'Condición', value: 'Excelente (Grado A)', icon: 'verified' },
            { label: 'Batería', value: '> 80% Capacidad', icon: 'battery_horiz_075' },
            { label: 'Garantía', value: '12 Meses', icon: 'security' }
        ],
        boxContent: [
            { name: 'iPhone (Reacondicionado)', image: 'smartphone' },
            { name: 'Cable de Carga', image: 'cable' },
            { name: 'Certificado de Garantía', image: 'verified' }
        ]
    },
    'samsung': {
        specs: [
            { label: 'Pantalla', value: 'Dynamic AMOLED', icon: 'smartphone' },
            { label: 'Condición', value: 'Excelente (Grado A)', icon: 'verified' },
            { label: 'Batería', value: 'Optimizada', icon: 'battery_horiz_075' },
            { label: 'Garantía', value: '12 Meses', icon: 'security' }
        ],
        boxContent: [
            { name: 'Galaxy (Reacondicionado)', image: 'smartphone' },
            { name: 'Cable de Datos', image: 'cable' }
        ]
    },
    'default': {
        specs: [
            { label: 'Condición', value: 'Excelente', icon: 'verified' },
            { label: 'Funcionalidad', value: '100% Operativo', icon: 'settings_suggest' },
            { label: 'Batería', value: 'Testada', icon: 'battery_charge' },
            { label: 'Garantía', value: '12 Meses', icon: 'security' }
        ],
        boxContent: [
            { name: 'Dispositivo', image: 'smartphone' },
            { name: 'Cable Compatible', image: 'cable' }
        ]
    }
};

const ProductDetailRefurb: React.FC = () => {
    const { handle } = useParams<{ handle: string }>();
    const location = useLocation();
    const { addToCart } = useCart();

    const [product, setProduct] = useState<ProductData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // States for selectors
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedStorage, setSelectedStorage] = useState('');
    const [selectedVariant, setSelectedVariant] = useState<any>(null);

    // --- Data Fetching & Enrichment ---
    useEffect(() => {
        const loadProduct = async () => {
            if (!handle) return;
            setLoading(true);
            try {
                const fetchedProduct = await fetchProductByHandle(handle);
                if (fetchedProduct) {
                    console.log("Fetched Refurb Product:", fetchedProduct); // Keep debug log

                    // Determine enrichment
                    let enrichmentKey = 'default';
                    const titleLower = fetchedProduct.title.toLowerCase();
                    if (titleLower.includes('iphone')) enrichmentKey = 'iphone';
                    else if (titleLower.includes('samsung') || titleLower.includes('galaxy')) enrichmentKey = 'samsung';

                    const enrichedObj = ENRICHED_DATA[enrichmentKey];

                    const mappedProduct: ProductData = {
                        id: fetchedProduct.id,
                        name: fetchedProduct.title,
                        description: fetchedProduct.descriptionHtml || fetchedProduct.description || 'Producto reacondicionado certificado.',
                        price: fetchedProduct.variants[0]?.price.amount,
                        images: fetchedProduct.images?.map((img: any) => ({ src: img.src, altText: img.altText })) || [],
                        options: fetchedProduct.options.map((opt: any) => ({
                            name: opt.name,
                            values: opt.values
                        })),
                        variants: fetchedProduct.variants,
                        specs: enrichedObj.specs,
                        boxContent: enrichedObj.boxContent
                    };

                    setProduct(mappedProduct);

                    // Initialize Options (similar logic to previous, but adapted to new structure)
                    if (mappedProduct.options.length > 0) {
                        const defaultColor = mappedProduct.options.find(o => ['Color', 'Colour', 'Acabado'].includes(o.name))?.values[0];
                        const defaultStorage = mappedProduct.options.find(o => ['Storage', 'Capacidad', 'Almacenamiento', 'Memoria'].includes(o.name))?.values[0];

                        if (defaultColor) setSelectedColor(defaultColor);
                        if (defaultStorage) setSelectedStorage(defaultStorage);

                        // Find initial variant
                        const variant = mappedProduct.variants.find((v: any) => {
                            const isColorMatch = !defaultColor || v.selectedOptions.some((o: any) => ['Color', 'Colour', 'Acabado'].includes(o.name) && o.value === defaultColor);
                            const isStorageMatch = !defaultStorage || v.selectedOptions.some((o: any) => ['Storage', 'Capacidad', 'Almacenamiento', 'Memoria'].includes(o.name) && o.value === defaultStorage);
                            return isColorMatch && isStorageMatch;
                        });
                        setSelectedVariant(variant || mappedProduct.variants[0]);
                    } else {
                        setSelectedVariant(mappedProduct.variants[0]);
                    }

                } else {
                    setError('Producto no encontrado');
                }
            } catch (err) {
                console.error("Error fetching product:", err);
                setError('Error al cargar el producto');
            } finally {
                setLoading(false);
            }
        };
        loadProduct();
    }, [handle]);

    // Determine root category from path for breadcrumbs (Missing fix)
    const pathSegments = location.pathname.split('/');
    const rootCategory = pathSegments[1] || 'reacondicionados';


    // --- Variant Update Logic ---
    useEffect(() => {
        if (!product) return;
        const variant = product.variants.find((v: any) => {
            const matchColor = !selectedColor || v.selectedOptions.some((o: any) => ['Color', 'Colour', 'Acabado'].includes(o.name) && o.value === selectedColor);
            const matchStorage = !selectedStorage || v.selectedOptions.some((o: any) => ['Storage', 'Capacidad', 'Almacenamiento', 'Memoria'].includes(o.name) && o.value === selectedStorage);
            return matchColor && matchStorage;
        });
        if (variant) {
            setSelectedVariant(variant);
        }
    }, [selectedColor, selectedStorage, product]);

    // Helpers
    const getColorHex = (colorName: string) => {
        // ... (Reuse the massive map from ProductDetailNew if needed, or a simplified one)
        // For brevity, using a simpler fallback, but ideal to copy the full map from ProductDetailNew
        const map: Record<string, string> = {
            'Titanio Natural': '#8E8D8A', 'Natural': '#8E8D8A',
            'Titanio Azul': '#1F2C45', 'Azul': '#1F2C45',
            'Titanio Blanco': '#F2F1EC', 'Blanco': '#F2F1EC',
            'Titanio Negro': '#1C1C1E', 'Negro': '#1C1C1E',
            'Oro': '#F9E5C9', 'Dorado': '#F9E5C9', 'Plata': '#e3e4e5', 'Grafito': '#41424C',
            'Sierra Azul': '#9BB5CE', 'Verde Alpino': '#505E4E',
            'Morado Oscuro': '#483C4E', 'Negro Espacial': '#1D1D1F',
            'Morado': '#483C4E', // Mapping generic Morado to Deep Purple for 14 Pro series
            'Titanio Desierto': '#C5B499', 'Desierto': '#C5B499', 'Desert': '#C5B499', 'Deret': '#C5B499',
            'Rojo': '#E21A2C', '(Product)Red': '#E21A2C',
            'Naranja': '#ff9f0a', 'Coral': '#ff7f50',
            'Amarillo': '#fdf6dd', 'Yellow': '#fdf6dd',
            'Verde': '#eaf6ed', 'Green': '#eaf6ed',
            'Rosa': '#fae1dc', 'Pink': '#fae1dc', 'Rosado': '#fae1dc',
            'Medianoche': '#191f26', 'Midnight': '#191f26',
            'Estrella': '#faf7f2', 'Starlight': '#faf7f2',
            'Gris Espacial': '#4a4a4a', 'Space Gray': '#4a4a4a',
            'Azul Cielo': '#87CEEB', 'Sky Blue': '#87CEEB',
            'Violeta': '#E6E6FA', 'Purple': '#E6E6FA'
        };

        const normalizedInput = colorName.trim().toLowerCase();
        const foundKey = Object.keys(map).find(key => key.toLowerCase() === normalizedInput);

        if (foundKey) {
            return map[foundKey];
        }

        console.warn(`Missing color mapping for: "${colorName}" (Normalized: "${normalizedInput}")`);
        return '#cccccc';
    };


    if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="animate-pulse w-10 h-10 bg-gray-200 rounded-full"></div></div>;
    if (error || !product) return null;

    const currentPrice = selectedVariant ? parseFloat(selectedVariant.price.amount).toLocaleString('es-PE', { minimumFractionDigits: 0 }) : '---';

    // Extract options for rendering
    const allColors = Array.from(new Set(product.options.find(o => ['Color', 'Colour', 'Acabado'].includes(o.name))?.values || [])) as string[];
    const allStorages = Array.from(new Set(product.options.find(o => ['Storage', 'Capacidad', 'Almacenamiento', 'Memoria'].includes(o.name))?.values || [])) as string[];


    return (
        <div className="flex flex-col bg-white relative w-full overflow-x-hidden">
            {/* --- Main Product Section (Matched to ProductDetailNew) --- */}
            <div className="flex flex-col pb-8 bg-white">
                {/* Breadcrumbs */}
                <div className="px-4 md:px-10 lg:px-40 flex justify-center pt-4">
                    <div className="flex flex-wrap gap-2 px-4 py-2 justify-center md:justify-start">
                        <Link to="/" className="text-gray-500 text-xs md:text-sm font-medium hover:text-black transition-colors">Inicio</Link>
                        <span className="text-gray-400 text-xs md:text-sm font-medium">/</span>
                        <Link to={`/${(() => {
                            if (!product) return rootCategory;
                            const title = product.name.toLowerCase();
                            if (title.includes('airpods') || title.includes('auriculares')) return 'audio';
                            if (title.includes('macbook') || title.includes('imac')) return 'computadoras';
                            if (title.includes('ipad') || title.includes('tablet')) return 'tablets';
                            if (title.includes('watch') || title.includes('reloj')) return 'relojes';
                            return rootCategory; // Default to existing behavior
                        })()}`} className="text-gray-500 text-xs md:text-sm font-medium hover:text-black transition-colors capitalize">
                            {(() => {
                                if (!product) return rootCategory;
                                const title = product.name.toLowerCase();
                                if (title.includes('airpods') || title.includes('auriculares')) return 'Audio';
                                if (title.includes('macbook') || title.includes('imac')) return 'Computadoras';
                                if (title.includes('ipad') || title.includes('tablet')) return 'Tablets';
                                if (title.includes('watch') || title.includes('reloj')) return 'Relojes';
                                return rootCategory === 'reacondicionados' ? 'Reacondicionados' : rootCategory;
                            })()}
                        </Link>
                        <span className="text-gray-400 text-xs md:text-sm font-medium">/</span>
                        <span className="text-black text-xs md:text-sm font-medium line-clamp-1">{product.name}</span>
                    </div>
                </div>

                <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-4">
                    <div className="bg-[#fcfdfc] border border-gray-100 rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-10 lg:p-16 flex flex-1 justify-center shadow-inner">
                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 max-w-[1280px] flex-1">
                            {/* Left: Images */}
                            <div className="flex-1 min-w-0 flex flex-col gap-6">
                                <div className="w-full bg-white aspect-square rounded-[2rem] overflow-hidden relative border border-gray-100 shadow-sm flex items-center justify-center p-8 group">
                                    {/* Badge Specific to Refurbished */}
                                    <div className="absolute top-6 left-6 z-10 flex flex-col gap-2 items-start">
                                        <span className="bg-[#f4f7e6] text-[#657917] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-[#dcecc6] flex items-center gap-1 shadow-sm">
                                            <span className="material-symbols-outlined text-[14px]">eco</span>
                                            Reacondicionado
                                        </span>
                                    </div>

                                    <div className="w-full h-full bg-center bg-contain bg-no-repeat transition-transform duration-700 group-hover:scale-105"
                                        style={{ backgroundImage: `url('${selectedVariant?.image?.src || product.images[0].src}')` }}>
                                    </div>
                                </div>

                                {/* Gallery */}
                                <div className="flex gap-2 overflow-x-auto pb-2 snap-x md:grid md:grid-cols-4 md:overflow-visible scrollbar-hide px-1 mt-2">
                                    {product.images.slice(0, 4).map((src, i) => (
                                        <button key={i} className={`flex-shrink-0 w-16 h-16 md:w-auto md:h-auto md:aspect-square rounded-xl border transition-all duration-200 bg-[#f6f8f6] overflow-hidden snap-start hover:border-gray-300`}>
                                            <div className="w-full h-full bg-center bg-contain bg-no-repeat opacity-80 hover:opacity-100 p-1" style={{ backgroundImage: `url('${src.src}')` }}></div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Right: Details */}
                            <div className="flex-1 min-w-0 flex flex-col pt-2">
                                <div className="mb-4">
                                    <h1 className="text-[#111811] tracking-tight text-3xl md:text-5xl font-black leading-tight mb-2">{product.name}</h1>
                                    <div className="flex items-end gap-3 mb-6">
                                        <span className="text-4xl font-black text-[#111811] tracking-tighter">S/ {currentPrice}</span>
                                    </div>
                                </div>

                                <p className="text-gray-600 text-base leading-relaxed mb-8 font-medium">
                                    {product.description}
                                </p>

                                {/* Condition Block (Specific to Refurb) */}
                                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-[#f4f7e6] flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-[#a5be31] text-xl">verified</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[#111811]">Estado: Excelente (Grado A)</h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Producto inspeccionado y testado profesionalmente. 100% funcional, con batería saludable y estética impecable.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Colors */}
                                {allColors.length > 0 && (
                                    <div className="mb-6">
                                        <div className="flex justify-between mb-3">
                                            <span className="text-sm font-bold text-black uppercase tracking-wide">Acabado</span>
                                            <span className="text-sm font-medium text-gray-500">{selectedColor}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {allColors.map((color) => (
                                                <button
                                                    key={color}
                                                    onClick={() => setSelectedColor(color)}
                                                    className={`size-10 md:size-12 rounded-full relative shadow-sm transition-all duration-300 ${selectedColor === color ? 'ring-2 ring-offset-2 scale-110' : 'hover:scale-105'}`}
                                                    style={{ backgroundColor: getColorHex(color) }}
                                                    title={color}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Storage */}
                                {allStorages.length > 0 && (
                                    <div className="mb-8">
                                        <span className="text-sm font-bold text-black uppercase tracking-wide mb-3 block">Almacenamiento</span>
                                        <div className="grid grid-cols-3 gap-2">
                                            {allStorages.map((storage) => (
                                                <button
                                                    key={storage}
                                                    onClick={() => setSelectedStorage(storage)}
                                                    className={`py-3 rounded-lg border text-sm font-bold transition-all duration-200 ${selectedStorage === storage ? 'border-black bg-black text-white shadow-md transform scale-[1.02]' : 'border-gray-200 text-gray-600 hover:border-gray-400 bg-white'}`}
                                                >
                                                    {storage}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Desktop Add to Cart */}
                                <div className="hidden md:block mt-auto pt-6 border-t border-gray-100">
                                    <button
                                        onClick={() => selectedVariant && addToCart({
                                            variantId: selectedVariant.id,
                                            name: product.name + ' (Reacondicionado)',
                                            price: parseFloat(selectedVariant.price.amount),
                                            image: selectedVariant.image?.src || product.images.find(img => img.altText?.toLowerCase().includes(selectedColor.toLowerCase()))?.src || product.images[0].src,
                                            color: selectedColor,
                                            storage: selectedStorage
                                        })}
                                        disabled={!selectedVariant?.availableForSale}
                                        className={`w-full h-16 rounded-2xl font-black text-lg tracking-wide shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 ${!selectedVariant?.availableForSale ? 'bg-gray-300 cursor-not-allowed text-gray-500' : 'bg-[#111811] text-white hover:bg-[#a5be31] hover:text-[#111811]'}`}
                                    >
                                        <span className="material-symbols-outlined filled">shopping_bag</span>
                                        {selectedVariant?.availableForSale ? 'Agregar al Carrito' : 'Agotado'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Specs Section (New) --- */}
            <section className="bg-[#f5f5f7] py-8 px-4">
                <div className="max-w-[1000px] mx-auto">
                    <h2 className="text-xl md:text-2xl font-black text-center mb-8 text-[#1d1d1f]">Especificaciones</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {product.specs.map((spec, idx) => (
                            <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 bg-[#f4f7e6] rounded-full flex items-center justify-center mb-3 text-[#506313]">
                                    <span className="material-symbols-outlined text-xl">{spec.icon}</span>
                                </div>
                                <h3 className="text-base font-bold mb-1 leading-tight">{spec.label}</h3>
                                <p className="text-gray-600 font-medium leading-relaxed text-sm">{spec.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FAQ Section (New) --- */}
            <section className="bg-white py-12 px-6">
                <div className="max-w-[800px] mx-auto">
                    <h2 className="text-2xl md:text-3xl font-black mb-8 text-[#1d1d1f] text-center">Preguntas Frecuentes</h2>
                    <div className="space-y-3">
                        {[{ q: "¿Qué significa Reacondicionado?", a: "Es un equipo original que ha sido inspeccionado y restaurado para funcionar al 100%. Puede tener mínimos signos de uso estético pero internamente está perfecto." },
                        { q: "¿Tienen garantía?", a: "Sí, 12 meses de garantía directa con Movil Pro ante fallos de fábrica." },
                        { q: "¿La batería es nueva?", a: "Garantizamos una salud de batería superior al 80%, asegurando un rendimiento óptimo día a día." }
                        ].map((item, i) => (
                            <details key={i} className="group bg-[#f9fafb] rounded-xl p-5 cursor-pointer open:shadow-sm transition-shadow border border-transparent hover:border-gray-200">
                                <summary className="flex justify-between items-center font-bold text-base md:text-lg list-none text-[#1d1d1f]">
                                    {item.q}
                                    <span className="material-symbols-outlined transition-transform group-open:rotate-180 text-gray-400">expand_more</span>
                                </summary>
                                <p className="text-gray-600 mt-3 leading-relaxed font-medium text-sm">{item.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mobile Sticky Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 pt-4 pb-4 px-4 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] md:hidden z-50 pb-safe">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Total</span>
                        <span className="text-2xl font-black text-[#1d1d1f] leading-none">S/ {currentPrice}</span>
                    </div>
                    <button
                        onClick={() => selectedVariant && addToCart({
                            variantId: selectedVariant.id,
                            name: product.name + ' (Refurb)',
                            price: parseFloat(selectedVariant.price.amount),
                            image: selectedVariant.image?.src || product.images.find(img => img.altText?.toLowerCase().includes(selectedColor.toLowerCase()))?.src || product.images[0].src,
                            color: selectedColor,
                            storage: selectedStorage
                        })}
                        disabled={!selectedVariant?.availableForSale}
                        className={`flex-1 h-12 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform ${!selectedVariant?.availableForSale ? 'bg-gray-400 text-white' : 'bg-[#111811] text-white'}`}
                    >
                        {selectedVariant?.availableForSale ? 'Añadir a la Bolsa' : 'Agotado'}
                    </button>
                </div>
            </div>

        </div>
    );
};

export default ProductDetailRefurb;
