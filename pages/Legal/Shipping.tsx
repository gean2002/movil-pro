import React from 'react';

const Shipping: React.FC = () => {
    return (
        <div className="max-w-[1000px] mx-auto px-6 py-12 md:py-20">
            <h1 className="text-4xl font-bold mb-8 text-[#1d1d1f]">Política de Envíos</h1>

            <div className="prose max-w-none text-gray-700 space-y-6">
                <p>
                    Realizamos envíos a todo el Perú de manera segura y confiable.
                </p>

                <h3 className="text-2xl font-bold text-[#1d1d1f] mt-8">1. Envíos en Trujillo</h3>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Envío Express:</strong> Recibe tu pedido el mismo día si compras antes de la 1:00 PM (Lunes a Sábado). Costo variable según distrito.</li>
                    <li><strong>Envío Regular:</strong> Entrega en 24 horas hábiles. Tarifa plana disponible para distritos de Trujillo.</li>
                    <li><strong>Recojo en Tienda:</strong> Gratuito. Puede recoger su pedido previa coordinación en nuestro local de Trujillo.</li>
                </ul>

                <h3 className="text-2xl font-bold text-[#1d1d1f] mt-8">2. Envíos a Provincias</h3>
                <p>
                    Trabajamos con agencias confiables como <strong>Olva Courier</strong> y <strong>Shalom</strong> para llegar a todo el país.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Tiempo de entrega:</strong> De 2 a 5 días hábiles, dependiendo del destino.</li>
                    <li><strong>Costo:</strong> Se calcula al momento de la compra según el peso y la ciudad de destino.</li>
                    <li>Recibirá un número de seguimiento (tracking) para monitorear su paquete.</li>
                </ul>

                <h3 className="text-2xl font-bold text-[#1d1d1f] mt-8">3. Consideraciones Importantes</h3>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Es responsabilidad del cliente proporcionar una dirección exacta y un número de celular de contacto.</li>
                    <li>Los pedidos realizados domingos o feriados se procesan al siguiente día hábil.</li>
                    <li>Para envíos a provincias, es posible que se requiera el DNI del titular para el recojo en agencia.</li>
                </ul>
            </div>
        </div>
    );
};

export default Shipping;
