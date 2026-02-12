import React, { useState } from 'react';
import { Lock, Mail, ShieldCheck, Zap, ArrowRight, Star } from 'lucide-react';

interface LoginProps {
    onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simular delay de autenticación
        setTimeout(() => {
            setIsLoading(false);
            onLogin();
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row overflow-x-hidden font-sans">
            {/* Left Panel: Branding & Visuals (Hidden on mobile, visible from LG) */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#0f172a] relative overflow-hidden flex-col justify-between p-16">
                {/* Abstract Background Shapes */}
                <div className="absolute top-0 right-0 w-full h-full opacity-30">
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[100px]"></div>
                </div>

                {/* Top Branding - MASIVE LOGO */}
                <div className="relative z-10 flex items-center gap-8">
                    <div className="w-36 h-36 flex items-center justify-center relative group/logo">
                        <img src="/src/tmp/logoDiente.png" className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(52,211,153,0.3)] group-hover/logo:scale-110 transition-transform duration-700" alt="Aurem Logo" />
                    </div>
                    <div>
                        <h1 className="text-white font-black text-5xl tracking-tighter uppercase leading-none">Aurem</h1>
                        <p className="text-emerald-400 text-xs font-black uppercase tracking-[0.5em] mt-2">Dental Intelligence</p>
                    </div>
                </div>

                {/* Hero Text */}
                <div className="relative z-10 max-w-xl">
                    <h2 className="text-6xl font-black text-white leading-[1.1] tracking-tight mb-8">
                        Gestión de <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 pr-4">Próxima Clase</span>
                    </h2>
                    <p className="text-slate-400 text-lg font-medium leading-relaxed mb-12">
                        La plataforma que redefine la eficiencia en clínicas odontológicas.
                        Tecnología de vanguardia para profesionales que exigen lo mejor.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4 group cursor-default">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-400 group-hover:text-slate-900 transition-all">
                                <ShieldCheck size={22} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-base">Privacidad de Élite</h4>
                                <p className="text-slate-500 text-sm">Cifrado de grado militar para sus historias clínicas.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 group cursor-default">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-400 group-hover:text-slate-900 transition-all">
                                <Zap size={22} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-base">Workflow Inteligente</h4>
                                <p className="text-slate-500 text-sm">Automatice su agenda y facturación en segundos.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trust Proof */}
                <div className="relative z-10 pt-10 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map(i => (
                                <img key={i} src={`https://i.pravatar.cc/100?img=${i + 10}`} className="w-8 h-8 rounded-full border-2 border-[#0f172a]" alt="user" />
                            ))}
                        </div>
                        <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">+3,000 DOCTORES</span>
                    </div>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} className="text-emerald-400" fill="currentColor" />)}
                    </div>
                </div>
            </div>

            {/* Right Panel: Form Section (Full width on mobile) */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 py-12 lg:p-24 bg-white">
                <div className="max-w-md w-full">
                    {/* Brand Mobile Icon - MASIVE */}
                    <div className="lg:hidden flex items-center gap-6 mb-12">
                        <div className="w-24 h-24 flex items-center justify-center">
                            <img src="/src/tmp/logoDiente.png" className="w-full h-full object-contain drop-shadow-2xl" alt="Aurem Logo" />
                        </div>
                        <h1 className="text-slate-900 font-black text-4xl tracking-tighter uppercase">Aurem</h1>
                    </div>

                    <div className="mb-12">
                        <h3 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Bienvenido</h3>
                        <p className="text-slate-400 font-medium">Por favor, ingrese sus datos de acceso ministerial.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-600 pl-4 block">
                                Correo Institucional
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="doctor@aurem.com"
                                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-300"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-600 block">
                                    Contraseña
                                </label>
                                <button type="button" className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-500 transition-colors">¿Problemas?</button>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-300"
                                />
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center gap-3 pl-4">
                            <input
                                type="checkbox"
                                id="remLogin"
                                className="w-4 h-4 rounded border-slate-200 text-emerald-500 focus:ring-emerald-500/20 cursor-pointer"
                            />
                            <label htmlFor="remLogin" className="text-xs font-bold text-slate-400 cursor-pointer select-none uppercase tracking-widest">Recordar sesión</label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-5 rounded-[2rem] bg-[#0f172a] text-white font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 hover:bg-emerald-600 transform active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-4 relative overflow-hidden group ${isLoading ? 'cursor-not-allowed opacity-80' : ''}`}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    <span className="text-white">Verificando...</span>
                                </div>
                            ) : (
                                <>
                                    <span className="text-white relative z-10 tracking-[0.25em]">Acceso Aurem</span>
                                    <ArrowRight size={18} className="text-emerald-400 group-hover:translate-x-1 group-hover:text-white transition-all" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Support Link */}
                    <div className="mt-16 text-center">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">AUREM Labs &bull; Professional Support</p>
                        <button className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50 hover:text-emerald-600 transition-all">
                            Adquirir Licencia COMERCIAL
                        </button>
                    </div>
                </div>

                {/* Footer Copyright */}
                <div className="mt-auto pt-10 text-center opacity-30">
                    <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400">&copy; 2026 AUREM. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};
