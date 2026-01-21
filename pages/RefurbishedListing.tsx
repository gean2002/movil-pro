import React from 'react';
import { Link } from 'react-router-dom';

const RefurbishedListing: React.FC = () => {
  const products = [
    { id: '14-pro', name: 'iPhone 14 Pro', price: 'S/ 989', original: 'S/ 1.319', condition: 'Excelente', storage: '256GB', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCd9-FWZQD33v-L-xGQ_-q51m8C5U5uVKRzN6yf0AW5Yj5PyMp5Aaw9DVjd3NUf3Cb-4Kwole2A5on0Wv9J4x0SGEafIS189TgSu0ubZuoeh11FxlXMEOzqlJJ3pD74j-PiF3OcXdTyarlgwljIwj_Ds-CeG1iMeRdn92E1_8WdZ6egv8nt4lZa673Um4J3lrWnGypWV92nnEl-sZ0RiznNv-PrLNyrakv852xt42rZKNvy6dEr28I4G9Wg8u18BEemuE5311I8k19l', tag: 'Reacondicionado', colors: ['#3C3C3D', '#F2F1EC'] },
  ];

  return (
    <div className="w-full bg-[#fafafa] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3 font-medium">
              <Link to="/" className="hover:text-black transition-colors">Inicio</Link>
              <span>/</span>
              <span className="text-black">iPhone Reacondicionados</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[#111811] mb-4 tracking-tight leading-none">
              Semi-Nuevos
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl">
              Tecnología premium auditada por expertos. Cuida el planeta y tu bolsillo sin renunciar a la excelencia.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#ecfdf5] text-[#059669] px-5 py-2.5 rounded-full font-bold text-sm shadow-sm border border-[#d1fae5] shrink-0">
            <span className="material-symbols-outlined text-[20px] filled">verified_user</span>
            1 Año de Garantía incluida
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0 space-y-8">
            <div className="flex justify-between items-baseline">
              <h2 className="text-lg font-bold text-[#111811]">Filtros</h2>
              <button className="text-sm text-gray-400 underline decoration-1 underline-offset-2 hover:text-black transition-colors">
                Borrar Todo
              </button>
            </div>

            {/* Model Filter */}
            <div>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Modelo</h3>
              <div className="space-y-3">
                {['iPhone 14 Pro', 'iPhone 13', 'iPhone 12', 'iPhone SE'].map((model, idx) => (
                  <label key={model} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        defaultChecked={idx === 0}
                        className="peer appearance-none h-5 w-5 border border-gray-300 rounded-full checked:bg-[#a5be31] checked:border-[#a5be31] transition-colors cursor-pointer"
                      />
                      <span className="material-symbols-outlined text-white text-[14px] absolute opacity-0 peer-checked:opacity-100 pointer-events-none font-bold">check</span>
                    </div>
                    <span className="text-gray-600 text-sm font-medium group-hover:text-black transition-colors flex-1">{model}</span>
                    <span className="text-gray-400 text-xs">(12)</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Storage Filter */}
            <div>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Almacenamiento</h3>
              <div className="flex flex-wrap gap-2">
                {['64GB', '128GB', '256GB'].map((storage, idx) => (
                  <button
                    key={storage}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${idx === 1 ? 'bg-[#a5be31] border-[#a5be31] text-[#111811]' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}
                  >
                    {storage}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Color</h3>
              <div className="flex flex-wrap gap-3">
                {['#3C3C3D', '#F2F1EC', '#1F2C45', '#BF0010', '#E5DDEA', '#C7DBEB', '#222222'].map(color => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded-full border border-gray-200 shadow-sm hover:scale-110 transition-transform focus:ring-2 focus:ring-offset-2 focus:ring-[#111811]"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Condition Filter */}
            <div>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Estado</h3>
              <div className="space-y-3">
                {['Como Nuevo', 'Excelente', 'Bueno'].map((cond) => (
                  <label key={cond} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input type="radio" name="condition" className="peer appearance-none h-5 w-5 border border-gray-300 rounded-full checked:border-[#a5be31] checked:border-4 transition-all cursor-pointer" />
                    </div>
                    <span className="text-gray-600 text-sm font-medium group-hover:text-black transition-colors">{cond}</span>
                  </label>
                ))}
              </div>
            </div>

          </aside>

          {/* Grid */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-[#111811]">42 productos encontrados</span>
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                <span className="text-gray-500 text-sm font-medium">Ordenar por:</span>
                <select className="border-none bg-transparent font-bold text-[#111811] text-sm focus:ring-0 p-0 cursor-pointer">
                  <option>Relevancia</option>
                  <option>Precio: Menor a Mayor</option>
                  <option>Precio: Mayor a Menor</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
              {products.map((product, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-3 relative hover:shadow-lg transition-all duration-300 group border border-gray-100 flex flex-col">
                  {/* Badges */}
                  <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1">
                    <span className="bg-[#fef08a] text-yellow-800 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border border-yellow-100">
                      {product.tag}
                    </span>
                  </div>

                  {/* Image */}
                  <Link to={`/reacondicionados/iphone/${product.id}`} className="aspect-[4/5] w-full flex items-center justify-center mb-3 bg-[#f8fafc] rounded-xl relative overflow-hidden mt-2">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,white,transparent)] opacity-60"></div>
                    <img src={product.image} alt={product.name} className="h-[85%] w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105" />
                  </Link>

                  {/* Info */}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-bold text-[#111811] leading-tight group-hover:text-[#a5be31] transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex -space-x-1 shrink-0 pl-1">
                      {product.colors && product.colors.map((c, i) => (
                        <div key={i} className="w-3 h-3 rounded-full border border-white shadow-sm" style={{ backgroundColor: c }}></div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-1 mb-4 flex-wrap">
                    <span className="bg-green-50 text-green-700 text-[9px] font-bold px-2 py-0.5 rounded border border-green-100 uppercase tracking-wide">
                      {product.condition}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium py-0.5 bg-gray-50 px-1.5 rounded border border-gray-100">
                      {product.storage}
                    </span>
                  </div>

                  <div className="mt-auto flex items-end justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 line-through font-medium mb-0">{product.original}</span>
                      <span className="text-lg font-black text-[#111811] tracking-tight">{product.price}</span>
                    </div>
                    <Link to={`/reacondicionados/iphone/${product.id}`} className="h-8 w-8 bg-[#111811] rounded-full flex items-center justify-center text-white hover:bg-[#a5be31] hover:text-[#111811] transition-all shadow-md group-hover:scale-110">
                      <span className="material-symbols-outlined text-[16px]">shopping_cart</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <button className="bg-white border border-gray-200 text-[#111811] font-bold py-3 px-8 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-2 text-sm shadow-sm">
                Cargar Más Productos
                <span className="material-symbols-outlined text-[16px]">expand_more</span>
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default RefurbishedListing;