import React, { useState } from 'react';
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
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'patients', icon: Users, label: 'Patients' },
        { id: 'appointments', icon: Calendar, label: 'Appointments' },
        { id: 'financials', icon: CreditCard, label: 'Payments' },
        { id: 'periodontogram', icon: Microscope, label: 'Periodontogram' },
        { id: 'reports', icon: BarChart3, label: 'Reports' },
    ];

    return (
        <div className="flex h-screen w-full bg-[#F0F7FF] dark:bg-slate-950 overflow-hidden font-sans text-slate-900 dark:text-slate-100">
            {/* Sidebar */}
            <aside className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col z-30 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
                <div className="p-6 flex items-center gap-3">
                    <div className="min-w-[40px] h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <Plus size={24} />
                    </div>
                    {isSidebarOpen && (
                        <h1 className="font-bold text-xl tracking-tight text-primary">Dental Pro</h1>
                    )}
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive
                                    ? 'bg-primary text-white shadow-lg shadow-primary/30 font-semibold'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <Icon size={22} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary'} />
                                {isSidebarOpen && <span>{item.label}</span>}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3 px-2 py-2">
                        <div className="min-w-[40px] h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden ring-2 ring-primary/20">
                            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQjw8AGQ4dRa6BgwvTfp0d_LOpBo-3VQUUzpCHia_ln0dR_4YsrSDi2ht5zVfMPOXHgNR7lBjCX4nfvcc9yANLme6kHArXogMflVJSQNVgZISV7MxnbPshv9RaKHh941Wnciqhw9rPMJVp6PEV63t3etiG1Eej2rHhieNszaISMAbofQ5V8KX6tjvVXmLNnhJOkhfIeFnbBNhsykgpun5yYyUEu-HUXIdb8Iyw4IwW8NZ_JO7mBaoQsQlAJyPkVqzHCYnTUB0G3xc" alt="User" />
                        </div>
                        {isSidebarOpen && (
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-bold truncate">Dr. Lucas Román</p>
                                <p className="text-xs text-slate-500 truncate">Orthodontist</p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 z-20">
                    <div className="flex-1 max-w-xl">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                className="w-full pl-12 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800/50 border-none rounded-2xl ring-1 ring-slate-200 dark:ring-slate-800 focus:ring-2 focus:ring-primary outline-none transition-all"
                                placeholder="Search patients, records, or tools..."
                                type="text"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
                            <Bell size={22} />
                            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                        </button>
                        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>
                        <button
                            className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95"
                            onClick={() => setActiveTab('patients')}
                        >
                            <Plus size={20} />
                            New Patient
                        </button>
                    </div>
                </header>

                {/* Main View */}
                <main className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-slate-950/20">
                    {children}
                </main>
            </div>
        </div>
    );
};
