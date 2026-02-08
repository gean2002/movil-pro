import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { fetchProductByHandle, fetchCollectionWithProducts, searchProducts } from '../lib/shopify';

interface ProductData {
    id: string;
    name: string;
    description: string;
    price: string;
    images: { src: string; altText: string }[];
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
    },
    'accesorios': {
        specs: [
            { label: 'Compatibilidad', value: 'Dispositivos Apple', icon: 'devices' },
            { label: 'Material', value: 'Premium', icon: 'diamond' },
            { label: 'Garantía', value: '1 Año Movil Pro', icon: 'verified_user' },
            { label: 'Condición', value: 'Nuevo Sellado', icon: 'new_releases' }
        ],
        boxContent: [
            { name: 'Producto', image: 'category' }
        ]
    },
    'airpods-pro': {
        specs: [
            { label: 'Chip', value: 'Apple H2 (Auriculares) / U1 (Estuche)', icon: 'memory' },
            { label: 'Audio', value: 'Audio Espacial Personalizado', icon: 'graphic_eq' },
            { label: 'Cancelación', value: 'Cancelación Activa de Ruido 2x', icon: 'noise_control_off' },
            { label: 'Batería', value: 'Hasta 6h (30h con estuche)', icon: 'battery_full' },
            { label: 'Resistencia', value: 'IP54 (Polvo, sudor y agua)', icon: 'water_drop' },
            { label: 'Carga', value: 'MagSafe, USB-C, Apple Watch', icon: 'bolt' }
        ],
        boxContent: [
            { name: 'AirPods Pro 2', image: 'headphones' },
            { name: 'Estuche MagSafe (USB-C)', image: 'battery_charging_full' },
            { name: 'Almohadillas (XS, S, M, L)', image: 'check_circle' },
            { name: 'Cable USB-C', image: 'cable' }
        ]
    },
    'airpods-3': {
        specs: [
            { label: 'Chip', value: 'Apple H1', icon: 'memory' },
            { label: 'Audio', value: 'Audio Espacial con seguimiento dinámico', icon: 'graphic_eq' },
            { label: 'Sensores', value: 'Detección de piel, Acelerómetro', icon: 'sensors' },
            { label: 'Batería', value: 'Hasta 6h (30h con estuche)', icon: 'battery_full' },
            { label: 'Resistencia', value: 'IPX4 (Sudor y agua)', icon: 'water_drop' },
            { label: 'Carga', value: 'MagSafe, Lightning', icon: 'bolt' }
        ],
        boxContent: [
            { name: 'AirPods 3', image: 'headphones' },
            { name: 'Estuche de Carga MagSafe', image: 'battery_charging_full' },
            { name: 'Cable Lightning a USB-C', image: 'cable' }
        ]
    },
    'airpods-2': {
        specs: [
            { label: 'Chip', value: 'Apple H1', icon: 'memory' },
            { label: 'Audio', value: 'Audio AAC de alta calidad', icon: 'music_note' },
            { label: 'Sensores', value: 'Ópticos duales, Acelerómetro', icon: 'sensors' },
            { label: 'Batería', value: 'Hasta 5h (24h con estuche)', icon: 'battery_full' },
            { label: 'Conectividad', value: 'Bluetooth 5.0', icon: 'bluetooth' },
            { label: 'Carga', value: 'Lightning', icon: 'bolt' }
        ],
        boxContent: [
            { name: 'AirPods 2', image: 'headphones' },
            { name: 'Estuche de Carga', image: 'battery_charging_full' },
            { name: 'Cable Lightning a USB-A', image: 'cable' }
        ]
    },
    'airpods-max': {
        specs: [
            { label: 'Chip', value: 'Apple H1 (en cada auricular)', icon: 'memory' },
            { label: 'Audio', value: 'Audio Computacional, Audio Espacial', icon: 'graphic_eq' },
            { label: 'Cancelación', value: 'Cancelación Activa de Ruido líder', icon: 'noise_control_off' },
            { label: 'Batería', value: 'Hasta 20h de reproducción', icon: 'battery_full' },
            { label: 'Materiales', value: 'Acero inoxidable, Malla tejida', icon: 'diamond' },
            { label: 'Controles', value: 'Digital Crown', icon: 'touch_app' }
        ],
        boxContent: [
            { name: 'AirPods Max', image: 'headphones' },
            { name: 'Smart Case', image: 'cases' },
            { name: 'Cable Lightning a USB-C', image: 'cable' }
        ]
    },
    'galaxy-buds': {
        specs: [
            { label: 'Audio', value: 'Sonido Hi-Fi de 24 bits (Samsung Seamless)', icon: 'graphic_eq' },
            { label: 'Cancelación', value: 'ANC Inteligente', icon: 'noise_control_off' },
            { label: 'Micrófonos', value: '3 Micrófonos de alta relación señal/ruido', icon: 'mic' },
            { label: 'Batería', value: 'Hasta 5h (18h con estuche) con ANC', icon: 'battery_full' },
            { label: 'Resistencia', value: 'IPX7 (Resistente al agua)', icon: 'water_drop' },
            { label: 'Conectividad', value: 'Bluetooth 5.3', icon: 'bluetooth' }
        ],
        boxContent: [
            { name: 'Galaxy Buds', image: 'headphones' },
            { name: 'Estuche de Carga', image: 'battery_charging_full' },
            { name: 'Cable de Carga', image: 'cable' },
            { name: 'Almohadillas', image: 'check_circle' }
        ]
    },
    'audio': {
        specs: [
            { label: 'Audio', value: 'Alta Fidelidad (Spatial Audio)', icon: 'graphic_eq' },
            { label: 'Cancelación', value: 'Aislamiento de Ruido', icon: 'noise_control_off' },
            { label: 'Batería', value: 'Estuche de Carga MagSafe', icon: 'battery_charging_full' },
            { label: 'Resistencia', value: 'Resistente al agua (IPX4)', icon: 'water_drop' }
        ],
        boxContent: [
            { name: 'Auriculares', image: 'headphones' },
            { name: 'Estuche de Carga', image: 'battery_charging_full' },
            { name: 'Cable de Carga', image: 'cable' }
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
    const [accessories, setAccessories] = useState<any[]>([]);

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
            (!selectedStorage || v.selectedOptions.some((o: any) => isDeviceOption(o.name) && o.value === selectedStorage))
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
                else if (isDeviceOption(name)) setSelectedStorage(val);
                else if (['Memory', 'RAM'].includes(name)) setSelectedRam(val);
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

                    if (titleLower.includes('funda') || titleLower.includes('case') || titleLower.includes('cargador') || titleLower.includes('protector') || titleLower.includes('mica') || rootCategory === 'accesorios') {
                        enrichmentKey = 'accesorios';
                    }
                    else if (titleLower.includes('airpods max')) enrichmentKey = 'airpods-max';
                    else if (titleLower.includes('airpods pro')) enrichmentKey = 'airpods-pro';
                    else if (titleLower.includes('airpods 4')) enrichmentKey = 'airpods-4';
                    else if (titleLower.includes('airpods 3') || titleLower.includes('3ra generación') || titleLower.includes('3rd generation')) enrichmentKey = 'airpods-3';
                    else if (titleLower.includes('airpods 2') || titleLower.includes('2da generación') || titleLower.includes('2nd generation')) enrichmentKey = 'airpods-2';
                    else if (titleLower.includes('galaxy buds') || titleLower.includes('buds')) enrichmentKey = 'galaxy-buds';
                    else if (titleLower.includes('airpods') || titleLower.includes('auriculares') || rootCategory === 'audio') enrichmentKey = 'audio';
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
                        images: shopifyProduct.images.map((img: any) => ({ src: img.src, altText: img.altText })),
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
                        // Helper for definition is defined below render, but function hoisting might not work if const...
                        // Need to duplicate logic or define cleaner. 
                        // For now we use the exhaustive list inline or access defined helper if possible.
                        // Actually, 'isDeviceOption' is defined in RENDER scope, so it is NOT available here (in useEffect).
                        // WE MUST DUPLICATE THE LIST HERE or move helper out.
                        const deviceKeywords = ['storage', 'capacity', 'almacenamiento', 'capacidad', 'size', 'tamaño', 'modelo', 'dispositivo', 'model', 'device', 'compatibilidad', 'compatible', 'compatibility', 'dispositivo compatible', 'dispositivos disponibles'];

                        const defaultStorage = mappedProduct.options.find(o => deviceKeywords.includes(o.name.toLowerCase()))?.values[0];
                        const defaultRam = mappedProduct.options.find(o => ['Memory', 'RAM'].includes(o.name))?.values[0];

                        if (defaultColor) setSelectedColor(defaultColor);
                        if (defaultStorage) setSelectedStorage(defaultStorage);
                        if (defaultRam) setSelectedRam(defaultRam);

                        // Populate defaults for other options (like Memoria)
                        const otherDefaults: Record<string, string> = {};
                        mappedProduct.options.forEach(o => {
                            if (!['Color', 'Colour', 'Memory', 'RAM'].includes(o.name) && !deviceKeywords.includes(o.name.toLowerCase())) {
                                otherDefaults[o.name] = o.values[0];
                            }
                        });
                        setSelectedOtherOptions(otherDefaults);

                        // Find initial variant using these defaults
                        const variant = mappedProduct.variants.find((v: any) => {
                            const isColorMatch = !defaultColor || v.selectedOptions.some((o: any) => ['Color', 'Colour'].includes(o.name) && o.value === defaultColor);
                            const isStorageMatch = !defaultStorage || v.selectedOptions.some((o: any) => deviceKeywords.includes(o.name.toLowerCase()) && o.value === defaultStorage);
                            const isRamMatch = !defaultRam || v.selectedOptions.some((o: any) => ['Memory', 'RAM'].includes(o.name) && o.value === defaultRam);
                            // Also check other defaults
                            const isOtherMatch = Object.entries(otherDefaults).every(([k, val]) =>
                                v.selectedOptions.some((o: any) => o.name === k && o.value === val)
                            );

                            return isColorMatch && isStorageMatch && isRamMatch && isOtherMatch;
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

    useEffect(() => {
        const fetchAccessories = async () => {
            try {
                // 1. Try fetching specific accessory collections
                let accs: any[] = [];
                const collectionData = await fetchCollectionWithProducts('accesorios') || await fetchCollectionWithProducts('accessories');

                if (collectionData && collectionData.products && collectionData.products.length > 0) {
                    accs = collectionData.products;
                } else {
                    // 2. Fallback: Search for common accessories and mix with others
                    console.log('Collection not found, trying search fallback...');
                    const airpods = await searchProducts('airpods');
                    const phones = await searchProducts('iphone');
                    const cases = await searchProducts('funda');
                    const chargers = await searchProducts('cargador');

                    // Combine and deduplicate
                    const combined = [...airpods, ...phones, ...cases, ...chargers];
                    const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());

                    // Map to component format
                    accs = unique.map((item: any) => ({
                        handle: item.link.split('/').pop(),
                        title: item.name,
                        images: [{ src: item.image }],
                        variants: [{ price: { amount: item.price.replace(/[^0-9.]/g, '') } }]
                    }));
                }

                setAccessories(accs);
            } catch (err) {
                console.error("Error loading accessories:", err);
            }
        };
        fetchAccessories();
    }, []);

    // Update selected variant when options change
    // Update selected variant when options change
    useEffect(() => {
        if (product) {
            console.log('Searching variant for:', { selectedColor, selectedStorage, selectedRam, selectedOtherOptions });

            const variant = product.variants.find((v: any) => {
                const isColorMatch = !selectedColor || v.selectedOptions.some((o: any) => ['Color', 'Colour'].includes(o.name) && o.value === selectedColor);
                // Duplicate keywords check because isDeviceOption is not available here
                const deviceKeywords = ['storage', 'capacity', 'almacenamiento', 'capacidad', 'size', 'tamaño', 'modelo', 'dispositivo', 'model', 'device', 'compatibilidad', 'compatible', 'compatibility', 'dispositivo compatible', 'dispositivos disponibles'];
                const isStorageMatch = !selectedStorage || v.selectedOptions.some((o: any) => deviceKeywords.includes(o.name.toLowerCase()) && o.value === selectedStorage);

                const isRamMatch = !selectedRam || v.selectedOptions.some((o: any) => ['Memory', 'RAM'].includes(o.name) && o.value === selectedRam);

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
            image: selectedVariant.image?.src || product.images.find(img => img.altText?.toLowerCase().includes(selectedColor.toLowerCase()))?.src || product.images[0].src,
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
            // Spanish & Common
            'Titanio Natural': '#8E8D8A', 'Natural': '#8E8D8A',
            'Titanio Azul': '#1F2C45', 'Azul': '#1F2C45',
            'Titanio Blanco': '#F2F1EC', 'Blanco': '#F2F1EC', 'Plata': '#e3e4e5',
            'Titanio Negro': '#1C1C1E', 'Negro': '#1C1C1E', 'Gris Espacial': '#4a4a4a',
            'Rosa': '#fae1dc', 'Pink': '#fae1dc', 'Rosado': '#fae1dc',
            'Medianoche': '#191f26', 'Midnight': '#191f26', 'Estrella': '#faf7f2', 'Grafito': '#41424C',
            'Oro': '#F9E5C9', 'Dorado': '#F9E5C9', 'Sierra Azul': '#9BB5CE', 'Verde Alpino': '#505E4E',
            'Morado Oscuro': '#483C4E', 'Negro Espacial': '#1D1D1F',
            'Morado': '#483C4E',
            'Titanio Desierto': '#C5B499', 'Desierto': '#C5B499', 'Desert': '#C5B499', 'Deret': '#C5B499',
            'Naranja': '#ff9f0a', 'Coral': '#ff7f50',
            'Violeta': '#E6E6FA', 'Purple': '#E6E6FA',
            'Amarillo': '#fdf6dd', 'Verde': '#eaf6ed', 'Rojo': '#E21A2C', '(Product)Red': '#E21A2C',
            'Fucsia': '#FF00FF', 'Lila': '#C8A2C8', 'Lavanda': '#E6E6FA', 'Menta': '#98FF98', 'Turquesa': '#40E0D0', 'Celeste': '#B2FFFF', 'Beige': '#F5F5DC', 'Marron': '#800000', 'Cafe': '#800000', 'Gris': '#808080', 'Transparente': '#f5f5f5', 'Clear': '#f5f5f5', 'Cristal': '#f5f5f5',
            'White': '#F2F1EC', 'Black': '#1C1C1E', 'Blue': '#1F2C45', 'Green': '#eaf6ed', 'Yellow': '#fdf6dd', 'Red': '#E21A2C', 'Orange': '#ff9f0a', 'Brown': '#800000', 'Grey': '#808080', 'Gray': '#808080',

            // English (Remaining uniques)
            'Natural Titanium': '#8E8D8A', 'Blue Titanium': '#1F2C45',
            'White Titanium': '#F2F1EC', 'Black Titanium': '#1C1C1E',
            'Desert Titanium': '#C5B499',
            'Silver': '#e3e4e5', 'Space Gray': '#4a4a4a', 'Space Grey': '#4a4a4a',
            'Starlight': '#faf7f2',
            'Graphite': '#41424C', 'Sierra Blue': '#9BB5CE',
            'Alpine Green': '#505E4E', 'Deep Purple': '#483C4E', 'Space Black': '#1D1D1F'
        };

        const normalizedInput = colorName.trim().toLowerCase();

        // 1. Exact Match
        const foundKey = Object.keys(map).find(key => key.toLowerCase() === normalizedInput);
        if (foundKey) return map[foundKey];

        // 2. Fuzzy Match (Substring)
        if (normalizedInput.includes('titanio natural') || normalizedInput.includes('natural')) return '#8E8D8A';
        if (normalizedInput.includes('titanium')) return '#8E8D8A'; // Fallback for generic titanium

        if (normalizedInput.includes('azul') || normalizedInput.includes('blue') || normalizedInput.includes('navy') || normalizedInput.includes('marino') || normalizedInput.includes('cyan') || normalizedInput.includes('celeste') || normalizedInput.includes('turquesa')) return '#1F2C45'; // Generic Blue
        if (normalizedInput.includes('verde') || normalizedInput.includes('green') || normalizedInput.includes('menta') || normalizedInput.includes('oliva') || normalizedInput.includes('alpino')) return '#505E4E'; // Generic Green
        if (normalizedInput.includes('rojo') || normalizedInput.includes('red') || normalizedInput.includes('vino') || normalizedInput.includes('guinda')) return '#E21A2C';
        if (normalizedInput.includes('rosa') || normalizedInput.includes('pink') || normalizedInput.includes('fucsia') || normalizedInput.includes('rose') || normalizedInput.includes('gold')) return '#fae1dc'; // Rose/Gold often similar or generic
        if (normalizedInput.includes('amarillo') || normalizedInput.includes('yellow')) return '#fdf6dd';
        if (normalizedInput.includes('naranja') || normalizedInput.includes('orange') || normalizedInput.includes('coral')) return '#ff9f0a';
        if (normalizedInput.includes('morado') || normalizedInput.includes('purple') || normalizedInput.includes('lila') || normalizedInput.includes('violeta') || normalizedInput.includes('lavanda')) return '#483C4E';

        if (normalizedInput.includes('medianoche') || normalizedInput.includes('midnight') || normalizedInput.includes('negro') || normalizedInput.includes('black') || normalizedInput.includes('oscuro')) return '#1C1C1E';
        if (normalizedInput.includes('blanco') || normalizedInput.includes('white') || normalizedInput.includes('estrella') || normalizedInput.includes('starlight') || normalizedInput.includes('claro') || normalizedInput.includes('nieve')) return '#F2F1EC';
        if (normalizedInput.includes('plata') || normalizedInput.includes('silver') || normalizedInput.includes('gris') || normalizedInput.includes('gray') || normalizedInput.includes('grey') || normalizedInput.includes('grafito') || normalizedInput.includes('graphite')) return '#4a4a4a';
        if (normalizedInput.includes('dorado') || normalizedInput.includes('gold') || normalizedInput.includes('oro')) return '#F9E5C9';
        if (normalizedInput.includes('beige') || normalizedInput.includes('crema') || normalizedInput.includes('arena')) return '#F5F5DC';
        if (normalizedInput.includes('marron') || normalizedInput.includes('brown') || normalizedInput.includes('cafe') || normalizedInput.includes('coffee') || normalizedInput.includes('chocolate')) return '#800000';
        if (normalizedInput.includes('transparente') || normalizedInput.includes('clear') || normalizedInput.includes('crystal') || normalizedInput.includes('cristal')) return '#f5f5f5';

        return '#cccccc';
    };

    const currentPrice = selectedVariant
        ? parseFloat(selectedVariant.price.amount).toLocaleString('es-PE', { minimumFractionDigits: 0 })
        : '---';

    // Helper for Option matching (Case Insensitive)
    const isDeviceOption = (name: string) => {
        const n = name.toLowerCase();
        return ['storage', 'capacity', 'almacenamiento', 'capacidad', 'size', 'tamaño', 'modelo', 'dispositivo', 'model', 'device', 'compatibilidad', 'compatible', 'compatibility', 'dispositivo compatible', 'dispositivos disponibles'].includes(n);
    };

    return (
        <div className="flex flex-col bg-white relative w-full overflow-x-hidden">
            {/* --- Main Product Section --- */}
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
                            if (title.includes('funda') || title.includes('case') || title.includes('cargador')) return 'accesorios';
                            return rootCategory;
                        })()}`} className="text-gray-500 text-xs md:text-sm font-medium hover:text-black transition-colors capitalize">
                            {(() => {
                                if (!product) return rootCategory;
                                const title = product.name.toLowerCase();
                                if (title.includes('airpods') || title.includes('auriculares')) return 'Audio';
                                if (title.includes('macbook') || title.includes('imac')) return 'Computadoras';
                                if (title.includes('ipad') || title.includes('tablet')) return 'Tablets';
                                if (title.includes('watch') || title.includes('reloj')) return 'Relojes';
                                if (title.includes('funda') || title.includes('case') || title.includes('cargador')) return 'Accesorios';
                                return rootCategory === 'smartphones' ? 'Smartphones' : rootCategory;
                            })()}
                        </Link>
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
                                    <div className="w-full h-full bg-center bg-contain bg-no-repeat transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('${selectedVariant?.image?.src || product.images[0].src}')` }}></div>
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

                                {/* Storage (Almacenamiento/Capacidad/Device) - Priority 1 */}
                                {product.options.some(o => isDeviceOption(o.name)) && (
                                    <>
                                        <div className="mb-6">
                                            <div className="flex justify-between mb-3"><span className="text-sm font-bold text-black uppercase tracking-wide">
                                                Dispositivo Compatible
                                            </span></div>

                                            <div className="relative">
                                                {(() => {
                                                    const navOption = product.options.find(o => isDeviceOption(o.name));
                                                    if (!navOption) return null;

                                                    // Soft Sort
                                                    const sortedValues = [...navOption.values].sort((a, b) => {
                                                        const getNum = (s: string) => parseInt(s.match(/\d+/)?.[0] || '0');
                                                        const numA = getNum(a);
                                                        const numB = getNum(b);
                                                        if (numA !== numB) return numA - numB;
                                                        return a.length - b.length || a.localeCompare(b);
                                                    });

                                                    return (
                                                        <div className="relative group z-20">
                                                            <select
                                                                value={selectedStorage || ''}
                                                                onChange={(e) => {
                                                                    handleOptionSelect(navOption.name, e.target.value);
                                                                }}
                                                                className="w-full appearance-none bg-white border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-black focus:border-black block p-4 pr-10 shadow-sm font-medium cursor-pointer"
                                                            >
                                                                <option value="" disabled>Elegir dispositivo</option>
                                                                {sortedValues.map((val) => (
                                                                    <option key={val} value={val}>
                                                                        {val}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                                                <span className="material-symbols-outlined">expand_more</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Colors - Priority 2 */}
                                {product.options.some(o => o.name === 'Color' || o.name === 'Colour') && (
                                    <div className="mb-6">
                                        <div className="flex justify-between mb-3">
                                            <span className="text-sm font-bold text-black uppercase tracking-wide">Acabado</span>
                                            <span className="text-sm font-medium text-gray-500">{selectedColor}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {(() => {
                                                const colorOption = product.options.find(o => o.name === 'Color' || o.name === 'Colour');
                                                if (!colorOption) return null;

                                                // Filter colors based on selectedStorage (Device)
                                                let visibleColors = colorOption.values;

                                                if (selectedStorage) {
                                                    const compatibleVariants = product.variants.filter(v =>
                                                        v.selectedOptions.some(o => isDeviceOption(o.name) && o.value === selectedStorage)
                                                    );

                                                    const availableColorSet = new Set(compatibleVariants.map(v =>
                                                        v.selectedOptions.find(o => ['Color', 'Colour'].includes(o.name))?.value
                                                    ).filter(Boolean));

                                                    visibleColors = colorOption.values.filter(c => availableColorSet.has(c));
                                                }

                                                return visibleColors.map((val) => {
                                                    const hex = getColorHex(val);
                                                    const variantForColor = product.variants.find(v =>
                                                        v.selectedOptions.some(o => (o.name === 'Color' || o.name === 'Colour') && o.value === val) &&
                                                        (!selectedStorage || v.selectedOptions.some(o => isDeviceOption(o.name) && o.value === selectedStorage))
                                                    );

                                                    const imageSrc = variantForColor?.image?.src;

                                                    // Only show image in circle for Cases/Accessories
                                                    const isCase = product.name.toLowerCase().includes('funda') || product.name.toLowerCase().includes('case') || rootCategory === 'accesorios';

                                                    const bgStyle = (isCase && imageSrc)
                                                        ? { backgroundImage: `url(${imageSrc})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: hex }
                                                        : { backgroundColor: hex };

                                                    return (
                                                        <button
                                                            key={val}
                                                            onClick={() => handleOptionSelect('Color', val)}
                                                            className={`size-10 md:size-12 rounded-full relative shadow-sm transition-all duration-300 border border-gray-200 ${selectedColor === val ? 'ring-2 ring-offset-2 ring-black scale-110' : 'hover:scale-105'}`}
                                                            style={bgStyle}
                                                            title={val}
                                                        />
                                                    );
                                                });
                                            })()}
                                        </div>
                                    </div>
                                )}

                                {/* Memory (RAM) */}
                                {product.options.some(o => ['Memory', 'RAM'].includes(o.name)) && (
                                    <div className="mb-8">
                                        <div className="flex justify-between mb-3"><span className="text-sm font-bold text-black uppercase tracking-wide">
                                            {product.options.find(o => ['Memory', 'RAM'].includes(o.name))?.name}
                                        </span></div>
                                        <div className="grid grid-cols-3 gap-2">
                                            {product.options.find(o => ['Memory', 'RAM'].includes(o.name))?.values.map((val) => (
                                                <button
                                                    key={val}
                                                    onClick={() => {
                                                        const optName = product.options.find(o => ['Memory', 'RAM'].includes(o.name))?.name || 'RAM';
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

                                {/* Fallback for OTHER Options (Generic Renderer) - Includes Memoria */}
                                {product.options
                                    .filter(o => !['Color', 'Colour', 'Title', 'RAM', 'Memory'].includes(o.name) && !isDeviceOption(o.name))
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




            {/* --- New Section: FAQ --- */}
            <section className="bg-[#f5f5f7] py-12 px-6">
                <div className="max-w-[800px] mx-auto">
                    <h2 className="text-2xl md:text-3xl font-black mb-8 text-[#1d1d1f] text-center">Preguntas Frecuentes</h2>
                    <div className="space-y-3">
                        {[
                            { q: "¿Cuánto tarda el envío?", a: "Los envíos en Trujillo se entregan el mismo día. Para el resto del país, el tiempo estimado es de 2 a 4 días hábiles." },
                            { q: "¿Tiene garantía?", a: "Sí, todos nuestros equipos cuentan con 1 año de garantía Movil Pro, válida directamente con nosotros o servicio técnico autorizado." },
                            { q: "¿Qué métodos de pago aceptan?", a: "Aceptamos Izipay, Yape, Depósito Bancario y Tarjeta." }
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
                        <Link to="/accesorios" className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1">
                            Ver todo <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </Link>
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-4 snap-x scrollbar-hide">
                        {accessories.length > 0 ? (
                            accessories.slice(0, 10).map((acc: any, i) => {
                                // Determine category for intelligent linking
                                let categoryPath = 'accesorios';
                                const lowerTitle = acc.title.toLowerCase();
                                if (lowerTitle.includes('iphone') || lowerTitle.includes('samsung')) categoryPath = 'smartphones';
                                else if (lowerTitle.includes('ipad') || lowerTitle.includes('galaxy tab')) categoryPath = 'tablets';
                                else if (lowerTitle.includes('macbook') || lowerTitle.includes('imac')) categoryPath = 'computadoras';
                                else if (lowerTitle.includes('watch') || lowerTitle.includes('reloj')) categoryPath = 'relojes';
                                else if (lowerTitle.includes('airpods') || lowerTitle.includes('galaxy buds') || lowerTitle.includes('sony')) categoryPath = 'audio';

                                return (
                                    <Link to={`/${categoryPath}/${acc.handle}`} key={i} className="w-56 md:w-64 flex-shrink-0 bg-white border border-gray-100 rounded-2xl p-4 md:p-5 snap-start hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group block relative">
                                        <div className="aspect-square bg-gray-50 rounded-xl mb-4 flex items-center justify-center p-4 group-hover:bg-gray-100 transition-colors">
                                            <img src={acc.images[0]?.src} className="h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110" alt={acc.title} />
                                        </div>
                                        <h3 className="font-bold text-[#1d1d1f] mb-1 text-sm md:text-base leading-tight text-balance">{acc.title}</h3>
                                        <div className="flex justify-between items-center mt-3">
                                            <span className="text-gray-900 font-bold text-base md:text-lg">S/ {parseFloat(acc.variants[0]?.price.amount).toLocaleString('es-PE', { minimumFractionDigits: 0 })}</span>
                                            {/* Changed button to div to allow Link propagation without nesting issues */}
                                            <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg md:rounded-xl bg-black text-white flex items-center justify-center hover:bg-[#a5be31] hover:text-black transition-all shadow-md transform active:scale-90 cursor-pointer">
                                                <span className="material-symbols-outlined text-[16px] md:text-[18px]">add</span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })
                        ) : (
                            // Fallback skeleton or empty state while loading
                            [1, 2, 3].map((val) => (
                                <div key={val} className="w-56 md:w-64 flex-shrink-0 bg-white border border-gray-100 rounded-2xl p-4 md:p-5 snap-start animate-pulse">
                                    <div className="aspect-square bg-gray-200 rounded-xl mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            ))
                        )}
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