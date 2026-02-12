import { useState } from 'react';
import {
    LayoutDashboard,
    Users,
    Calendar,
    CreditCard,
    Microscope,
    BarChart3,
    Search,
    Bell,
    Plus
} from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
    const [isSidebarOpen] = useState(true);

    const navItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Panel Principal' },
        { id: 'patients', icon: Users, label: 'Pacientes' },
        { id: 'appointments', icon: Calendar, label: 'Agenda' },
        { id: 'financials', icon: CreditCard, label: 'Pagos y Finanzas' },
        { id: 'periodontogram', icon: Microscope, label: 'Periodontograma' },
        { id: 'reports', icon: BarChart3, label: 'Reportes' },
    ];

    return (
        <div className="app-scale-wrapper flex h-full bg-[#F4F4F0] font-sans text-slate-800">
            {/* Sidebar - Ahora con h-full real para que ocupe todo el alto escalado */}
            <aside className={`bg-white border-r border-slate-200 transition-all duration-300 flex flex-col z-30 h-full ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
                <div className="p-6 flex items-center gap-3">
                    <div className="min-w-[40px] h-10 bg-[#137fec] rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                        <Plus size={24} />
                    </div>
                    {isSidebarOpen && (
                        <h1 className="font-bold text-xl tracking-tight text-[#137fec]">Dental Pro</h1>
                    )}
                </div>

                <nav className="flex-1 px-4 space-y-1.5 mt-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group ${isActive
                                    ? 'bg-[#137fec] text-white shadow-lg shadow-blue-500/30 font-semibold'
                                    : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                            >
                                <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#137fec]'} />
                                {isSidebarOpen && <span className="text-sm">{item.label}</span>}
                            </button>
                        );
                    })}
                </nav>

                {isSidebarOpen && (
                    <div className="p-4 mx-4 mb-4 bg-blue-50 rounded-2xl border border-blue-100">
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Mejorar Plan</p>
                        <p className="text-[11px] text-slate-500 font-medium mb-3">Obtén más espacio para Rayos X</p>
                        <button className="w-full py-2 bg-[#137fec] text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-sm">
                            Ser Premium
                        </button>
                    </div>
                )}

                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center gap-3 px-2 py-2">
                        <div className="min-w-[40px] h-10 rounded-full bg-slate-200 overflow-hidden ring-2 ring-blue-500/20 text-[10px] flex items-center justify-center font-bold text-slate-400">
                            LR
                        </div>
                        {isSidebarOpen && (
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-bold truncate">Dr. Lucas Román</p>
                                <p className="text-[11px] text-slate-400 font-medium truncate">Administrador</p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 flex items-center justify-between px-8 z-20">
                    <div className="flex-1 max-w-xl">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#137fec] transition-colors" size={18} />
                            <input
                                className="w-full pl-11 pr-4 py-2 bg-slate-50 border-none rounded-2xl ring-1 ring-slate-200 focus:ring-2 focus:ring-[#137fec] outline-none transition-all text-xs"
                                placeholder="Buscar pacientes..."
                                type="text"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-all">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="w-9 h-9 rounded-full bg-slate-100 ring-2 ring-blue-100 overflow-hidden">
                            <img src="https://ui-avatars.com/api/?name=Lucas+Roman&background=137fec&color=fff" alt="User" />
                        </div>
                    </div>
                </header>

                {/* Main View - Asegurando que haga scroll correctamente dentrod del escalado */}
                <main className="flex-1 overflow-y-auto bg-[#F4F4F0]/50 relative">
                    {children}
                </main>
            </div>
        </div>
    );
};
