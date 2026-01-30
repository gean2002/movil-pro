import React from 'react';

const Returns: React.FC = () => {
    return (
        <div className="max-w-[1000px] mx-auto px-6 py-12 md:py-20">
            <h1 className="text-4xl font-bold mb-8 text-[#1d1d1f]">Cambios y Devoluciones</h1>

            <div className="prose max-w-none text-gray-700 space-y-6">
                <p>
                    Queremos que estés satisfecho con tu compra. Si no es así, te ofrecemos opciones de cambio y devolución bajo las siguientes condiciones.
                </p>

                <h3 className="text-2xl font-bold text-[#1d1d1f] mt-8">1. Política de Cambios y Devoluciones</h3>
                <p>
                    Todos los equipos constan con <strong>7 días hábiles</strong> para cambios o devoluciones siempre y cuando sea por problemas que identificaron en los equipos como <strong>fallos del sistema o batería</strong>, siempre presentando la boleta que se le dio al adquirir el dispositivo.
                </p>
                <p className="text-sm bg-gray-100 p-4 rounded-lg mt-2">
                    <strong>Importante:</strong> No se aceptan devoluciones de equipos configurados, activados o asociados a una cuenta iCloud/Samsung, salvo por falla de fábrica cubierta por la garantía.
                </p>

                <h3 className="text-2xl font-bold text-[#1d1d1f] mt-8">2. Reembolsos</h3>
                <p>
                    En caso de devolución aceptada, el reembolso se realizará siempre a través de <strong>Izipay</strong> o del medio de pago utilizado originalmente.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Tarjetas de Crédito/Débito:</strong> El extorno puede tomar entre 15 a 30 días hábiles dependiendo de su banco.</li>
                    <li><strong>Transferencias/Yape:</strong> Se realizará en un plazo máximo de 48 horas hábiles.</li>
                </ul>
            </div>
        </div>
    );
};

export default Returns;
