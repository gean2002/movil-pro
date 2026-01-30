import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { resetCustomerPassword } from '../lib/shopify';

const ResetPassword: React.FC = () => {
    const { id, token } = useParams<{ id: string; token: string }>();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!id || !token) {
            setMessage({ type: 'error', text: 'Enlace inválido o incompleto.' });
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
                    text: '¡Contraseña restablecida con éxito! Redirigiendo...'
                });

                setTimeout(() => navigate('/account'), 2000);
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
        <div className="flex items-start justify-center w-full pt-12 pb-8 bg-[#f6f8f6] flex-grow">
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden md:p-10 p-6 mx-4">
                <div className="absolute top-0 left-0 w-64 h-64 bg-[#a5be31]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

                <div className="z-10 relative">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-[#a5be31]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-[#a5be31] text-3xl">lock_reset</span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight mb-3 text-[#111811]">
                            Nueva Contraseña
                        </h1>
                        <p className="text-gray-500 font-medium px-4">
                            Ingresa tu nueva contraseña a continuación.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-[#111811] uppercase tracking-wider ml-1">Nueva Contraseña</label>
                            <div className="relative">
                                <input
                                    required
                                    className="w-full h-14 pl-12 pr-4 rounded-2xl border border-gray-100 bg-gray-50 text-[#111811] font-medium focus:outline-none focus:ring-2 focus:ring-[#a5be31] transition-all"
                                    placeholder="••••••••"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">lock</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-[#111811] uppercase tracking-wider ml-1">Confirmar Contraseña</label>
                            <div className="relative">
                                <input
                                    required
                                    className="w-full h-14 pl-12 pr-4 rounded-2xl border border-gray-100 bg-gray-50 text-[#111811] font-medium focus:outline-none focus:ring-2 focus:ring-[#a5be31] transition-all"
                                    placeholder="••••••••"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">lock_clock</span>
                            </div>
                        </div>

                        {message && (
                            <div className={`p-4 rounded-xl text-sm font-bold ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {message.text}
                            </div>
                        )}

                        <div className="pt-2 space-y-4">
                            <button
                                disabled={loading}
                                className="w-full h-14 bg-[#111811] text-white font-bold rounded-2xl shadow-xl hover:bg-[#a5be31] hover:text-[#111811] transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                                type="submit"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <span>Cambiar Contraseña</span>
                                        <span className="material-symbols-outlined">check_circle</span>
                                    </>
                                )}
                            </button>

                            <div className="flex justify-center">
                                <Link to="/login" className="text-sm font-bold text-gray-500 hover:text-[#111811] transition-colors flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                                    Volver al inicio de sesión
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
