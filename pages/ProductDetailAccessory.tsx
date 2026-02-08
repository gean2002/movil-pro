import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { fetchProductByHandle } from '../lib/shopify';
import TrustBadges from '../components/TrustBadges';

const ProductDetailAccessory: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // States for selectors
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedModel, setSelectedModel] = useState(''); // Often matches 'Storage' or 'Size' in Shopify for accessories
  const [activeImage, setActiveImage] = useState(0);

  // Derived state
  const [currentVariant, setCurrentVariant] = useState<any>(null);

  useEffect(() => {
    const loadProduct = async () => {
      if (!handle) return;
      setLoading(true);
      try {
        const fetchedProduct = await fetchProductByHandle(handle);
        if (fetchedProduct) {
          setProduct(fetchedProduct);

          // Initialize Options
          const firstVariant = fetchedProduct.variants[0];
          if (firstVariant) {
            setCurrentVariant(firstVariant);

            const colorOpt = firstVariant.selectedOptions.find((o: any) => o.name === 'Color' || o.name === 'Colour' || o.name === 'Color / Acabado');
            if (colorOpt) setSelectedColor(colorOpt.value);

            const modelOpt = firstVariant.selectedOptions.find((o: any) => o.name === 'Size' || o.name === 'Tamaño' || o.name === 'Model' || o.name === 'Modelo');
            if (modelOpt) setSelectedModel(modelOpt.value);
          }
        } else {
          setError('Producto no encontrado');
        }
      } catch (err) {
        console.error("Error fetching accessory:", err);
        setError('Error al cargar el accesorio');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [handle]);

  // Update current variant when options change
  useEffect(() => {
    if (!product) return;
    const variant = product.variants.find((v: any) => {
      const matchColor = !selectedColor || v.selectedOptions.some((o: any) => (o.name === 'Color' || o.name === 'Colour' || o.name === 'Color / Acabado') && o.value === selectedColor);
      const matchModel = !selectedModel || v.selectedOptions.some((o: any) => (o.name === 'Size' || o.name === 'Tamaño' || o.name === 'Model' || o.name === 'Modelo') && o.value === selectedModel);
      return matchColor && matchModel;
    });
    if (variant) setCurrentVariant(variant);
  }, [selectedColor, selectedModel, product]);


  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  if (error || !product) return <div className="min-h-screen flex items-center justify-center text-red-500">{error || 'Accesorio no encontrado'}</div>;

  const title = product.title;
  const description = product.descriptionHtml || product.description;
  const images = product.images.map((i: any) => ({ src: i.src, altText: i.altText }));
  // If variant has specific image, use it, else default to first
  const displayImage = (currentVariant?.image?.src) ? currentVariant.image.src : images[activeImage]?.src || images[0]?.src;

  const price = currentVariant ? parseFloat(currentVariant.price.amount) : 0;
  const formattedPrice = currentVariant ?
    (currentVariant.price.currencyCode === 'PEN' ? 'S/ ' : currentVariant.price.currencyCode + ' ') + price.toLocaleString('es-PE', { minimumFractionDigits: 0 })
    : '';

  // Extract available options
  const allColors = Array.from(new Set(product.options?.find((o: any) => o.name === 'Color' || o.name === 'Colour' || o.name === 'Color / Acabado')?.values.map((v: any) => v.value) || [])) as string[];
  const allModels = Array.from(new Set(product.options?.find((o: any) => o.name === 'Size' || o.name === 'Tamaño' || o.name === 'Model' || o.name === 'Modelo')?.values.map((v: any) => v.value) || [])) as string[];

  const handleAddToCart = () => {
    if (currentVariant) {
      addToCart({
        variantId: currentVariant.id,
        name: title + (selectedColor ? ` - ${selectedColor}` : ''),
        price: price,
        image: currentVariant.image?.src || images.find((img: any) => img.altText?.toLowerCase().includes(selectedColor.toLowerCase()))?.src || images[0]?.src,
        color: selectedColor,
        storage: selectedModel,
        condition: 'Nuevo'
      });
      alert('Accesorio añadido al carrito');
    }
  };

  return (
    <div className="flex flex-col bg-white relative w-full overflow-x-hidden">
      {/* Breadcrumbs */}
      <div className="px-4 md:px-10 lg:px-40 flex justify-center pt-4">
        <div className="flex flex-wrap gap-2 px-4 py-2 justify-center md:justify-start">
          <Link to="/" className="text-gray-500 text-xs md:text-sm font-medium hover:text-black transition-colors">Inicio</Link>
          <span className="text-gray-400 text-xs md:text-sm font-medium">/</span>
          <Link to="/accesorios" className="text-blue-600 font-bold text-sm hover:underline">Accesorios</Link>
          <span className="text-gray-400 text-xs md:text-sm font-medium">/</span>
          <span className="text-black text-xs md:text-sm font-medium line-clamp-1">{title}</span>
        </div>
      </div>

      <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-4">
        <div className="bg-[#fcfdfc] border border-[#a5be31]/30 rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-10 lg:p-16 flex flex-1 justify-center shadow-inner w-full">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 max-w-[1280px] flex-1">

            {/* Left: Product Images */}
            <div className="flex-1 min-w-0 flex flex-col gap-6">
              <div className="w-full bg-[#f5f5f7] aspect-square rounded-[2rem] overflow-hidden relative group flex items-center justify-center p-8">
                <img
                  src={displayImage}
                  alt={title}
                  className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="flex justify-center gap-3 flex-wrap">
                  {images.map((img: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`w-16 h-16 rounded-xl border-2 bg-[#f5f5f7] p-2 transition-all ${((activeImage === idx && !currentVariant?.image) || (currentVariant?.image?.src === img.src)) ? 'border-black' : 'border-transparent hover:border-gray-200'}`}
                    >
                      <img src={img.src} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                    </button>
                  ))}
                </div>
              )}
              <div className="mt-4"><TrustBadges /></div>
            </div>

            {/* Right: Details & Purchase */}
            <div className="flex-1 min-w-0 flex flex-col pt-2">
              <div className="mb-4">
                <span className="text-[#86198f] text-xs font-bold uppercase tracking-wide mb-2 block">Accesorios</span>
                <h1 className="text-[#111811] tracking-tight text-3xl md:text-5xl font-black leading-tight mb-2">{title}</h1>

                <div className="flex items-end gap-3 mb-6">
                  <span className="text-4xl font-black text-[#111811] tracking-tighter">{formattedPrice}</span>
                </div>
              </div>

              <div className="text-gray-600 text-sm md:text-base leading-relaxed mb-8 font-medium" dangerouslySetInnerHTML={{ __html: description }} />

              <div className="space-y-8 border-t border-gray-100 pt-8">

                {/* Model Selector */}
                {allModels.length > 0 && (
                  <div>
                    <div className="flex justify-between mb-3"><span className="text-sm font-bold text-black uppercase tracking-wide">Modelo / Tamaño</span></div>
                    <div className="relative">
                      <select
                        className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 font-bold text-[#1d1d1f] focus:ring-2 focus:ring-black outline-none appearance-none cursor-pointer"
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                      >
                        {allModels.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">expand_more</span>
                    </div>
                  </div>
                )}

                {/* Color Selector */}
                {allColors.length > 0 && (
                  <div>
                    <div className="flex justify-between mb-3">
                      <span className="text-sm font-bold text-black uppercase tracking-wide">Acabado</span>
                      <span className="text-sm text-gray-500 font-medium">{selectedColor}</span>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {allColors.map((c) => (
                        <button
                          key={c}
                          onClick={() => setSelectedColor(c)}
                          className={`h-10 px-4 rounded-full border border-gray-200 font-bold text-sm transition-all ${selectedColor === c ? 'bg-black text-white border-black' : 'bg-white text-gray-700 hover:border-gray-300'}`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add to Cart Action */}
                <div className="hidden md:flex flex-col gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={!currentVariant || !currentVariant.availableForSale}
                    className={`w-full text-white text-lg font-bold py-4 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group transform active:scale-[0.98] ${(!currentVariant || !currentVariant.availableForSale) ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#1d1d1f] hover:bg-[#a5be31] hover:text-[#1d1d1f]'}`}
                  >
                    <span className="material-symbols-outlined group-hover:animate-bounce">shopping_bag</span>
                    {currentVariant?.availableForSale ? 'Añadir a la Bolsa' : 'Agotado'}
                  </button>

                  <div className="flex items-center justify-center gap-6 py-4">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
                      <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                      Envío en 24h
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
                      <span className="material-symbols-outlined text-[18px]">replay</span>
                      Devoluciones Gratis
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200 pt-4 pb-4 px-4 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] md:hidden z-50 pb-safe">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-tight">Total</span>
            <span className="text-2xl font-black text-[#1d1d1f] leading-none">{formattedPrice}</span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!currentVariant || !currentVariant.availableForSale}
            className={`flex-1 text-white h-12 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 active:scale-95 transition-transform ${(!currentVariant || !currentVariant.availableForSale) ? 'bg-gray-300' : 'bg-[#111811]'}`}
          >
            Añadir
          </button>
        </div>
      </div>

      <style>{`
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom, 20px);
        }
      `}</style>
    </div >
  );
};

export default ProductDetailAccessory;
