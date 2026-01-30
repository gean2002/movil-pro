import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import TrustBadges from '../components/TrustBadges';
import { fetchCollectionWithProducts, fetchAllCollections } from '../lib/shopify';

interface Product {
    id: string; // Added ID for keying
    name: string;
    price: string;
    color: string;
    storage: string;
    image: string;
    tag: string;
    status: string;
    colors: string[];
    availableStorages: string[];
    link: string;
}

interface CategoryData {
    title: string;
    subtitle: string;
    badge: string;
    products: Product[];
}

const CategoryListing: React.FC<{ categoryType: string }> = ({ categoryType }) => {
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [selectedModels, setSelectedModels] = useState<string[]>([]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [availableHandles, setAvailableHandles] = useState<string[]>([]);
    const [collectionInfo, setCollectionInfo] = useState({
        title: 'Productos',
        description: 'Explora nuestra selección premium.'
    });

    // Reset filters when category changes
    useEffect(() => {
        setSelectedModels([]);
        setSelectedColors([]);
        setIsMobileFiltersOpen(false);
    }, [categoryType]);

    // Mapping: Route Parameter -> Shopify Collection Handles
    // Mapeamos las rutas de la URL a las colecciones REALES que tienes en Shopify.
    // Para categorías generales (Smartphones), combinamos varias colecciones (iPhone + Samsung).
    const categoryMapping: Record<string, string[]> = {
        // Categorías Generales (Agrupan varias)
        'smartphones': ['iphone', 'samsung'],
        'computadoras': ['macbook-air', 'macbook-pro'],
        'tablets': ['ipad', 'samsung'], // Asumiendo que Samsung también hace tablets o solo iPad
        'relojes': ['apple-watch', 'galaxy-watch'],
        'audio': ['airpods', 'samsung-buds'],
        'promociones': ['promociones'], // Si existe
        'reacondicionados': ['reacondicionados'], // Si existe

        // Subcategorías Específicas (Mapeo directo 1 a 1)
        'iphone': ['iphone'],
        'samsung': ['samsung'],
        'ipad': ['ipad'],
        'macbook-air': ['macbook-air'],
        'macbook-pro': ['macbook-pro'],
        'apple-watch': ['apple-watch'],
        'galaxy-watch': ['galaxy-watch'],
        'airpods': ['airpods'],
        'samsung-buds': ['samsung-buds'],
    };

    // Fetch products from Shopify
    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            setProducts([]);

            // 1. Obtener los "handles" correspondientes a esta categoría
            // Si no hay mapeo, intentamos usar el nombre tal cual (fallback)
            const targetHandles = categoryMapping[categoryType] || [categoryType];

            console.log(`Cargando ruta: ${categoryType} -> Buscando colecciones: ${targetHandles.join(', ')}`);

            try {
                // 2. Buscar TODAS las colecciones necesarias en paralelo
                const promises = targetHandles.map(handle => fetchCollectionWithProducts(handle));
                const results = await Promise.all(promises);

                // 3. Procesar resultados
                let allProducts: Product[] = [];
                let foundTitle = '';
                let foundDesc = '';

                results.forEach(collection => {
                    if (collection) {
                        // Usamos el título/descripción de la primera colección encontrada como base
                        if (!foundTitle) {
                            foundTitle = collection.title;
                            foundDesc = collection.description;
                        }

                        // Mapear productos
                        const mapped: Product[] = collection.products.map((p: any) => {
                            const price = p.variants?.[0]?.price?.amount
                                ? `S/ ${parseFloat(p.variants[0].price.amount).toLocaleString('es-PE', { minimumFractionDigits: 0 })}`
                                : 'Consultar';

                            const image = p.images?.[0]?.src || '';

                            console.log('Product Options:', p.title, p.options); // Debugging
                            const colorOption = p.options?.find((o: any) =>
                                o.name.toLowerCase() === 'color' ||
                                o.name.toLowerCase() === 'colour'
                            );
                            const storageOption = p.options?.find((o: any) =>
                                o.name.toLowerCase() === 'storage' ||
                                o.name.toLowerCase() === 'almacenamiento' ||
                                o.name.toLowerCase() === 'capacidad' ||
                                o.name.toLowerCase() === 'capacity' ||
                                o.name.toLowerCase() === 'memoria' ||
                                o.name.toLowerCase() === 'internal memory'
                            );

                            const colors = colorOption ? colorOption.values.map((v: any) => v.value) : [];
                            const availableStorages = storageOption ? storageOption.values.map((v: any) => v.value) : [];
                            const storage = storageOption ? storageOption.values[0].value : '';

                            // Determine status tag
                            let status = 'Agotado'; // Default fallback
                            const isAvailable = p.variants?.[0]?.availableForSale ?? false;
                            const quantity = p.variants?.[0]?.quantityAvailable || 0;

                            console.log(`Debug ${p.title}: Available=${isAvailable}, Qty=${quantity}, Var0ID=${p.variants?.[0]?.id}`);

                            if (isAvailable && quantity > 0) {
                                status = 'En Stock';
                            } else if (isAvailable && quantity <= 0) {
                                status = 'Reservar';
                            } else {
                                status = ''; // Hide 'Agotado' label as requested
                            }

                            return {
                                id: p.id,
                                name: p.title,
                                price: price,
                                color: colors[0] || '',
                                storage: storage,
                                image: image,
                                tag: status,
                                status: status,
                                colors: colors,
                                availableStorages: availableStorages,
                                link: `/smartphones/${p.handle}` // Ajustar link dinámicamente si es necesario
                            };
                        });

                        allProducts = [...allProducts, ...mapped];
                    }
                });

                // 4. Actualizar estado
                if (allProducts.length > 0) {
                    // Eliminar duplicados si los hubiera (por si un producto está en varías colecciones)
                    const uniqueProducts = Array.from(new Map(allProducts.map(item => [item.id, item])).values());

                    setProducts(uniqueProducts);

                    // Si es una categoría combinada (ej. Smartphones), ponemos un título genérico si queremos,
                    // o dejamos el de la primera colección encontrada.
                    // Para combinadas, mejor forzamos un título bonito basado en la URL.
                    if (targetHandles.length > 1) {
                        setCollectionInfo({
                            title: categoryType.charAt(0).toUpperCase() + categoryType.slice(1),
                            description: 'Explora nuestra selección completa.'
                        });
                    } else if (foundTitle) {
                        setCollectionInfo({
                            title: foundTitle,
                            description: foundDesc || 'Explora nuestra selección premium.'
                        });
                    }
                } else {
                    setCollectionInfo({
                        title: categoryType.charAt(0).toUpperCase() + categoryType.slice(1),
                        description: 'No se encontraron productos en estas colecciones.'
                    });
                }

            } catch (err) {
                console.error("Error cargando productos", err);
            }

            setLoading(false);
        };

        loadProducts();
    }, [categoryType]);


    // --- Dynamic Filter Logic ---

    // Extract Unique Models
    const availableModels = useMemo(() => {
        const models = new Set<string>();
        products.forEach(p => {
            // Updated keywords to be broader or dynamic if possible, keeping manual list for now
            const keywords = ['Pro', 'Air', 'Ultra', 'Mini', 'Max', 'Plus', 'Standard', 'Galaxy', 'Watch', 'iPhone', 'iPad', 'MacBook'];
            keywords.forEach(k => {
                if (p.name.includes(k)) models.add(k);
            });
        });
        return Array.from(models).sort();
    }, [products]);

    // Extract Unique Colors
    const availableColors = useMemo(() => {
        const colors = new Set<string>();
        products.forEach(p => {
            if (p.colors) p.colors.forEach(c => colors.add(c));
        });
        return Array.from(colors);
    }, [products]);


    // Filter Products
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesModel = selectedModels.length === 0 || selectedModels.some(m => product.name.includes(m));
            const matchesColor = selectedColors.length === 0 || (product.colors && product.colors.some(c => selectedColors.includes(c)));
            return matchesModel && matchesColor;
        });
    }, [products, selectedModels, selectedColors]);


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

    const clearFilters = () => {
        setSelectedModels([]);
        setSelectedColors([]);
    };

    const FiltersContent = () => (
        <>
            <div className="flex justify-between items-baseline md:hidden mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-xl font-bold text-[#111811]">Filtrar por</h2>
                <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 rounded-full hover:bg-gray-100">
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>

            <div className="flex justify-between items-baseline hidden md:flex">
                <h2 className="text-lg font-bold text-[#111811]">Filtros</h2>
                <button onClick={clearFilters} className="text-sm text-gray-400 underline decoration-1 underline-offset-2 hover:text-black transition-colors">
                    Borrar Todo
                </button>
            </div>

            {/* Model Filter */}
            {availableModels.length > 0 && (
                <div className="space-y-4 mt-6">
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Modelo / Familia</h3>
                    <div className="space-y-3">
                        {availableModels.map((model) => (
                            <label key={model} className="flex items-center gap-3 cursor-pointer group py-1 md:py-0">
                                <div className="relative flex items-center justify-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedModels.includes(model)}
                                        onChange={() => toggleModel(model)}
                                        className="peer appearance-none h-5 w-5 border border-gray-300 rounded-full checked:bg-[#a5be31] checked:border-[#a5be31] transition-colors cursor-pointer"
                                    />
                                    <span className="material-symbols-outlined text-white text-[14px] absolute opacity-0 peer-checked:opacity-100 pointer-events-none font-bold">check</span>
                                </div>
                                <span className="text-gray-600 text-sm font-medium group-hover:text-black transition-colors flex-1">{model}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Color Filter */}
            {availableColors.length > 0 && (
                <div className="space-y-4 mt-8">
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Acabado</h3>
                    <div className="flex flex-wrap gap-3">
                        {availableColors.map((color) => (
                            <button
                                key={color}
                                onClick={() => toggleColor(color)}
                                className={`w-8 h-8 rounded-full border shadow-sm transition-all hover:scale-110 ${selectedColors.includes(color) ? 'ring-2 ring-offset-2 ring-[#a5be31]' : 'border-gray-200'}`}
                                style={{ backgroundColor: color }}
                                title={color}
                            />
                        ))}
                    </div>
                </div>
            )}

            <button onClick={() => setIsMobileFiltersOpen(false)} className="w-full bg-black text-white font-bold py-4 rounded-xl mt-8 md:hidden">
                Ver {filteredProducts.length} Productos
            </button>
        </>
    );

    return (
        <div className="w-full bg-[#fafafa] min-h-screen">
            <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-4 md:py-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4 md:mb-6">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3 font-medium">
                            <Link to="/" className="hover:text-black transition-colors">Inicio</Link>
                            <span>/</span>
                            <span className="text-black capitalize">{categoryType}</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-[#111811] mb-2 md:mb-4 tracking-tight leading-none">
                            {collectionInfo.title}
                        </h1>
                        <p className="text-gray-500 text-sm md:text-lg max-w-2xl">
                            {collectionInfo.description}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 bg-[#f0f9ff] text-[#0369a1] px-4 py-2 md:px-5 md:py-2.5 rounded-full font-bold text-xs md:text-sm shadow-sm border border-[#e0f2fe] shrink-0 self-start md:self-auto">
                        <span className="material-symbols-outlined text-[18px] md:text-[20px] filled">verified</span>
                        Garantía Movil Pro
                    </div>
                </div>

                <TrustBadges />

                <div className="flex flex-col lg:flex-row gap-6">

                    {/* Mobile Filter Trigger */}
                    <div className="lg:hidden flex gap-3 mb-4 sticky top-[60px] z-20">
                        <button
                            onClick={() => setIsMobileFiltersOpen(true)}
                            className="flex-1 bg-white border border-gray-200 text-[#111811] font-bold py-3 px-4 rounded-xl shadow-sm flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined">tune</span> Filtros
                        </button>
                        <button className="bg-white border border-gray-200 text-[#111811] font-bold py-3 px-4 rounded-xl shadow-sm">
                            <span className="material-symbols-outlined">sort</span>
                        </button>
                    </div>

                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block w-64 shrink-0 space-y-8 sticky top-24 h-fit">
                        <FiltersContent />
                    </aside>

                    {/* Mobile Filters Modal */}
                    {isMobileFiltersOpen && (
                        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden flex justify-end">
                            <div className="bg-white w-full max-w-[320px] h-full p-6 overflow-y-auto animate-[slideLeft_0.3s_ease-out]">
                                <FiltersContent />
                            </div>
                        </div>
                    )}

                    {/* Grid */}
                    <main className="flex-1">
                        {loading ? (
                            <div className="py-20 text-center">
                                <p className="text-gray-500 font-medium text-lg">Cargando productos...</p>
                            </div>
                        ) : (
                            <>
                                <div className="hidden md:flex justify-between items-center mb-6">
                                    <span className="font-bold text-[#111811]">{filteredProducts.length} productos encontrados</span>
                                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                                        <span className="text-gray-500 text-sm font-medium">Ordenar por:</span>
                                        <select className="border-none bg-transparent font-bold text-[#111811] text-sm focus:ring-0 p-0 cursor-pointer">
                                            <option>Destacados</option>
                                            <option>Precio: Menor a Mayor</option>
                                            <option>Precio: Mayor a Menor</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 mb-12">
                                    {filteredProducts.length > 0 ? (
                                        filteredProducts.map((product) => (
                                            <div key={product.id} className="bg-white rounded-xl md:rounded-2xl p-3 relative hover:shadow-lg transition-all duration-300 group border border-gray-100 flex flex-col">
                                                {/* Badges */}
                                                <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1">
                                                    {product.tag && product.tag !== 'Reservar' && (
                                                        <span className={`text-[8px] md:text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border ${product.tag === 'Oferta' || product.tag === 'Chollo' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-[#e0f2fe] text-[#0369a1] border-[#bae6fd]'}`}>
                                                            {product.tag}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Image */}
                                                <Link to={product.link} className="aspect-[4/5] w-full flex items-center justify-center mb-3 bg-[#f8fafc] rounded-xl relative overflow-hidden mt-2">
                                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,white,transparent)] opacity-60"></div>
                                                    <img src={product.image} alt={product.name} className="h-[80%] md:h-[85%] w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105" />
                                                </Link>

                                                {/* Info */}
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="text-xs md:text-sm font-bold text-[#111811] leading-tight group-hover:text-[#a5be31] transition-colors line-clamp-2">
                                                        {product.name}
                                                    </h3>
                                                    <div className="flex -space-x-1 shrink-0 pl-1">
                                                        {product.colors && product.colors.map((c, i) => (
                                                            <div key={i} className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full border border-white shadow-sm" style={{ backgroundColor: c }}></div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex gap-1 mb-2 md:mb-4 flex-wrap">
                                                    {product.availableStorages && product.availableStorages.map((storage) => (
                                                        <span key={storage} className="text-[9px] md:text-[10px] text-gray-400 font-medium py-0.5 bg-gray-50 px-1.5 rounded border border-gray-100 uppercase">
                                                            {storage}
                                                        </span>
                                                    ))}
                                                </div>

                                                <div className="mt-auto flex items-end justify-between">
                                                    <div className="flex flex-col">
                                                        <span className="text-base md:text-lg font-black text-[#111811] tracking-tight">{product.price}</span>
                                                    </div>
                                                    <Link to={product.link} className="h-7 w-7 md:h-8 md:w-8 bg-[#111811] rounded-full flex items-center justify-center text-white hover:bg-[#a5be31] hover:text-[#111811] transition-all shadow-md active:scale-95">
                                                        <span className="material-symbols-outlined text-[14px] md:text-[16px]">shopping_cart</span>
                                                    </Link>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full py-20 text-center">
                                            <p className="text-gray-500 font-medium text-lg text-balance mb-6 max-w-lg mx-auto">
                                                {collectionInfo.description === 'Explora nuestra selección premium.'
                                                    ? 'No se encontraron productos en esta colección.'
                                                    : collectionInfo.description}
                                            </p>

                                            {/* Fallback actions if empty */}
                                            <div className="flex flex-col gap-4 items-center">
                                                <button onClick={clearFilters} className="text-[#a5be31] font-bold">
                                                    Limpiar filtros
                                                </button>

                                                <Link to="/" className="text-sm text-gray-400 underline decoration-1 underline-offset-2 hover:text-black">
                                                    Volver al Inicio
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {filteredProducts.length > 0 && (
                                    <div className="flex justify-center">
                                        <button className="w-full md:w-auto bg-white border border-gray-200 text-[#111811] font-bold py-3 px-8 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2 text-sm shadow-sm">
                                            Cargar Más Productos
                                            <span className="material-symbols-outlined text-[16px]">expand_more</span>
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>
            <style>{`
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
        </div>
    );
};

export default CategoryListing;
