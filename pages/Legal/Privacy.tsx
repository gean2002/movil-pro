import React from 'react';

const Privacy: React.FC = () => {
    return (
        <div className="max-w-[1000px] mx-auto px-6 py-12 md:py-20">
            <h1 className="text-4xl font-bold mb-8 text-[#1d1d1f]">Política de Privacidad</h1>

            <div className="prose max-w-none text-gray-700 space-y-6">
                <p>
                    En <strong>Movil Pro</strong>, valoramos su privacidad y estamos comprometidos a proteger sus datos personales en cumplimiento con la <strong>Ley N° 29733, Ley de Protección de Datos Personales</strong> del Perú, y su Reglamento.
                </p>

                <h3 className="text-2xl font-bold text-[#1d1d1f] mt-8">1. Recolección de Información</h3>
                <p>
                    Recopilamos información personal que usted nos proporciona voluntariamente al realizar una compra, registrarse en nuestro sitio web o suscribirse a nuestro boletín. Esto puede incluir su nombre, dirección, correo electrónico, número de teléfono y RUC/DNI.
                </p>

                <h3 className="text-2xl font-bold text-[#1d1d1f] mt-8">2. Uso de la Información</h3>
                <p>
                    Utilizamos sus datos para:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Procesar y entregar sus pedidos en Trujillo y todo el Perú.</li>
                    <li>Enviar notificaciones sobre el estado de su compra.</li>
                    <li>Mejorar nuestra tienda virtual y servicio al cliente.</li>
                    <li>Enviar promociones y novedades (solo si ha aceptado recibirlas).</li>
                </ul>

                <h3 className="text-2xl font-bold text-[#1d1d1f] mt-8">3. Protección de Datos</h3>
                <p>
                    Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos contra acceso no autorizado, alteración o pérdida. Sus datos de pago son procesados de forma segura a través de pasarelas certificadas y no almacenamos detalles completos de sus tarjetas de crédito.
                </p>

                <h3 className="text-2xl font-bold text-[#1d1d1f] mt-8">4. Derechos ARCO</h3>
                <p>
                    Como titular de sus datos personales, usted tiene derecho a Acceder, Rectificar, Cancelar y Oponerse (Derechos ARCO) al tratamiento de su información. Para ejercer estos derechos, puede contactarnos a <a href="mailto:movilpro120@gmail.com" className="text-blue-600 underline">movilpro120@gmail.com</a>.
                </p>

                <h3 className="text-2xl font-bold text-[#1d1d1f] mt-8">5. Cookies</h3>
                <p>
                    Utilizamos cookies para mejorar su experiencia de navegación. Puede configurar su navegador para rechazar las cookies, aunque esto podría limitar algunas funcionalidades de nuestra tienda.
                </p>

                <p className="text-sm text-gray-500 mt-12 pt-8 border-t">
                    Última actualización: Enero 2026
                </p>
            </div>
        </div>
    );
};

export default Privacy;
