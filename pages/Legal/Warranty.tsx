import React from 'react';

const Warranty: React.FC = () => {
    return (
        <div className="max-w-[1000px] mx-auto px-6 py-12 md:py-20">
            <h1 className="text-4xl font-bold mb-8 text-[#1d1d1f]">Garantía Movil Pro</h1>

            <div className="prose max-w-none text-gray-700 space-y-6">
                <p>
                    En <strong>Movil Pro</strong>, garantizamos la calidad y autenticidad de todos nuestros productos.
                </p>

                <h3 className="text-2xl font-bold text-[#1d1d1f] mt-8">1. Período de Garantía</h3>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>PARA EQUIPOS NUEVOS:</strong> 1 año de garantía con la tienda y con Apple. La garantía no cubre golpes ni caídas, solo fallos del sistema o la batería, así como también descuentos en cualquier problema que respecta a servicio técnico como por ejemplo: cambios de pantalla, base, tapa, parlantes, mantenimiento, etc.</li>
                    <li><strong>PARA EQUIPOS SEMI NUEVOS:</strong> 1 año de garantía con la tienda que solo cubre fallos del sistema o la batería. También se le aplica descuentos en caso deseen de servicio técnico como: cambio de pantalla, base, tapa, parlantes, mantenimiento, etc.</li>
                </ul>

                <h3 className="text-2xl font-bold text-[#1d1d1f] mt-8">2. ¿Qué cubre la garantía?</h3>
                <p>
                    La garantía cubre exclusivamente <strong>defectos de fábrica</strong> (hardware) que afecten el funcionamiento normal del dispositivo.
                </p>

                <h3 className="text-2xl font-bold text-[#1d1d1f] mt-8">3. Exclusiones</h3>
                <p>
                    La garantía <strong>NO</strong> cubre:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Daños accidentales (caídas, golpes, pantallas rotas).</li>
                    <li>Daños por contacto con líquidos o humedad (incluso en dispositivos con resistencia IP).</li>
                    <li>Manipulación por terceros o servicios técnicos no autorizados.</li>
                    <li>Desgaste natural de la batería o estética por el uso normal.</li>
                </ul>

                <h3 className="text-2xl font-bold text-[#1d1d1f] mt-8">4. Proceso de Garantía</h3>
                <p>
                    Para hacer válida la garantía, debe presentar su comprobante de pago (boleta o factura). Puede acercarse a nuestra tienda física o coordinar el envío del producto a nuestro centro de servicio. El tiempo de diagnóstico es de 24 a 48 horas hábiles.
                </p>
            </div>
        </div>
    );
};

export default Warranty;
