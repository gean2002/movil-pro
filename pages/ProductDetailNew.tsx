import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { fetchProductByHandle } from '../lib/shopify';

interface ProductData {
    id: string;
    name: string;
    description: string;
    price: string;
    images: string[];
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

// Static data enrichment map
const ENRICHED_DATA: Record<string, any> = {
    // AirPods 4 specific
    'airpods-4': {
        specs: [
            { label: 'Marca', value: 'Apple', icon: 'branding_watermark' },
            { label: 'Modelo', value: 'AirPods 4 (4ª generación)', icon: 'headphones' },
            { label: 'Chip', value: 'Apple H2', icon: 'memory' },
            { label: 'Audio', value: 'Audio Espacial personalizado con seguimiento de cabeza', icon: 'graphic_eq' },
            { label: 'Cancelación de ruido', value: 'Cancelación Activa de Ruido (ANC) (Modelo avanzado)', icon: 'noise_control_off' },
            { label: 'Micrófonos', value: 'Voz Aislada para llamadas más claras', icon: 'mic' },
            { label: 'Controles', value: 'Sensor de fuerza en el tallo + Siri', icon: 'touch_app' },
            { label: 'Autonomía', value: 'Hasta 5h (30h con estuche)', icon: 'battery_full' },
            { label: 'Carga', value: 'USB-C, Inalámbrica', icon: 'bolt' },
            { label: 'Resistencia', value: 'IP54 (sudor, polvo, salpicaduras)', icon: 'water_drop' },
            { label: 'Conectividad', value: 'Bluetooth 5.3', icon: 'bluetooth' }
        ],
        boxContent: [
            { name: 'AirPods 4', image: 'headphones' },
            { name: 'Estuche de Carga', image: 'battery_charging_full' },
            { name: 'Cable USB-C', image: 'cable' },
            { name: 'Documentación', image: 'menu_book' }
        ]
    },
    // iPhones
    'iphone': {
        specs: [
            { label: 'Pantalla', value: 'Super Retina XDR OLED', icon: 'smartphone' },
            { label: 'Chip', value: 'Chip A16/A17 Bionic', icon: 'memory' },
            { label: 'Cámara', value: 'Sistema Avanzado de Cámaras', icon: 'photo_camera' },
            { label: 'Batería', value: 'Todo el día de batería', icon: 'battery_horiz_075' }
        ],
        boxContent: [
            { name: 'iPhone', image: 'smartphone' }, // Icon placeholder logic
            { name: 'Cable USB-C', image: 'cable' }
        ]
    },
    'samsung': {
        specs: [
            { label: 'Pantalla', value: 'Dynamic AMOLED 2X', icon: 'smartphone' },
            { label: 'Chip', value: 'Snapdragon 8 Gen 3', icon: 'memory' },
            { label: 'Cámara', value: 'Nightography Pro', icon: 'photo_camera' },
            { label: 'Batería', value: '5000 mAh', icon: 'battery_horiz_075' }
        ],
        boxContent: [
            { name: 'Galaxy', image: 'smartphone' },
            { name: 'Cable de Datos', image: 'cable' },
            { name: 'Pin de Extracción', image: 'sim_card' }
        ]
    },
    'macbook': {
        specs: [
            { label: 'Pantalla', value: 'Liquid Retina XDR', icon: 'laptop' },
            { label: 'Chip', value: 'Apple M2/M3', icon: 'memory' },
            { label: 'Cámara', value: 'FaceTime HD 1080p', icon: 'videocam' },
            { label: 'Batería', value: 'Hasta 22 horas', icon: 'battery_horiz_075' }
        ],
        boxContent: [
            { name: 'MacBook Pro', image: 'laptop' },
            { name: 'Adaptador de Corriente', image: 'power' },
            { name: 'Cable MagSafe 3', image: 'cable' }
        ]
    },
    'default': {
        specs: [
            { label: 'Pantalla', value: 'Alta Resolución', icon: 'smartphone' },
            { label: 'Procesador', value: 'Última Generación', icon: 'memory' },
            { label: 'Cámara', value: 'Sistema Pro', icon: 'photo_camera' },
            { label: 'Batería', value: 'Larga Duración', icon: 'battery_horiz_075' }
        ],
        boxContent: [
            { name: 'Dispositivo', image: 'smartphone' },
            { name: 'Cable de Carga', image: 'cable' },
            { name: 'Manuales', image: 'menu_book' }
        ]
    }
};

const ProductDetailNew: React.FC = () => {
    const { handle } = useParams<{ handle: string }>();
    const location = useLocation();
    const { addToCart } = useCart();

    const [product, setProduct] = useState<ProductData | null>(null);
    const [loading, setLoading] = useState(true);

    const [selectedColor, setSelectedColor] = useState<string>('');
    const [selectedStorage, setSelectedStorage] = useState<string>('');
    const [selectedRam, setSelectedRam] = useState<string>(''); // New State for RAM
    const [selectedOtherOptions, setSelectedOtherOptions] = useState<Record<string, string>>({});
    const [selectedVariant, setSelectedVariant] = useState<any>(null);

    const handleOptionSelect = (optionName: string, value: string) => {
        if (!product) return;

        // 1. Try to maintain current selections if compatible
        const currentSelections = {
            ...selectedOtherOptions,
            ...(selectedColor ? { 'Color': selectedColor } : {}), // Simplified key check, real logic checks array
            ...(selectedStorage ? { 'Storage': selectedStorage } : {}),
            ...(selectedRam ? { 'RAM': selectedRam } : {})
        };

        // We need to check against the mapped names used in state setting
        // Helper to check if a variant matches a specific set of criteria
        const isVariantMatch = (v: any, criteria: Record<string, string>) => {
            return Object.entries(criteria).every(([cKey, cVal]) => {
                // Optimization: Pre-identify option types to match the loose keys used in state
                // This is tricky because 'Storage' state matches 'Almacenamiento' option.
                // We'll reverse-lookup or just check loose compliance behavior.
                return v.selectedOptions.some((o: any) => {
                    // Check if option 'o' corresponds to criteria key 'cKey'
                    // This is simplified. For robust "Sticky" selection, we need strict mapping.
                    // GIVEN THE USER REQUEST: "Auto-select others based on Color", 
                    // The simple "Find First Valid" approach is likely what they want for the Watch use-case
                    // where options are often mutually exclusive bundles.
                    return o.value === cVal; // Weak check, sufficient if value uniqueness is high, but risky.
                });
            });
        };

        // "Smart Select" Strategy:
        // Priority 1: Find variant with New Option + Current Selections (Sticky)
        // Priority 2: Find first variant with New Option (Auto-update siblings)

        let candidate = product.variants.find((v: any) =>
            v.selectedOptions.some((o: any) => o.name === optionName && o.value === value) &&
            // Check compatibility with others roughly
            (!selectedColor || v.selectedOptions.some((o: any) => ['Color', 'Colour'].includes(o.name) && o.value === selectedColor)) &&
            (!selectedStorage || v.selectedOptions.some((o: any) => ['Storage', 'Capacity', 'Almacenamiento', 'Capacidad', 'Size', 'Tamaño'].includes(o.name) && o.value === selectedStorage))
            // Add RAM/Other checks if needed
        );

        if (!candidate) {
            // Fallback: Just pick first variant with the new option key/value
            candidate = product.variants.find((v: any) =>
                v.selectedOptions.some((o: any) => o.name === optionName && o.value === value)
            );
        }

        if (candidate) {
            // Apply ALL options from the candidate (Auto-Select Force)
            candidate.selectedOptions.forEach((o: any) => {
                const name = o.name;
                const val = o.value;

                if (['Color', 'Colour'].includes(name)) setSelectedColor(val);
                else if (['Storage', 'Capacidad', 'Almacenamiento', 'Size', 'Tamaño'].includes(name)) setSelectedStorage(val);
                else if (['Memoria', 'Memory', 'RAM'].includes(name)) setSelectedRam(val);
                else {
                    setSelectedOtherOptions(prev => ({ ...prev, [name]: val }));
                }
            });
        }
    };

    // Determine root category from path for breadcrumbs
    const pathSegments = location.pathname.split('/');
    const rootCategory = pathSegments[1] || 'smartphones';

    useEffect(() => {
        const fetchProduct = async () => {
            if (!handle) return;
            setLoading(true);
            try {
                const shopifyProduct = await fetchProductByHandle(handle);

                if (shopifyProduct) {
                    // Determine enrichment key
                    let enrichmentKey = 'default';
                    const titleLower = shopifyProduct.title.toLowerCase();
                    if (titleLower.includes('airpods 4')) enrichmentKey = 'airpods-4';
                    else if (titleLower.includes('iphone')) enrichmentKey = 'iphone';
                    else if (titleLower.includes('samsung') || titleLower.includes('galaxy')) enrichmentKey = 'samsung';
                    else if (titleLower.includes('macbook')) enrichmentKey = 'macbook';

                    const enrichedObj = ENRICHED_DATA[enrichmentKey];

                    // Map options to ensure values are arrays of strings (Shopify returns object array sometimes?)
                    // Assuming shopifyProduct.options.values is string[] based on interface, but let's be safe.

                    const mappedProduct: ProductData = {
                        id: shopifyProduct.id,
                        name: shopifyProduct.title,
                        description: shopifyProduct.description || 'Descubre la última tecnología con este increíble dispositivo.',
                        price: shopifyProduct.variants[0]?.price.amount,
                        images: shopifyProduct.images.map((img: any) => img.src),
                        options: shopifyProduct.options.map((opt: any) => ({
                            name: opt.name,
                            values: opt.values // Values are already strings in GraphQL
                        })),
                        variants: shopifyProduct.variants,
                        specs: enrichedObj.specs,
                        boxContent: enrichedObj.boxContent
                    };

                    setProduct(mappedProduct);

                    // Set defaults
                    if (mappedProduct.options.length > 0) {
                        const defaultColor = mappedProduct.options.find(o => ['Color', 'Colour'].includes(o.name))?.values[0];
                        // Removed 'Memoria' from storage defaults to prevent conflict
                        const defaultStorage = mappedProduct.options.find(o => ['Storage', 'Capacidad', 'Almacenamiento', 'Size', 'Tamaño'].includes(o.name))?.values[0];
                        const defaultRam = mappedProduct.options.find(o => ['Memoria', 'Memory', 'RAM'].includes(o.name))?.values[0];

                        if (defaultColor) setSelectedColor(defaultColor);
                        if (defaultStorage) setSelectedStorage(defaultStorage);
                        if (defaultRam) setSelectedRam(defaultRam);

                        // Find initial variant using these defaults
                        const variant = mappedProduct.variants.find((v: any) => {
                            const isColorMatch = !defaultColor || v.selectedOptions.some((o: any) => ['Color', 'Colour'].includes(o.name) && o.value === defaultColor);
                            const isStorageMatch = !defaultStorage || v.selectedOptions.some((o: any) => ['Storage', 'Capacidad', 'Almacenamiento', 'Size', 'Tamaño'].includes(o.name) && o.value === defaultStorage);
                            const isRamMatch = !defaultRam || v.selectedOptions.some((o: any) => ['Memoria', 'Memory', 'RAM'].includes(o.name) && o.value === defaultRam);
                            return isColorMatch && isStorageMatch && isRamMatch;
                        });

                        if (variant) {
                            setSelectedVariant(variant);
                        } else {
                            // Fallback if strict match fails
                            setSelectedVariant(mappedProduct.variants[0]);
                        }
                    } else {
                        // No options, just select first variant
                        setSelectedVariant(mappedProduct.variants[0]);
                    }
                } else {
                    console.error("Product not found");
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [handle]);

    // Update selected variant when options change
    // Update selected variant when options change
    useEffect(() => {
        if (product) {
            console.log('Searching variant for:', { selectedColor, selectedStorage, selectedRam, selectedOtherOptions });

            const variant = product.variants.find((v: any) => {
                const isColorMatch = !selectedColor || v.selectedOptions.some((o: any) => ['Color', 'Colour'].includes(o.name) && o.value === selectedColor);
                const isStorageMatch = !selectedStorage || v.selectedOptions.some((o: any) => ['Storage', 'Capacidad', 'Almacenamiento', 'Size', 'Tamaño'].includes(o.name) && o.value === selectedStorage);
                const isRamMatch = !selectedRam || v.selectedOptions.some((o: any) => ['Memoria', 'Memory', 'RAM'].includes(o.name) && o.value === selectedRam);

                // Checks for extra options
                const isOtherMatch = Object.entries(selectedOtherOptions).every(([key, val]) =>
                    v.selectedOptions.some((o: any) => o.name === key && o.value === val)
                );

                return isColorMatch && isStorageMatch && isRamMatch && isOtherMatch;
            });

            if (variant) {
                console.log('Found variant:', variant.title);
                setSelectedVariant(variant);
            } else {
                console.warn('No matching variant found!');
            }
        }
    }, [selectedColor, selectedStorage, product, selectedRam, selectedOtherOptions]); // Added selectedRam dependency

    useEffect(() => {
        if (selectedVariant) {
            console.log('Selected Variant Debug:', {
                id: selectedVariant.id,
                title: selectedVariant.title,
                qty: selectedVariant.quantityAvailable,
                availableForSale: selectedVariant.availableForSale,
                price: selectedVariant.price.amount
            });
        }
    }, [selectedColor, selectedStorage, product, selectedVariant]);


    const handleAddToCart = () => {
        if (!product || !selectedVariant) return;

        addToCart({
            variantId: selectedVariant.id,
            name: product.name,
            price: parseFloat(selectedVariant.price.amount),
            image: product.images[0],
            color: selectedColor,
            storage: selectedStorage || selectedRam, // Legacy fallback
            condition: 'Nuevo',
            selectedOptions: selectedVariant.selectedOptions // Pass all Shopify options
        });
        alert('Producto añadido al carrito');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-4 p-5 bg-gray-200 rounded w-48 mb-4"></div>
                    <div className="h-64 w-64 bg-gray-200 rounded-3xl"></div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
                <Link to="/" className="text-blue-600 underline">Volver al inicio</Link>
            </div>
        );
    }

    // Helper to get Color Hex
    const getColorHex = (colorName: string) => {
        const map: Record<string, string> = {
            // Spanish
            'Titanio Natural': '#8E8D8A', 'Natural': '#8E8D8A',
            'Titanio Azul': '#1F2C45', 'Azul': '#1F2C45',
            'Titanio Blanco': '#F2F1EC', 'Blanco': '#F2F1EC', 'Plata': '#e3e4e5',
            'Titanio Negro': '#1C1C1E', 'Negro': '#1C1C1E', 'Gris Espacial': '#4a4a4a',
            'Rosa': '#fae1dc', 'Amarillo': '#fdf6dd', 'Verde': '#eaf6ed',
            'Medianoche': '#191f26', 'Estrella': '#faf7f2', 'Grafito': '#41424C',
            'Oro': '#F9E5C9', 'Sierra Azul': '#9BB5CE', 'Verde Alpino': '#505E4E',
            'Morado Oscuro': '#483C4E', 'Negro Espacial': '#1D1D1F',

            // English
            'Natural Titanium': '#8E8D8A', 'Blue Titanium': '#1F2C45',
            'White Titanium': '#F2F1EC', 'Black Titanium': '#1C1C1E',
            'Silver': '#e3e4e5', 'Space Gray': '#4a4a4a', 'Space Grey': '#4a4a4a',
            'Midnight': '#191f26', 'Starlight': '#faf7f2', 'Pink': '#fae1dc',
            'Yellow': '#fdf6dd', 'Green': '#eaf6ed', 'Blue': '#215E7C',
            'Gold': '#F9E5C9', 'Graphite': '#41424C', 'Sierra Blue': '#9BB5CE',
            'Alpine Green': '#505E4E', 'Deep Purple': '#483C4E', 'Space Black': '#1D1D1F',
            'Red': '#E21A2C', '(Product)Red': '#E21A2C'
        };
        return map[colorName] || '#cccccc';
    };

    const currentPrice = selectedVariant
        ? parseFloat(selectedVariant.price.amount).toLocaleString('es-PE', { minimumFractionDigits: 0 })
        : '---';

    return (
        <div className="flex flex-col bg-white relative w-full overflow-x-hidden">

            {/* --- Main Product Section --- */}
            <div className="flex flex-col pb-8 bg-white">
                {/* Breadcrumbs */}
                <div className="px-4 md:px-10 lg:px-40 flex justify-center pt-4">
                    <div className="flex flex-wrap gap-2 px-4 py-2 justify-center md:justify-start">
                        <Link to="/" className="text-gray-500 text-xs md:text-sm font-medium hover:text-black transition-colors">Inicio</Link>
                        <span className="text-gray-400 text-xs md:text-sm font-medium">/</span>
                        <Link to={`/${rootCategory}`} className="text-gray-500 text-xs md:text-sm font-medium hover:text-black transition-colors capitalize">{rootCategory}</Link>
                        <span className="text-gray-400 text-xs md:text-sm font-medium">/</span>
                        <span className="text-black text-xs md:text-sm font-medium line-clamp-1">{product.name}</span>
                    </div>
                </div>

                <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-4">
                    <div className="bg-[#fcfdfc] border border-[#a5be31]/30 rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-10 lg:p-16 flex flex-1 justify-center shadow-inner">
                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 max-w-[1280px] flex-1">
                            {/* Left: Images */}
                            <div className="flex-1 min-w-0 flex flex-col gap-6">
                                <div className="w-full bg-white aspect-square rounded-[2rem] overflow-hidden relative border border-gray-100 shadow-sm flex items-center justify-center p-8 group">
                                    <div className="absolute top-6 left-6 z-10 flex flex-col gap-2 items-start">
                                        <span className="bg-[#ecfdf5] text-green-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-green-200 flex items-center gap-1 shadow-sm">
                                            <span className="material-symbols-outlined text-[14px] filled">verified</span> Garantía Movil Pro
                                        </span>
                                    </div>
                                    <div className="w-full h-full bg-center bg-contain bg-no-repeat transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('${selectedVariant?.image?.src || product.images[0]}')` }}></div>
                                </div>
                                {/* Trust Badges - Responsive Grid */}
                                <div className="grid grid-cols-3 gap-2 md:gap-3">
                                    <div className="bg-gray-50 p-2 md:p-3 rounded-2xl flex flex-col items-center text-center gap-1 md:gap-1.5 border border-gray-100">
                                        <span className="material-symbols-outlined text-green-600 text-[18px] md:text-[20px]">verified_user</span>
                                        <span className="text-[8px] md:text-[9px] font-black text-gray-900 uppercase leading-tight">Garantía Movil Pro</span>
                                    </div>
                                    <div className="bg-gray-50 p-2 md:p-3 rounded-2xl flex flex-col items-center text-center gap-1 md:gap-1.5 border border-gray-100">
                                        <span className="material-symbols-outlined text-blue-600 text-[18px] md:text-[20px]">inventory_2</span>
                                        <span className="text-[8px] md:text-[9px] font-black text-gray-900 uppercase leading-tight">Caja Sellada</span>
                                    </div>
                                    <div className="bg-gray-50 p-2 md:p-3 rounded-2xl flex flex-col items-center text-center gap-1 md:gap-1.5 border border-gray-100">
                                        <span className="material-symbols-outlined text-orange-600 text-[18px] md:text-[20px]">rocket_launch</span>
                                        <span className="text-[8px] md:text-[9px] font-black text-gray-900 uppercase leading-tight">Envío Express</span>
                                    </div>
                                </div>

                                {/* Gallery */}
                                <div className="flex gap-2 overflow-x-auto pb-2 snap-x md:grid md:grid-cols-4 md:overflow-visible scrollbar-hide px-1 mt-2">
                                    {product.images.slice(0, 4).map((src, i) => (
                                        <button key={i} className={`flex-shrink-0 w-16 h-16 md:w-auto md:h-auto md:aspect-square rounded-xl border transition-all duration-200 bg-[#f6f8f6] overflow-hidden snap-start hover:border-gray-300`}>
                                            <div className="w-full h-full bg-center bg-contain bg-no-repeat opacity-80 hover:opacity-100 p-1" style={{ backgroundImage: `url('${src}')` }}></div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Right: Details */}
                            <div className="flex-1 min-w-0 flex flex-col pt-2">
                                <div className="mb-4">

                                    <h1 className="text-[#111811] tracking-tight text-3xl md:text-5xl font-black leading-tight mb-2">{product.name}</h1>

                                    <div className="flex items-center gap-2 mb-4 text-sm font-bold text-gray-500">
                                        <span className="text-yellow-500">★★★★★</span> 5.0
                                    </div>

                                    <div className="flex items-end gap-3 mb-6">
                                        <span className="text-4xl font-black text-[#111811] tracking-tighter">S/ {currentPrice}</span>
                                        <div className="flex flex-col mb-1">
                                            <span className="text-sm text-gray-400 line-through font-medium">S/ {(parseFloat(selectedVariant?.price.amount || '0') * 1.2).toLocaleString('es-PE', { maximumFractionDigits: 0 })}</span>
                                            <span className="text-xs text-green-600 font-bold uppercase tracking-tight">Ahorras S/ {(parseFloat(selectedVariant?.price.amount || '0') * 0.2).toLocaleString('es-PE', { maximumFractionDigits: 0 })}</span>
                                        </div>
                                    </div>
                                </div>



                                <p className="text-gray-600 text-base leading-relaxed mb-8 font-medium">
                                    {product.description}
                                </p>

                                {/* Colors */}
                                {product.options.some(o => o.name === 'Color' || o.name === 'Color') && (
                                    <div className="mb-6">
                                        <div className="flex justify-between mb-3">
                                            <span className="text-sm font-bold text-black uppercase tracking-wide">Acabado</span>
                                            <span className="text-sm font-medium text-gray-500">{selectedColor}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {product.options.find(o => o.name === 'Color' || o.name === 'Color')?.values.map((val) => (
                                                <button
                                                    key={val}
                                                    onClick={() => handleOptionSelect('Color', val)}
                                                    className={`size-10 md:size-12 rounded-full relative shadow-sm transition-all duration-300 ${selectedColor === val ? 'ring-2 ring-offset-2 scale-110' : 'hover:scale-105'}`}
                                                    style={{ backgroundColor: getColorHex(val) }}
                                                    title={val}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Storage (Almacenamiento/Capacidad) */}
                                {product.options.some(o => ['Storage', 'Capacidad', 'Almacenamiento'].includes(o.name)) && (
                                    <>
                                        <div className="mb-6">
                                            <div className="flex justify-between mb-3"><span className="text-sm font-bold text-black uppercase tracking-wide">
                                                {product.options.find(o => ['Storage', 'Capacidad', 'Almacenamiento'].includes(o.name))?.name}
                                            </span></div>
                                            <div className="grid grid-cols-3 gap-2">
                                                {product.options.find(o => ['Storage', 'Capacidad', 'Almacenamiento'].includes(o.name))?.values.map((val) => (
                                                    <button
                                                        key={val}
                                                        onClick={() => {
                                                            const optName = product.options.find(o => ['Storage', 'Capacidad', 'Almacenamiento'].includes(o.name))?.name || 'Storage';
                                                            handleOptionSelect(optName, val);
                                                        }}
                                                        className={`py-3 rounded-lg border text-sm font-bold transition-all duration-200 ${selectedStorage === val ? 'border-black bg-black text-white shadow-md transform scale-[1.02]' : 'border-gray-200 text-gray-600 hover:border-gray-400 bg-white'}`}
                                                    >
                                                        {val}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Memory (RAM/Memoria) */}
                                {product.options.some(o => ['Memoria', 'Memory', 'RAM'].includes(o.name)) && (
                                    <div className="mb-8">
                                        <div className="flex justify-between mb-3"><span className="text-sm font-bold text-black uppercase tracking-wide">
                                            {product.options.find(o => ['Memoria', 'Memory', 'RAM'].includes(o.name))?.name}
                                        </span></div>
                                        <div className="grid grid-cols-3 gap-2">
                                            {product.options.find(o => ['Memoria', 'Memory', 'RAM'].includes(o.name))?.values.map((val) => (
                                                <button
                                                    key={val}
                                                    onClick={() => {
                                                        const optName = product.options.find(o => ['Memoria', 'Memory', 'RAM'].includes(o.name))?.name || 'RAM';
                                                        handleOptionSelect(optName, val);
                                                    }}
                                                    className={`py-3 rounded-lg border text-sm font-bold transition-all duration-200 ${selectedRam === val ? 'border-black bg-black text-white shadow-md transform scale-[1.02]' : 'border-gray-200 text-gray-600 hover:border-gray-400 bg-white'}`}
                                                >
                                                    {val}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Mobile Reservation Guide */}
                                {selectedVariant?.availableForSale && !(selectedVariant?.quantityAvailable > 0) && (
                                    <div className="md:hidden mt-4 bg-gray-50 p-4 rounded-xl border border-gray-100 animate-fade-in mb-6">
                                        <div className="flex items-center gap-2 mb-2 text-gray-900 font-bold text-sm">
                                            <span className="material-symbols-outlined text-[#1d1d1f] text-[18px]">info</span>
                                            Guía de Reserva
                                        </div>
                                        <p className="text-xs text-gray-500 leading-relaxed">
                                            Este producto se encuentra actualmente en tránsito o bajo pedido. Al hacer clic en Reservar, aseguras tu unidad. La demora estimada de entrega es de 7 a 14 días hábiles.
                                        </p>
                                    </div>
                                )}

                                {/* Fallback for OTHER Options (Generic Renderer) */}
                                {product.options
                                    .filter(o => !['Color', 'Colour', 'Storage', 'Capacidad', 'Almacenamiento', 'Memoria', 'Size', 'Tamaño', 'Title'].includes(o.name))
                                    .map((opt, idx) => (
                                        <div key={idx} className="mb-8">
                                            <div className="flex justify-between mb-3">
                                                <span className="text-sm font-bold text-black uppercase tracking-wide">{opt.name}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {opt.values.map((val) => {
                                                    const isSelected = selectedOtherOptions[opt.name] === val;
                                                    return (
                                                        <button
                                                            key={val}
                                                            onClick={() => handleOptionSelect(opt.name, val)}
                                                            className={`py-2 px-4 rounded-lg border text-sm font-bold transition-all duration-200 ${isSelected ? 'border-black bg-black text-white shadow-md transform scale-[1.02]' : 'border-gray-200 text-gray-600 hover:border-gray-400 bg-white'}`}
                                                            title={opt.name}
                                                        >
                                                            {val}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}

                                {/* Desktop Add to Cart */}
                                <div className="hidden md:flex flex-col gap-4 mb-6">
                                    {(() => {
                                        const isAvailable = selectedVariant?.availableForSale;
                                        const hasStock = selectedVariant?.quantityAvailable > 0;
                                        const isPreOrder = isAvailable && !hasStock;

                                        return (
                                            <div className="flex flex-col gap-4">
                                                <button
                                                    onClick={handleAddToCart}
                                                    disabled={!isAvailable}
                                                    className={`w-full text-white text-lg font-bold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-3 group active:scale-[0.98] 
                                                ${!isAvailable
                                                            ? 'bg-gray-400 cursor-not-allowed'
                                                            : isPreOrder
                                                                ? 'bg-gray-800 hover:bg-gray-700'
                                                                : 'bg-[#111811] hover:bg-[#a5be31] hover:text-[#111811]'
                                                        }`}
                                                >
                                                    <span className="material-symbols-outlined group-hover:animate-bounce">
                                                        {!isAvailable ? 'block' : isPreOrder ? 'event_available' : 'shopping_bag'}
                                                    </span>
                                                    {isAvailable
                                                        ? (isPreOrder ? 'Reservar' : 'Añadir a la Bolsa')
                                                        : 'Agotado'}
                                                </button>

                                                {/* Reservation Guide */}
                                                {isPreOrder && (
                                                    <div className="bg-[#f0f4f8] border-l-4 border-[#1e293b] p-4 rounded-r-xl animate-fade-in">
                                                        <div className="flex items-start gap-3">
                                                            <span className="material-symbols-outlined text-[#1e293b] text-xl mt-0.5">info</span>
                                                            <div className="flex flex-col gap-1">
                                                                <p className="text-sm font-bold text-[#1e293b] uppercase tracking-tight">Guía de Reserva</p>
                                                                <p className="text-xs text-[#475569] font-medium leading-relaxed">
                                                                    Este producto se encuentra actualmente en tránsito o bajo pedido. Al hacer clic en <span className="font-bold">Reservar</span>, aseguras tu unidad. La demora estimada de entrega es de <span className="font-bold text-[#1e293b]">7 a 14 días hábiles</span>.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()}

                                    <div className="flex items-center justify-center gap-6 text-xs font-bold text-gray-400 uppercase tracking-tight">
                                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">local_shipping</span> Envío gratis</span>
                                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">verified_user</span> Garantía Movil Pro</span>
                                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">lock</span> Pagos Seguros</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- New Section: Specifications --- */}
            <section className="bg-[#f5f5f7] py-8 px-4">
                <div className="max-w-[1000px] mx-auto">
                    <h2 className="text-xl md:text-2xl font-black text-center mb-8 text-[#1d1d1f]">Características</h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {product.specs.map((spec, idx) => (
                            <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-3 text-black">
                                    <span className="material-symbols-outlined text-xl">{spec.icon}</span>
                                </div>
                                <h3 className="text-base font-bold mb-1 leading-tight">{spec.label}</h3>
                                <p className="text-gray-600 font-medium leading-relaxed text-sm">{spec.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- New Section: What's in the Box --- */}
            <section className="bg-white py-8 px-4 border-b border-gray-100">
                <div className="max-w-[1000px] mx-auto text-center">
                    <h2 className="text-xl md:text-2xl font-black mb-6 text-[#1d1d1f]">Contenido de la caja</h2>
                    <div className="grid grid-cols-4 gap-2 md:gap-8 justify-items-center items-start">
                        {product.boxContent.map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-2 group w-full">
                                <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-50 rounded-full flex items-center justify-center mb-1 group-hover:scale-110 transition-transform duration-500 shadow-sm border border-gray-100">
                                    {/* Placeholder Logic for Icons if image not available */}
                                    {idx === 0 ? (
                                        <img src={product.images[0]} className="h-10 md:h-14 object-contain mix-blend-multiply" alt={item.name} />
                                    ) : (
                                        <span className="material-symbols-outlined text-2xl md:text-4xl text-gray-400">{item.image}</span>
                                    )}
                                </div>
                                <span className="font-bold text-gray-900 text-[10px] md:text-sm leading-tight text-center px-1">{item.name}</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-gray-400 text-[10px] font-medium mt-8 max-w-lg mx-auto leading-relaxed">
                        * El contenido puede variar según la región. Adaptadores de corriente se venden por separado en algunos modelos.
                    </p>
                </div>
            </section>

            {/* --- New Section: FAQ --- */}
            <section className="bg-[#f5f5f7] py-12 px-6">
                <div className="max-w-[800px] mx-auto">
                    <h2 className="text-2xl md:text-3xl font-black mb-8 text-[#1d1d1f] text-center">Preguntas Frecuentes</h2>
                    <div className="space-y-3">
                        {[
                            { q: "¿Cuánto tarda el envío?", a: "Los envíos a Lima Metropolitana se entregan en 24 horas hábiles. Para provincias, el tiempo estimado es de 2 a 4 días hábiles." },
                            { q: "¿Tiene garantía?", a: "Sí, todos nuestros equipos cuentan con 1 año de garantía Movil Pro, válida directamente con nosotros o servicio técnico autorizado." },
                            { q: "¿Qué métodos de pago aceptan?", a: "Aceptamos todas las tarjetas de crédito/débito, transferencias bancarias y pagos en efectivo contra entrega (solo Lima)." }
                        ].map((item, i) => (
                            <details key={i} className="group bg-white rounded-xl p-5 cursor-pointer open:shadow-sm transition-shadow border border-transparent hover:border-gray-200">
                                <summary className="flex justify-between items-center font-bold text-base md:text-lg list-none text-[#1d1d1f]">
                                    {item.q}
                                    <span className="material-symbols-outlined transition-transform group-open:rotate-180 text-gray-400">expand_more</span>
                                </summary>
                                <p className="text-gray-600 mt-3 leading-relaxed font-medium text-sm">
                                    {item.a}
                                </p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- New Section: Recommended Accessories --- */}
            <section className="bg-white py-12 px-6 pb-12">
                <div className="max-w-[1280px] mx-auto">
                    <div className="flex justify-between items-end mb-8">
                        <h2 className="text-2xl font-black text-[#1d1d1f]">Completa tu compra</h2>
                        <Link to="/accessories" className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1">
                            Ver todo <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </Link>
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-4 snap-x scrollbar-hide">
                        {[
                            { name: 'Funda MagSafe', price: 'S/ 49', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAsjDFK0sU_Z0W8esd6cD6-Id_dIROimRA1e1Ce8zuSX4UCECxpd9ua3Qnfm2QOi0EFoVqEm57-QF_Y6xD1aLJ6_2HwDllcK3bAhzcFWNwNGVLja3ttxClvhO1NVtTyd2TyXlPEPVvYIiXGZSTyrhQcZq8JeYw4htWEWM0QVxShiGUi9nVoI5EMM20W6eUkPbmsLL2WizjztMeFal1FDUEldS2YDB7ZeB_7ftH4UuH3qiNGoUf0v5_gOoQrzp6KmPFjts43FHHu8tO' },
                            { name: 'Cargador 20W', price: 'S/ 19', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtx-xlrdUDGoQ1PbJCJXkgjFHMoKdbfWLJk1Sb74G4fbT3EUHQFU-fxUCK97qHSgf-Y0erV4w49KJI9S1oNhuhNqWxlDwVxkQAW4jo193KMsuGSD3yXc4rCeF21Q6ij4CiBauI-wqjEeuU0-4nkGKhsZUygyWa21YrevozFTC24LlHsJ1CoDsnKiKSK7-SA8ELUIPAC9Rqk_NXmzDHSbRknVg4mPLmG1_VRF1NInLa6juvO4JV_rRWRFWMVqk-8NmUILdzx60Y5Bif' },
                            { name: 'AirPods Pro', price: 'S/ 249', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBghqGgOz6snUsCtQleQwf-Xk4chBunJ0kJgBETaFa1RjdGhYtGjkZV2S19rbF-WDA37lM43AoLsqs8qoOo70du9tU_ZtGYnbukfXry16xC1p9yhIg4TGx-CmjzTj87nL3V1soRxSaLISLrbnj60IG9ceZ9G2SmaVJk72t6mO9jXx2gqPzACccd0023ZPj6rdcMMe9mOss34NtkyjXD99Jkf_mC3irH5ZZrqOCmb95BlFWLutY6m5r3tMov3zIc0VcOcMxHXcBgsUMt' }
                        ].map((acc, i) => (
                            <div key={i} className="w-56 md:w-64 flex-shrink-0 bg-white border border-gray-100 rounded-2xl p-4 md:p-5 snap-start hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                                <div className="aspect-square bg-gray-50 rounded-xl mb-4 flex items-center justify-center p-4 group-hover:bg-gray-100 transition-colors">
                                    <img src={acc.img} className="h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110" alt={acc.name} />
                                </div>
                                <h3 className="font-bold text-[#1d1d1f] mb-1 text-sm md:text-base leading-tight text-balance">{acc.name}</h3>
                                <div className="flex justify-between items-center mt-3">
                                    <span className="text-gray-900 font-bold text-base md:text-lg">{acc.price}</span>
                                    <button className="w-8 h-8 md:w-9 md:h-9 rounded-lg md:rounded-xl bg-black text-white flex items-center justify-center hover:bg-[#a5be31] hover:text-black transition-all shadow-md transform active:scale-90">
                                        <span className="material-symbols-outlined text-[16px] md:text-[18px]">add</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mobile Sticky Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 pt-6 pb-6 px-4 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] md:hidden z-50 pb-safe">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Total</span>
                        <span className="text-2xl font-black text-[#1d1d1f] leading-none">S/ {currentPrice}</span>
                    </div>
                    {(() => {
                        const isAvailable = selectedVariant?.availableForSale;
                        const hasStock = selectedVariant?.quantityAvailable > 0;
                        const isPreOrder = isAvailable && !hasStock;

                        return (
                            <div className="flex-1 flex flex-col gap-2">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!isAvailable}
                                    className={`w-full h-12 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform 
                                    ${!isAvailable
                                            ? 'bg-gray-400 text-white cursor-not-allowed'
                                            : isPreOrder
                                                ? 'bg-gray-800 text-white hover:bg-gray-700'
                                                : 'bg-[#111811] text-white'
                                        }`}
                                >
                                    {isAvailable
                                        ? (isPreOrder ? 'Reservar' : 'Añadir a la Bolsa')
                                        : 'Agotado'}
                                </button>
                                {isPreOrder && (
                                    <div className="flex items-center gap-1 justify-center text-[9px] text-gray-500 font-bold uppercase tracking-tighter">
                                        <span className="material-symbols-outlined text-[12px]">info</span>
                                        Entrega estimada: 7-14 días
                                    </div>
                                )}
                            </div>
                        );
                    })()}
                </div>
                <div className="flex items-center justify-center gap-4 mt-2 text-[8px] font-bold text-gray-400 uppercase tracking-tighter">
                    <span className="flex items-center gap-0.5"><span className="material-symbols-outlined text-[14px]">local_shipping</span> Envío gratis</span>
                    <span className="flex items-center gap-0.5"><span className="material-symbols-outlined text-[14px]">verified_user</span> Garantía Movil Pro</span>
                    <span className="flex items-center gap-0.5"><span className="material-symbols-outlined text-[14px]">lock</span> Pagos Seguros</span>
                </div>

                <style>{`
  .pb-safe {
    padding-bottom: env(safe-area-inset-bottom, 120px);
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`}</style>
            </div>
        </div >
    );
};

export default ProductDetailNew;