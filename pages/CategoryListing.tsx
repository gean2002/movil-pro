import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { shopifyClient, fetchCollectionWithProducts, fetchAllProducts } from '../lib/shopify';

// --- Interfaces ---
interface SimpleProduct {
    id: string;
    name: string;
    price: string;
    rawPrice: number; // Added for sorting
    color: string;
    storage: string;
    image: string;
    tag: string;
    status: string;
    colors: string[];
    availableStorages: string[];
    link: string;
}

// Helper for Color Hex
const getColorHex = (colorName: string) => {
    const map: Record<string, string> = {
        // Spanish
        'Titanio Natural': '#8E8D8A', 'Natural': '#8E8D8A',
        'Titanio Azul': '#1F2C45', 'Azul': '#1F2C45',
        'Titanio Blanco': '#F2F1EC', 'Blanco': '#F2F1EC', 'Plata': '#e3e4e5',
        'Titanio Negro': '#1C1C1E', 'Negro': '#1C1C1E', 'Gris Espacial': '#4a4a4a',
        'Rosa': '#fae1dc', 'Rosado': '#fae1dc', 'Amarillo': '#fdf6dd', 'Verde': '#eaf6ed',
        'Medianoche': '#191f26', 'Estrella': '#faf7f2', 'Grafito': '#41424C',
        'Oro': '#F9E5C9', 'Dorado': '#F9E5C9', 'Sierra Azul': '#9BB5CE', 'Verde Alpino': '#505E4E',
        'Titanio Desierto': '#C5B499', 'Desierto': '#C5B499', 'Desert': '#C5B499', 'Deret': '#C5B499',
        'Morado Oscuro': '#483C4E', 'Morado': '#483C4E', 'Negro Espacial': '#1D1D1F',
        'Naranja': '#ff9f0a', 'Coral': '#ff7f50',
        'Violeta': '#E6E6FA',
        // English
        'Natural Titanium': '#8E8D8A', 'Blue Titanium': '#1F2C45',
        'White Titanium': '#F2F1EC', 'Black Titanium': '#1C1C1E',
        'Silver': '#e3e4e5', 'Space Gray': '#4a4a4a',
        'Midnight': '#191f26', 'Starlight': '#faf7f2', 'Pink': '#fae1dc',
        'Yellow': '#fdf6dd', 'Green': '#eaf6ed', 'Blue': '#215E7C',
        'Gold': '#F9E5C9', 'Graphite': '#41424C', 'Space Black': '#1D1D1F',
        'Red': '#E21A2C', '(Product)Red': '#E21A2C'
    };

    const normalizedInput = colorName.trim().toLowerCase();
    const foundKey = Object.keys(map).find(key => key.toLowerCase() === normalizedInput);

    return foundKey ? map[foundKey] : '#cccccc';
};

// --- Component ---
const CategoryListing: React.FC<{ categoryType: string }> = ({ categoryType }) => {
    // State
    const [products, setProducts] = useState<SimpleProduct[]>([]);
    const [allProducts, setAllProducts] = useState<SimpleProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [collectionInfo, setCollectionInfo] = useState({ title: '', description: '' });

    // Filters State
    const [selectedModels, setSelectedModels] = useState<string[]>([]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState<string>('relevance'); // 'relevance', 'price-asc', 'price-desc'

    // Derived Lists for Filters
    const availableModels = Array.from(new Set(allProducts.map(p => p.name.split(' ').slice(0, 3).join(' ')))) as string[];
    const availableColors = Array.from(new Set(allProducts.flatMap(p => p.colors))) as string[];

    // Mappings
    const categoryMapping: Record<string, string[]> = {
        'smartphones': ['iphone', 'samsung'],
        'iphone': ['iphone'],
        'samsung': ['samsung'],
        'tablets': ['ipad', 'tablets'],
        'ipad': ['ipad'],
        'computadoras': ['macbook-air', 'macbook-pro'],
        'macbook-air': ['macbook-air'],
        'macbook-pro': ['macbook-pro'],
        'relojes': ['apple-watch', 'galaxy-watch', 'relojes'],
        'apple-watch': ['apple-watch'],
        'galaxy-watch': ['galaxy-watch'],
        'audio': ['airpods', 'galaxy-buds', 'audio'],
        'airpods': ['airpods'],
        'samsung-buds': ['galaxy-buds'],
        'promociones': ['promociones'],
        'reacondicionados': ['reacondicionados'],
        'reacondicionados-iphone': ['reacondicionados'],
        'accesorios': ['accesorios', 'cases', 'cargadores', 'accessorios'],
    };

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            try {
                const targetHandles = categoryMapping[categoryType] || [categoryType];
                let allProducts: SimpleProduct[] = [];
                let foundTitle = '';
                let foundDesc = '';


                // Parallel fetch for all mapped collections
                await Promise.all(targetHandles.map(async (handle) => {
                    const collection = await fetchCollectionWithProducts(handle);
                    if (collection && collection.products) {
                        foundTitle = collection.title;
                        foundDesc = collection.description;

                        // Mapear productos
                        const mapped: SimpleProduct[] = collection.products.map((p: any) => {
                            const priceAmount = parseFloat(p.variants?.[0]?.price?.amount || '0');
                            const currencyCode = p.variants?.[0]?.price?.currencyCode === 'PEN' ? 'S/' : (p.variants?.[0]?.price?.currencyCode || 'S/');
                            const price = `${currencyCode} ${priceAmount.toLocaleString('es-PE', { minimumFractionDigits: 0 })}`;

                            const image = p.images?.[0]?.src || '';

                            // Extract Options
                            const colorOption = p.options?.find((o: any) => o.name === 'Color' || o.name === 'Colour' || o.name === 'Acabado');
                            const colors = colorOption ? colorOption.values : [];

                            const storageOption = p.options?.find((o: any) => o.name === 'Storage' || o.name === 'Almacenamiento' || o.name === 'Capacidad');
                            const availableStorages = storageOption ? storageOption.values : [];
                            const storage = availableStorages.length > 0 ? availableStorages[0] : '';

                            // Status Logic
                            let status = '';
                            const isAvailable = p.variants?.[0]?.availableForSale ?? false;
                            const quantity = p.variants?.[0]?.quantityAvailable || 0;

                            if (isAvailable && quantity > 0) {
                                status = 'En Stock';
                            } else if (isAvailable && quantity <= 0) {
                                status = 'Reservar';
                            } else {
                                status = '';
                            }

                            // Determine base route for link
                            let baseRoute = 'smartphones';
                            if (categoryType.includes('accesorios') || categoryType.includes('cases')) {
                                baseRoute = 'accesorios';
                            } else if (categoryType.includes('reacondicionados') || categoryType === 'reacondicionados-iphone') {
                                baseRoute = 'reacondicionados';
                            } else if (categoryType.includes('computadoras') || categoryType.includes('macbook')) {
                                baseRoute = 'computadoras';
                            } else if (categoryType.includes('tablets') || categoryType.includes('ipad')) {
                                baseRoute = 'tablets';
                            } else if (categoryType.includes('relojes') || categoryType.includes('watch')) {
                                baseRoute = 'relojes';
                            } else if (categoryType.includes('audio') || categoryType.includes('airpods') || categoryType.includes('buds')) {
                                baseRoute = 'audio';
                            }

                            return {
                                id: p.id,
                                name: p.title,
                                price: price,
                                rawPrice: priceAmount,
                                color: colors[0] || '',
                                storage: storage,
                                image: image,
                                tag: status,
                                status: status,
                                colors: colors,
                                availableStorages: availableStorages,
                                link: `/${baseRoute}/${p.handle}`
                            };
                        });

                        allProducts = [...allProducts, ...mapped];
                    }
                }));

                // 4. Actualizar estado
                if (allProducts.length > 0) {
                    let uniqueProducts = Array.from(new Map(allProducts.map(item => [item.id, item])).values());

                    // Manual Filtering (Keep existing logic)
                    if (['iphone', 'samsung', 'smartphones'].includes(categoryType)) {
                        uniqueProducts = uniqueProducts.filter(p => {
                            const lowerName = p.name.toLowerCase();
                            // Exclude non-phone items that might be in the collection
                            if (lowerName.includes('airpods') || lowerName.includes('watch') || lowerName.includes('ipad') || lowerName.includes('tablet') || lowerName.includes('buds') || lowerName.includes('macbook') || lowerName.includes('funda') || lowerName.includes('case')) {
                                return false;
                            }
                            return !lowerName.includes('semi-nuevo') && !lowerName.includes('reacondicionado') && !lowerName.includes('(semi-nuevo)');
                        });
                    }
                    if (categoryType === 'reacondicionados-iphone') {
                        uniqueProducts = uniqueProducts.filter(p => p.name.toLowerCase().includes('iphone'));
                    }

                    setProducts(uniqueProducts);
                    setAllProducts(uniqueProducts);

                    if (targetHandles.length > 1) {
                        setCollectionInfo({
                            title: categoryType.charAt(0).toUpperCase() + categoryType.slice(1),
                            description: 'Explora nuestra selección completa.'
                        });
                    } else {
                        setCollectionInfo({
                            title: foundTitle || categoryType,
                            description: foundDesc || 'Explora nuestros productos.'
                        });
                    }
                } else {
                    setProducts([]);
                    setAllProducts([]);
                    setCollectionInfo({
                        title: categoryType.charAt(0).toUpperCase() + categoryType.slice(1),
                        description: 'No se encontraron productos en esta categoría.'
                    });
                }

            } catch (error) {
                console.error("Error loading products:", error);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [categoryType]);

    // Filtering & Sorting Logic
    useEffect(() => {
        console.log('--- Filtering Debug ---');
        console.log('All Products:', allProducts.length);
        console.log('Selected Models:', selectedModels);
        console.log('Selected Colors:', selectedColors);

        let filtered = [...allProducts];

        // 1. Filter by Model
        if (selectedModels.length > 0) {
            filtered = filtered.filter(p => selectedModels.some(m => p.name.includes(m)));
        }

        // 2. Filter by Color
        if (selectedColors.length > 0) {
            filtered = filtered.filter(p => selectedColors.some(c => p.colors.includes(c)));
        }

        // 3. Sorting
        if (sortOrder === 'price-asc') {
            filtered.sort((a, b) => a.rawPrice - b.rawPrice);
        } else if (sortOrder === 'price-desc') {
            filtered.sort((a, b) => b.rawPrice - a.rawPrice);
        }
        // 'relevance' implies default order (from API)

        console.log('Filtered Products:', filtered.length);
        // Safety fallback: If no filters are active, but filtered is empty (weird edge case), restore all
        if (filtered.length === 0 && selectedModels.length === 0 && selectedColors.length === 0 && allProducts.length > 0) {
            console.warn('⚠️ Safety fallback triggered: Filters empty but no products shown. Restoring all.');
            filtered = [...allProducts];
        }

        setProducts(filtered);
    }, [selectedModels, selectedColors, allProducts, sortOrder]);


    const toggleModel = (model: string) => {
        setSelectedModels(prev =>
            prev.includes(model) ? prev.filter(m => m !== model) : [...prev, model]
        );
    };

    const toggleColor = (color: string) => {
        setSelectedColors(prev =>
            prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
        );
    };


    return (
        <div className="w-full bg-[#fafafa] min-h-screen">
            <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-6">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3 font-medium">
                            <Link to="/" className="hover:text-black transition-colors">Inicio</Link>
                            <span>/</span>
                            <span className="text-black capitalize">{collectionInfo.title}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-[#111811] mb-4 tracking-tight leading-none">
                            {collectionInfo.title}
                        </h1>
                        <p className="text-gray-500 text-lg max-w-2xl">
                            {collectionInfo.description}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">

                    {/* Sidebar Filters */}
                    <aside className={`fixed inset-y-0 left-0 bg-white z-50 w-64 transform transition-transform duration-300 lg:relative lg:translate-x-0 lg:w-64 lg:bg-transparent lg:z-0 shrink-0 space-y-8 p-6 lg:p-0 shadow-2xl lg:shadow-none overflow-y-auto ${isMobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                        <div className="flex justify-between items-baseline lg:hidden mb-6">
                            <h2 className="text-lg font-bold text-[#111811]">Filtros</h2>
                            <button onClick={() => setIsMobileFiltersOpen(false)}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="hidden lg:flex justify-between items-baseline">
                            <h2 className="text-lg font-bold text-[#111811]">Filtros</h2>
                            <button
                                onClick={() => { setSelectedModels([]); setSelectedColors([]); }}
                                className="text-sm text-gray-400 underline decoration-1 underline-offset-2 hover:text-black transition-colors"
                            >
                                Borrar Todo
                            </button>
                        </div>

                        {availableModels.length > 0 && (
                            <div>
                                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Modelo</h3>
                                <div className="space-y-3">
                                    {availableModels.map((model, idx) => (
                                        <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative flex items-center justify-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedModels.includes(model as string)}
                                                    onChange={() => toggleModel(model)}
                                                    className="peer appearance-none h-5 w-5 border border-gray-300 rounded-full checked:bg-[#a5be31] checked:border-[#a5be31] transition-colors cursor-pointer"
                                                />
                                                <span className="material-symbols-outlined text-white text-[14px] absolute opacity-0 peer-checked:opacity-100 pointer-events-none font-bold">check</span>
                                            </div>
                                            <span className="text-gray-600 text-sm font-medium group-hover:text-black transition-colors flex-1 capitalize">{model}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {availableColors.length > 0 && categoryType !== 'accesorios' && (
                            <div>
                                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Color</h3>
                                <div className="flex flex-wrap gap-3">
                                    {availableColors.map((color, idx) => {
                                        const hex = getColorHex(color as string);
                                        const isSelected = selectedColors.includes(color as string);
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => toggleColor(color as string)}
                                                className={`w-8 h-8 rounded-full border shadow-sm transition-all duration-200 flex items-center justify-center relative group ${isSelected ? 'ring-2 ring-offset-2 ring-[#111811] scale-110' : 'border-gray-200 hover:border-gray-400'}`}
                                                style={{ backgroundColor: hex }}
                                                title={color as string}
                                            >
                                                {/* Tooltip on hover */}
                                                <span className="absolute bottom-full mb-2 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity z-10 font-bold">
                                                    {color}
                                                </span>
                                                {/* Checkmark for lighter colors or selected state clarity */}
                                                {isSelected && (
                                                    <span className={`material-symbols-outlined text-[14px] font-bold ${['#F2F1EC', '#e3e4e5', '#faf7f2', '#fdf6dd', '#eaf6ed', '#ffffff'].includes(hex) ? 'text-black' : 'text-white'}`}>check</span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </aside>

                    {/* Overlay for mobile filter */}
                    {isMobileFiltersOpen && (
                        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileFiltersOpen(false)}></div>
                    )}


                    {/* Grid */}
                    <main className="flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <span className="font-bold text-[#111811] hidden md:inline-block">{products.length} productos</span>

                            <button
                                onClick={() => setIsMobileFiltersOpen(true)}
                                className="lg:hidden flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm font-bold text-sm"
                            >
                                <span className="material-symbols-outlined text-[20px]">tune</span> Filtros
                            </button>

                            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm ml-auto md:ml-0">
                                <span className="text-gray-500 text-sm font-medium hidden md:inline">Ordenar por:</span>
                                <select
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                    className="border-none bg-transparent font-bold text-[#111811] text-sm focus:ring-0 p-0 cursor-pointer pr-8"
                                >
                                    <option value="relevance">Relevancia</option>
                                    <option value="price-asc">Precio: Menor a Mayor</option>
                                    <option value="price-desc">Precio: Mayor a Menor</option>
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} className="h-[400px] bg-gray-100 rounded-2xl animate-pulse"></div>
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
                                {products.map((product) => (
                                    <div key={product.id} className="bg-white rounded-2xl p-3 relative hover:shadow-lg transition-all duration-300 group border border-gray-100 flex flex-col">
                                        {/* Badges */}
                                        <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1">
                                            {product.tag && (
                                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border ${product.tag === 'Agotado' ? 'bg-gray-100 text-gray-500 border-gray-200' : 'bg-[#fef08a] text-yellow-800 border-yellow-100'}`}>
                                                    {product.tag}
                                                </span>
                                            )}
                                        </div>

                                        {/* Image */}
                                        <Link to={product.link} className="aspect-[4/5] w-full flex items-center justify-center mb-3 bg-[#f8fafc] rounded-xl relative overflow-hidden mt-2">
                                            {product.image ? (
                                                <img src={product.image} alt={product.name} className="h-[85%] w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105" />
                                            ) : (
                                                <div className="text-gray-300 flex flex-col items-center">
                                                    <span className="material-symbols-outlined text-4xl">image_not_supported</span>
                                                </div>
                                            )}
                                        </Link>

                                        {/* Info */}
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-sm font-bold text-[#111811] leading-tight group-hover:text-[#a5be31] transition-colors line-clamp-2">
                                                {product.name}
                                            </h3>
                                        </div>

                                        <div className="flex gap-1 mb-4 flex-wrap">
                                            {product.storage && (
                                                <span className="text-[10px] text-gray-400 font-medium py-0.5 bg-gray-50 px-1.5 rounded border border-gray-100">
                                                    {product.storage}
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-auto flex items-end justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-lg font-black text-[#111811] tracking-tight">{product.price}</span>
                                            </div>
                                            <Link to={product.link} className="h-8 w-8 bg-[#111811] rounded-full flex items-center justify-center text-white hover:bg-[#a5be31] hover:text-[#111811] transition-all shadow-md group-hover:scale-110">
                                                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center">
                                <span className="material-symbols-outlined text-6xl text-gray-200 mb-4">search_off</span>
                                <h3 className="text-xl font-bold text-gray-400">No se encontraron productos</h3>
                                <p className="text-gray-400">Intenta ajustar los filtros o vuelve más tarde.</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default CategoryListing;
