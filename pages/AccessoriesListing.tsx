import React from 'react';
import { Link } from 'react-router-dom';

const AccessoriesListing: React.FC = () => {
  const accessories = [
    { id: 'silicone-case', name: 'Funda de Silicona con MagSafe', price: 'S/ 49', desc: 'Arcilla', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAsjDFK0sU_Z0W8esd6cD6-Id_dIROimRA1e1Ce8zuSX4UCECxpd9ua3Qnfm2QOi0EFoVqEm57-QF_Y6xD1aLJ6_2HwDllcK3bAhzcFWNwNGVLja3ttxClvhO1NVtTyd2TyXlPEPVvYIiXGZSTyrhQcZq8JeYw4htWEWM0QVxShiGUi9nVoI5EMM20W6eUkPbmsLL2WizjztMeFal1FDUEldS2YDB7ZeB_7ftH4UuH3qiNGoUf0v5_gOoQrzp6KmPFjts43FHHu8tO', tag: 'Nuevo' },
  ];

  return (
    <div className="w-full bg-[#fafafa] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3 font-medium">
              <Link to="/" className="hover:text-black transition-colors">Inicio</Link>
              <span>/</span>
              <span className="text-black">Accesorios</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[#111811] mb-4 tracking-tight leading-none">
              Accesorios Premium
            </h1>
            <p className="text-gray-500 text-lg max-w-2xl">
              Mejora tu iPhone con nuestra colección seleccionada de accesorios.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#fdf4ff] text-[#86198f] px-5 py-2.5 rounded-full font-bold text-sm shadow-sm border border-[#fae8ff] shrink-0">
            <span className="material-symbols-outlined text-[20px] filled">stars</span>
            Calidad Garantizada
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

            {/* Category Filter */}
            <div>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Categoría</h3>
              <div className="space-y-3">
                {['Fundas', 'Cargadores', 'Audio', 'Carteras'].map((cat, idx) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        defaultChecked={idx === 0}
                        className="peer appearance-none h-5 w-5 border border-gray-300 rounded-full checked:bg-[#a5be31] checked:border-[#a5be31] transition-colors cursor-pointer"
                      />
                      <span className="material-symbols-outlined text-white text-[14px] absolute opacity-0 peer-checked:opacity-100 pointer-events-none font-bold">check</span>
                    </div>
                    <span className="text-gray-600 text-sm font-medium group-hover:text-black transition-colors flex-1">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Color</h3>
              <div className="flex flex-wrap gap-3">
                {['#3C3C3D', '#F2F1EC', '#1F2C45', '#BF0010', '#E5DDEA', '#FFFFFF'].map(color => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded-full border border-gray-200 shadow-sm hover:scale-110 transition-transform focus:ring-2 focus:ring-offset-2 focus:ring-[#111811]"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </aside>

          {/* Grid */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-[#111811]">24 productos encontrados</span>
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                <span className="text-gray-500 text-sm font-medium">Ordenar por:</span>
                <select className="border-none bg-transparent font-bold text-[#111811] text-sm focus:ring-0 p-0 cursor-pointer">
                  <option>Destacados</option>
                  <option>Precio: Menor a Mayor</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
              {accessories.map((acc, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-3 relative hover:shadow-lg transition-all duration-300 group border border-gray-100 flex flex-col">
                  {/* Badges */}
                  <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1">
                    {acc.tag && (
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border ${acc.tag === 'Oferta' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-[#f3f4f6] text-gray-800 border-gray-200'}`}>
                        {acc.tag}
                      </span>
                    )}
                  </div>

                  {/* Image */}
                  <Link to={`/accesorios/cases/${acc.id}`} className="aspect-[4/5] w-full flex items-center justify-center mb-3 bg-[#f8fafc] rounded-xl relative overflow-hidden mt-2">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,white,transparent)] opacity-60"></div>
                    <img src={acc.image} alt={acc.name} className="h-[85%] w-full object-contain transition-transform duration-500 group-hover:scale-105" />
                  </Link>

                  {/* Info */}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-bold text-[#111811] leading-tight group-hover:text-[#a5be31] transition-colors line-clamp-2">
                      {acc.name}
                    </h3>
                  </div>

                  <div className="flex gap-1 mb-4 flex-wrap">
                    <span className="bg-gray-50 text-gray-500 text-[9px] font-bold px-2 py-0.5 rounded border border-gray-100 uppercase tracking-wide">
                      {acc.desc}
                    </span>
                  </div>

                  <div className="mt-auto flex items-end justify-between">
                    <div className="flex flex-col">
                      <span className="text-lg font-black text-[#111811] tracking-tight">{acc.price}</span>
                    </div>
                    <Link to={`/accesorios/cases/${acc.id}`} className="h-8 w-8 bg-[#111811] rounded-full flex items-center justify-center text-white hover:bg-[#a5be31] hover:text-[#111811] transition-all shadow-md group-hover:scale-110">
                      <span className="material-symbols-outlined text-[16px]">add</span>
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

export default AccessoriesListing;