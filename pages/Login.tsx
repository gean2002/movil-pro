import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [step, setStep] = useState<'email' | 'password'>('email');

    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login, register } = useAuth();

    // Reset state when switching modes
    const handleModeSwitch = (newMode: 'login' | 'register') => {
        setMode(newMode);
        setStep('email');
        setPassword('');
        // Optional: Keep email populated if already typed
    };

    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setStep('password');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password || (mode === 'register' && (!firstName || !lastName))) return;

        setLoading(true);
        try {
            let success;
            if (mode === 'login') {
                success = await login(email, password);
            } else {
                success = await register(email, password, firstName, lastName);
            }

            if (success) {
                alert(mode === 'login' ? '¡Sesión iniciada correctamente!' : '¡Cuenta creada con éxito!');
                navigate('/account');
            } else {
                alert(mode === 'login'
                    ? 'Credenciales incorrectas. Intenta de nuevo.'
                    : 'Error al crear cuenta. Verifica tus datos o intenta con otro correo.');
            }
        } catch (error: any) {
            console.error('Auth error:', error);
            alert(error.message || 'Ocurrió un error. Verifica tus datos.');
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
                            <span className="material-symbols-outlined text-[#a5be31] text-3xl">
                                {mode === 'login'
                                    ? (step === 'email' ? 'person' : 'lock')
                                    : 'person_add'}
                            </span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight mb-3 text-[#111811]">
                            {mode === 'login'
                                ? (step === 'email' ? 'Iniciar Sesión' : 'Ingresa tu Contraseña')
                                : 'Crear Cuenta'}
                        </h1>
                        <p className="text-gray-500 font-medium px-4">
                            {mode === 'login'
                                ? (step === 'email' ? 'Ingresa tu correo para continuar.' : `Hola, ${email}. Por favor ingresa tu contraseña.`)
                                : 'Completa tus datos para registrarte.'}
                        </p>
                    </div>

                    <form onSubmit={step === 'email' && mode === 'login' ? handleEmailSubmit : handleSubmit} className="space-y-6 animate-fade-in">

                        {/* Registration Fields (Only show in register mode) */}
                        {mode === 'register' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-[#111811] uppercase tracking-wider ml-1">Nombre</label>
                                    <input
                                        required
                                        className="w-full h-14 px-4 rounded-2xl border border-gray-100 bg-gray-50 text-[#111811] font-medium focus:outline-none focus:ring-2 focus:ring-[#a5be31] transition-all"
                                        placeholder="Juan"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-[#111811] uppercase tracking-wider ml-1">Apellido</label>
                                    <input
                                        required
                                        className="w-full h-14 px-4 rounded-2xl border border-gray-100 bg-gray-50 text-[#111811] font-medium focus:outline-none focus:ring-2 focus:ring-[#a5be31] transition-all"
                                        placeholder="Pérez"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Email Field (Always visible unless in password step of login) */}
                        {(mode === 'register' || step === 'email') && (
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-[#111811] uppercase tracking-wider ml-1">Correo Electrónico</label>
                                <div className="relative">
                                    <input
                                        required
                                        className="w-full h-14 pl-12 pr-4 rounded-2xl border border-gray-100 bg-gray-50 text-[#111811] font-medium focus:outline-none focus:ring-2 focus:ring-[#a5be31] transition-all"
                                        placeholder="nombre@ejemplo.com"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    // Disable email edit in password step? No, step check handles visibility
                                    />
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">mail</span>
                                </div>
                            </div>
                        )}

                        {/* Password Field */}
                        {(mode === 'register' || step === 'password') && (
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="block text-sm font-bold text-[#111811] uppercase tracking-wider ml-1">Contraseña</label>
                                    {mode === 'login' && (
                                        <Link to="/forgot-password" className="text-xs font-bold text-[#a5be31] hover:underline">
                                            ¿Olvidaste tu contraseña?
                                        </Link>
                                    )}
                                </div>
                                <div className="relative">
                                    <input
                                        required
                                        autoFocus={step === 'password'}
                                        type="password"
                                        className="w-full h-14 pl-12 pr-4 rounded-2xl border border-gray-100 bg-gray-50 text-[#111811] font-medium focus:outline-none focus:ring-2 focus:ring-[#a5be31] transition-all"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">key</span>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
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
                                        <span>{mode === 'login' ? (step === 'email' ? 'Continuar' : 'Iniciar Sesión') : 'Crear Cuenta'}</span>
                                        <span className="material-symbols-outlined">
                                            {mode === 'login' ? (step === 'email' ? 'arrow_forward' : 'login') : 'person_add'}
                                        </span>
                                    </>
                                )}
                            </button>

                            {/* Mode Switcher */}
                            <div className="flex justify-center gap-1 text-sm font-medium text-gray-500">
                                {mode === 'login' ? (
                                    <>
                                        ¿No tienes cuenta?
                                        <button
                                            type="button"
                                            onClick={() => handleModeSwitch('register')}
                                            className="text-[#a5be31] font-bold hover:underline"
                                        >
                                            Regístrate
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        ¿Ya tienes cuenta?
                                        <button
                                            type="button"
                                            onClick={() => handleModeSwitch('login')}
                                            className="text-[#a5be31] font-bold hover:underline"
                                        >
                                            Inicia Sesión
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Back to email (only in login password step) */}
                            {mode === 'login' && step === 'password' && (
                                <button
                                    type="button"
                                    onClick={() => setStep('email')}
                                    className="w-full text-sm font-bold text-gray-400 hover:text-[#111811] transition-colors"
                                    disabled={loading}
                                >
                                    Cambiar correo
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;