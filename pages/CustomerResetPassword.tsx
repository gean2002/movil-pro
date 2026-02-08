import React, { useState } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { resetCustomerPassword } from '../lib/shopify';

const CustomerResetPassword: React.FC = () => {
    const params = useParams<{ id: string; token: string }>();
    const location = useLocation();
    const query = new URLSearchParams(location.search);

    const id = params.id || query.get('id');
    const token = params.token || query.get('token');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!id || !token) {
            setMessage({ type: 'error', text: `Enlace inválido o incompleto. (ID: ${id || 'no existe'}, Token: ${token || 'no existe'})` });
            return;
        }

        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Las contraseñas no coinciden.' });
            return;
        }

        if (password.length < 5) {
            setMessage({ type: 'error', text: 'La contraseña debe tener al menos 5 caracteres.' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const accessTokenData = await resetCustomerPassword(id, token, password);
            if (accessTokenData) {
                // Optionally save token and login automatically
                localStorage.setItem('shopifyCustomerAccessToken', accessTokenData.accessToken);
                localStorage.setItem('shopifyCustomerAccessTokenExpiresAt', accessTokenData.expiresAt);

                setMessage({
                    type: 'success',
                    text: '¡Contraseña actualizada correctamente! Ingresando...'
                });

                setTimeout(() => {
                    window.location.href = '/#/account';
                    window.location.reload();
                }, 2000);
            }
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.message || 'Error al restablecer la contraseña. El enlace puede haber expirado.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] bg-white">
            <div className="w-full max-w-lg p-8 mx-4">
                <div className="text-center mb-12">
                    <img src="/logo.png" alt="Movil Pro" className="h-10 mx-auto mb-8 object-contain" />
                    <h1 className="text-4xl font-black tracking-tighter mb-4 text-black">
                        Nueva Contraseña
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Crea una contraseña segura para tu cuenta.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Nueva Contraseña</label>
                        <input
                            required
                            className="w-full h-16 px-6 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white transition-all text-lg font-medium outline-none placeholder:text-gray-300"
                            placeholder="••••••••"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Confirmar Contraseña</label>
                        <input
                            required
                            className="w-full h-16 px-6 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-black focus:bg-white transition-all text-lg font-medium outline-none placeholder:text-gray-300"
                            placeholder="••••••••"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    {message && (
                        <div className={`p-4 rounded-xl text-center font-bold ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-50 text-red-600'}`}>
                            {message.text}
                        </div>
                    )}

                    <button
                        disabled={loading}
                        className="w-full h-16 bg-black text-[#a5be31] font-bold text-lg rounded-2xl hover:bg-[#1a1a1a] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-8"
                        type="submit"
                    >
                        {loading ? 'Actualizando...' : 'Establecer Contraseña'}
                        {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
                    </button>

                    <div className="text-center mt-8">
                        <Link to="/login" className="text-sm font-bold text-gray-400 hover:text-black transition-colors">
                            Cancelar y volver
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustomerResetPassword;
