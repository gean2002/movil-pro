import React from 'react';

const Terms: React.FC = () => {
    return (
        <div className="max-w-[1000px] mx-auto px-6 py-12 md:py-20">
            <h1 className="text-4xl font-bold mb-8 text-[#1d1d1f]">Términos y Condiciones</h1>

            <div className="prose max-w-none text-gray-700 space-y-6">
                <p>
                    Bienvenido a <strong>Movil Pro</strong>. Al acceder y utilizar nuestro sitio web, usted acepta los siguientes términos y condiciones. Por favor, léalos cuidadosamente antes de realizar una compra.
                </p>

                <h3 className="text-2xl font-bold text-[#1d1d1f] mt-8">1. Generalidades</h3>
                Movil Pro es una empresa de distribución de tecnología con operaciones en Perú. Todas las transacciones realizadas en este sitio están sujetas a la legislación peruana vigente y a la jurisdicción de los tribunales de Trujillo.

                <h3 className="text-2xl font-bold text-[#1d1d1f] mt-8">2. Productos y Precios</h3>
                <p>
                    Todos los precios están expresados en Soles (S/) e incluyen el Impuesto General a las Ventas (IGV), salvo que se indique lo contrario. Nos reservamos el derecho de modificar los precios y el stock de los productos en cualquier momento sin previo aviso.
                </p>

                <h3 className="text-2xl font-bold text-[#1d1d1f] mt-8">3. Proceso de Compra</h3>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Para realizar una compra, debe ser mayor de 18 años y proporcionar información válida (DNI/RUC).</li>
                    <li>Una vez confirmado el pedido, recibirá un correo electrónico con los detalles de la transacción.</li>
                    <li>Movil Pro se reserva el derecho de cancelar pedidos si detecta actividad fraudulenta o errores manifiestos en el precio.</li>
                </ul>

                <h3 className="text-2xl font-bold text-[#1d1d1f] mt-8">4. Medios de Pago</h3>
                <p>
                    Aceptamos pagos a través de la plataforma <strong>Izipay</strong>, garantizando transacciones seguras y rápidas para todas sus compras.
                </p>

                <p className="text-sm text-gray-500 mt-12 pt-8 border-t">
                    Última actualización: Enero 2026
                </p>
            </div>
        </div>
    );
};

export default Terms;
