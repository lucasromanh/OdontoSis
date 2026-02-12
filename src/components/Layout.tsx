import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Users,
    Calendar,
    CreditCard,
    Microscope,
    BarChart3,
    Search,
    Bell,
    Settings,
    X,
    CheckCircle2,
    Clock,
    LogOut
} from 'lucide-react';
import { ProfileModal } from './ProfileModal';
import { ToastType } from './Notifications';

interface Notification {
    id: string;
    title: string;
    description: string;
    time: string;
    type: 'appointment' | 'payment' | 'cancel' | 'system';
}

interface LayoutProps {
    children: React.ReactNode;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    addToast?: (msg: string, type: ToastType) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, searchValue, onSearchChange, addToast }) => {
    const [isSidebarOpen] = useState(true);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>(() => {
        const stored = localStorage.getItem('system_notifications');
        return stored ? JSON.parse(stored) : [
            { id: '1', title: 'Nueva cita agendada', description: 'Ana Garcia - 10:30 AM', time: 'Hace 5m', type: 'appointment' },
            { id: '2', title: 'Pago registrado', description: 'Recibo #FR-2940 por $450', time: 'Hace 1h', type: 'payment' }
        ];
    });

    const [professionalProfile, setProfessionalProfile] = useState(() => {
        const stored = localStorage.getItem('professional_profile');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                return {
                    ...parsed,
                    avatar: parsed.signature || `https://ui-avatars.com/api/?name=${encodeURIComponent(parsed.firstName + ' ' + parsed.lastName)}&background=137fec&color=fff`
                };
            } catch (e) {
                console.error("Error parsing profile in Layout", e);
            }
        }
        return {
            firstName: "Lucas",
            lastName: "Román",
            specialty: "Odontólogo Senior",
            avatar: `https://ui-avatars.com/api/?name=Lucas+Roman&background=137fec&color=fff`
        };
    });

    // Guardar notificaciones
    useEffect(() => {
        localStorage.setItem('system_notifications', JSON.stringify(notifications));
    }, [notifications]);

    // Listener para eventos de sistema
    useEffect(() => {
        const handleNewNotification = (e: any) => {
            const newNotif: Notification = {
                id: Math.random().toString(36).substr(2, 9),
                title: e.detail.title,
                description: e.detail.description,
                time: 'Justo ahora',
                type: e.detail.type || 'system'
            };
            setNotifications(prev => [newNotif, ...prev].slice(0, 10));
        };

        const handleProfileUpdate = (e: any) => {
            const updated = e.detail;
            setProfessionalProfile({
                ...updated,
                avatar: updated.signature || `https://ui-avatars.com/api/?name=${encodeURIComponent(updated.firstName + ' ' + updated.lastName)}&background=137fec&color=fff`
            });
        };

        window.addEventListener('app_notification', handleNewNotification);
        window.addEventListener('profileUpdated', handleProfileUpdate);
        return () => {
            window.removeEventListener('app_notification', handleNewNotification);
            window.removeEventListener('profileUpdated', handleProfileUpdate);
        };
    }, []);

    const navItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Panel Principal' },
        { id: 'patients', icon: Users, label: 'Pacientes' }, // Users is still used here, so it should not be removed from the import list.
        { id: 'appointments', icon: Calendar, label: 'Agenda y Citas' },
        { id: 'financials', icon: CreditCard, label: 'Pagos y Gastos' },
        { id: 'periodontogram', icon: Microscope, label: 'Periodontograma' },
        { id: 'reports', icon: BarChart3, label: 'Reportes y Estadísticas' },
    ];

    const handleNotificationClick = (n: Notification) => {
        if (n.type === 'appointment') setActiveTab('appointments');
        if (n.type === 'payment') setActiveTab('financials');
        addToast?.(`${n.title}: ${n.description}`, 'info');
    };

    return (
        <div className="flex h-screen bg-[#F4F4F0] overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className={`bg-white border-r border-slate-200/60 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-80' : 'w-24'}`}>
                <div className="p-10 pb-12">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 flex items-center justify-center relative group/logo shrink-0">
                            <img src="/src/tmp/logoDiente.png" className="w-full h-full object-contain filter drop-shadow-lg group-hover/logo:scale-110 transition-all duration-500" alt="Aurem Logo" />
                        </div>
                        {isSidebarOpen && (
                            <div className="flex flex-col">
                                <span className="font-black text-3xl tracking-tighter text-[#0f172a] leading-none uppercase italic">Aurem</span>
                                <span className="text-[10px] font-black text-emerald-500 tracking-[0.4em] uppercase mt-2">Intelligence v2</span>
                            </div>
                        )}
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.5rem] transition-all duration-300 group ${activeTab === item.id
                                ? 'bg-slate-50 text-[#137fec] shadow-sm'
                                : 'text-slate-400 hover:bg-slate-50/50 hover:text-slate-600'
                                }`}
                        >
                            <item.icon size={22} className={`${activeTab === item.id ? 'stroke-[2.5px]' : 'stroke-2 group-hover:scale-110'}`} />
                            {isSidebarOpen && <span className={`text-sm font-bold tracking-tight ${activeTab === item.id ? 'opacity-100' : 'opacity-80'}`}>{item.label}</span>}
                        </button>
                    ))}
                </nav>

                {/* Professional Profile in Sidebar - RESTORED & PROMINENT */}
                <div className="p-6 mt-auto">
                    <div
                        onClick={() => setIsProfileModalOpen(true)}
                        className="p-4 rounded-[2.2rem] bg-slate-900 text-white hover:bg-slate-800 transition-all cursor-pointer group flex items-center gap-4 shadow-xl shadow-slate-200"
                    >
                        <div className="w-11 h-11 rounded-2xl overflow-hidden bg-white/10 p-0.5 ring-2 ring-white/10 group-hover:ring-white/30 transition-all">
                            <img src={professionalProfile.avatar} className="w-full h-full object-cover rounded-[0.8rem]" alt="Dr." />
                        </div>
                        {isSidebarOpen && (
                            <div className="flex-1 min-w-0 text-left">
                                <p className="text-[11px] font-black tracking-tight truncate leading-none mb-1">{professionalProfile.firstName} {professionalProfile.lastName}</p>
                                <p className="text-[8px] text-blue-400 font-black uppercase tracking-[0.1em] truncate opacity-80">{professionalProfile.specialty}</p>
                            </div>
                        )}
                        {isSidebarOpen && <Settings size={14} className="text-white/20 group-hover:text-white/60 group-hover:rotate-45 transition-all" />}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-10 flex items-center justify-between z-40">
                    <div className="flex items-center gap-6 flex-1 text-left line-clamp-1">
                        <div className="w-full max-w-md relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#137fec] transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar pacientes, citas..."
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-300"
                                value={searchValue}
                                onChange={(e) => onSearchChange?.(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <button className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#137fec] hover:border-blue-100 hover:shadow-lg transition-all relative">
                                <Bell size={20} />
                                {notifications.length > 0 && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>}
                            </button>

                            {/* Notifications Dropdown */}
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 transform origin-top-right scale-95 group-hover:scale-100">
                                <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-50">
                                    <h5 className="font-black text-[10px] uppercase tracking-widest text-slate-400">Notificaciones</h5>
                                    {notifications.length > 0 && (
                                        <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">{notifications.length} Totales</span>
                                    )}
                                </div>
                                <div className="space-y-2 max-h-[350px] overflow-y-auto custom-scrollbar pr-1">
                                    {notifications.length > 0 ? (
                                        notifications.map(n => (
                                            <div
                                                key={n.id}
                                                onClick={() => handleNotificationClick(n)}
                                                className="flex gap-4 p-3.5 hover:bg-blue-50/50 rounded-2xl transition-all cursor-pointer group/item text-left border border-transparent hover:border-blue-100/50"
                                            >
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${n.type === 'appointment' ? 'bg-blue-100 text-blue-600' :
                                                    n.type === 'payment' ? 'bg-emerald-100 text-emerald-600' :
                                                        n.type === 'cancel' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'
                                                    }`}>
                                                    {n.type === 'appointment' ? <Calendar size={18} /> :
                                                        n.type === 'payment' ? <CreditCard size={18} /> :
                                                            n.type === 'cancel' ? <X size={18} /> : <CheckCircle2 size={18} />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[11px] font-black text-slate-800 leading-tight mb-1 truncate">{n.title}</p>
                                                    <p className="text-[10px] text-slate-500 leading-snug line-clamp-2">{n.description}</p>
                                                    <div className="flex items-center gap-1.5 mt-2 opacity-50 group-hover/item:opacity-100 transition-opacity">
                                                        <Clock size={10} className="text-slate-400" />
                                                        <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest">{n.time}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-12 text-center opacity-40">
                                            <Bell size={40} className="mx-auto mb-4 text-slate-200" />
                                            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Todo al día</p>
                                        </div>
                                    )}
                                </div>
                                {notifications.length > 0 && (
                                    <button
                                        onClick={() => setNotifications([])}
                                        className="w-full mt-4 py-3 text-[9px] font-black uppercase text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all tracking-[0.2em]"
                                    >
                                        VACIAR NOTIFICACIONES
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="relative group">
                            <div
                                onClick={() => setIsProfileModalOpen(true)}
                                className="w-10 h-10 rounded-xl bg-slate-100 ring-2 ring-blue-50 overflow-hidden cursor-pointer shadow-sm group-hover:ring-[#137fec] transition-all flex items-center justify-center bg-white"
                            >
                                <img src={professionalProfile.avatar} className="w-full h-full object-cover" alt="Avatar" />
                            </div>
                            {/* Profile Dropdown */}
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 transform origin-top-right scale-95 group-hover:scale-100">
                                <div className="p-6 bg-slate-50/50 border-b border-slate-100 text-left">
                                    <p className="text-[13px] font-black text-slate-800 leading-none">{professionalProfile.firstName} {professionalProfile.lastName}</p>
                                    <p className="text-[9px] text-[#137fec] font-black uppercase tracking-widest mt-1.5 opacity-80">{professionalProfile.specialty}</p>
                                </div>
                                <div className="p-2">
                                    <button
                                        onClick={() => setIsProfileModalOpen(true)}
                                        className="w-full flex items-center gap-3 px-5 py-3.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50 rounded-2xl transition-all text-left group/btn"
                                    >
                                        <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover/btn:bg-white flex items-center justify-center transition-colors">
                                            <Settings size={16} className="text-slate-400 group-hover/btn:text-[#137fec]" />
                                        </div>
                                        <span>Ajustes de Perfil</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('appointments')}
                                        className="w-full flex items-center gap-3 px-5 py-3.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50 rounded-2xl transition-all text-left group/btn"
                                    >
                                        <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover/btn:bg-white flex items-center justify-center transition-colors">
                                            <Calendar size={16} className="text-slate-400 group-hover/btn:text-[#137fec]" />
                                        </div>
                                        <span>Ver mi Agenda</span>
                                    </button>
                                    <div className="h-[1px] bg-slate-100 my-2 mx-4"></div>
                                    <button
                                        onClick={() => setActiveTab('logout')}
                                        className="w-full flex items-center gap-3 px-5 py-3.5 text-[11px] font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-all text-left group/btn"
                                    >
                                        <div className="w-8 h-8 rounded-xl bg-red-100/50 group-hover/btn:bg-white flex items-center justify-center transition-colors">
                                            <LogOut size={16} className="text-red-500" />
                                        </div>
                                        <span>Cerrar Sesión</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main View */}
                <main className="flex-1 overflow-y-auto bg-[#F4F4F0]/50 relative scroll-smooth">
                    <div className="p-0 animate-in fade-in duration-700">
                        {children}
                    </div>
                </main>
            </div>
            {isProfileModalOpen && (
                <ProfileModal
                    onClose={() => setIsProfileModalOpen(false)}
                    addToast={addToast}
                />
            )}
        </div>
    );
};
