import React from 'react';

const Disclaimer: React.FC = () => {
    return (
        <div className="max-w-[1000px] mx-auto px-6 py-12 md:py-20">
            <h1 className="text-4xl font-bold mb-8 text-[#1d1d1f]">Aviso Legal sobre Imágenes</h1>

            <div className="prose max-w-none text-gray-700 space-y-6">
                <p>
                    En <strong>Movil Pro</strong>, nos esforzamos por mostrar nuestros productos con la mayor precisión posible. Sin embargo, queremos informar a nuestros clientes que:
                </p>

                <h3 className="text-2xl font-bold text-[#1d1d1f] mt-8">1. Imágenes Referenciales</h3>
                <p>
                    Todas las fotografías, representaciones gráficas y videos mostrados en este sitio web son de carácter <strong>exclusivamente ilustrativo y referencial</strong>.
                </p>

                <h3 className="text-2xl font-bold text-[#1d1d1f] mt-8">2. Variaciones del Producto</h3>
                <p>
                    Debido a actualizaciones de fabricación, diferencias en la calibración de colores de las pantallas o mejoras en el diseño por parte de los fabricantes (Apple, Samsung, etc.), el producto físico entregado podría presentar ligeras variaciones cosméticas respecto a las imágenes mostradas.
                </p>

                <h3 className="text-2xl font-bold text-[#1d1d1f] mt-8">3. Especificaciones Técnicas</h3>
                <p>
                    Estas diferencias visuales no comprometen en absoluto las especificaciones técnicas, la calidad, el rendimiento ni la garantía del producto. El modelo y las características técnicas descritas en la ficha del producto prevalecen sobre la imagen referencial.
                </p>

                <p className="text-sm text-gray-500 mt-12 pt-8 border-t">
                    Si tiene dudas sobre la apariencia específica de un producto, por favor contáctenos a través de nuestro WhatsApp de soporte antes de realizar su compra.
                </p>
            </div>
        </div>
    );
};

export default Disclaimer;
