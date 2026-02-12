import React from 'react';
import { TrendingUp, UserPlus, DollarSign, Calendar as CalendarIcon, Eye, Edit, FileEdit, Link } from 'lucide-react';

const Dashboard: React.FC = () => {
    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 rounded-3xl bg-gradient-to-br from-primary to-blue-600 text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-blue-100 text-sm font-medium mb-1">Today's Appointments</p>
                        <h3 className="text-4xl font-bold">12</h3>
                        <div className="mt-4 flex items-center gap-1 text-xs text-blue-100">
                            <TrendingUp size={14} />
                            <span>8% increase from yesterday</span>
                        </div>
                    </div>
                    <CalendarIcon className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform" />
                </div>

                <StatCard
                    icon={<FileEdit className="text-orange-600" size={24} />}
                    iconBg="bg-orange-100 dark:bg-orange-500/10"
                    badge="Attention"
                    badgeColor="text-orange-600 bg-orange-50"
                    label="Pending Payments"
                    value="$1,450"
                    subtext="From 5 different patients"
                />

                <StatCard
                    icon={<UserPlus className="text-teal-600" size={24} />}
                    iconBg="bg-teal-100 dark:bg-teal-500/10"
                    badge="+12%"
                    badgeColor="text-teal-600 bg-teal-50"
                    label="New Patients"
                    value="24"
                    subtext="Total registered this month"
                />

                <StatCard
                    icon={<DollarSign className="text-indigo-600" size={24} />}
                    iconBg="bg-indigo-100 dark:bg-indigo-500/10"
                    label="Total Revenue"
                    value="$45,800"
                    subtext="YTD Performance"
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Left Column: Recent Patients & Notes */}
                <div className="xl:col-span-8 space-y-8">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <h2 className="font-bold text-xl">Recent Patients</h2>
                            <button className="text-primary text-sm font-bold hover:underline">View All</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase tracking-wider">
                                        <th className="px-6 py-4 font-semibold">Patient Name</th>
                                        <th className="px-6 py-4 font-semibold">Treatment</th>
                                        <th className="px-6 py-4 font-semibold">Last Visit</th>
                                        <th className="px-6 py-4 font-semibold">Status</th>
                                        <th className="px-6 py-4 font-semibold text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    <PatientRow name="Sofia Chen" initials="SC" treatment="Root Canal" date="Oct 24, 2023" status="In Progress" statusColor="bg-blue-100 text-blue-800" />
                                    <PatientRow name="Marcus V." initials="MV" treatment="Cleaning" date="Oct 23, 2023" status="Completed" statusColor="bg-green-100 text-green-800" />
                                    <PatientRow name="Elena L." initials="EL" treatment="Orthodontics" date="Oct 21, 2023" status="Scheduled" statusColor="bg-orange-100 text-orange-800" />
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <FileEdit className="text-primary" size={24} />
                            <h2 className="font-bold text-xl">Quick Notes</h2>
                        </div>
                        <textarea
                            className="w-full h-32 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl p-4 text-sm focus:ring-1 focus:ring-primary outline-none resize-none transition-all"
                            placeholder="Click here to add a clinical note or reminder for the team..."
                        />
                        <div className="mt-4 flex justify-between items-center">
                            <div className="flex gap-2">
                                <button className="p-2.5 text-slate-400 hover:text-primary transition-colors rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"><Link size={18} /></button>
                            </div>
                            <button className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:shadow-lg transition-all active:scale-95">Save Note</button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Agenda */}
                <div className="xl:col-span-4">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-full">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex justify-between items-center mb-1">
                                <h2 className="font-bold text-xl">Agenda del Día</h2>
                                <span className="text-xs font-bold text-slate-400">Oct 25, 2023</span>
                            </div>
                            <p className="text-sm text-slate-500">You have 12 appointments today</p>
                        </div>
                        <div className="flex-1 p-6 space-y-6">
                            <AgendaItem time="09:00" name="Sofia Chen" spec="Root Canal - Phase 2" status="In Progress" color="border-primary" />
                            <AgendaItem time="10:30" name="Marcus V." spec="Deep Cleaning" status="Arrived" color="border-teal-500" />
                            <AgendaItem time="11:15" name="Elena L." spec="Orthodontics" status="Pending" color="border-slate-200 dashed" />
                        </div>
                        <div className="p-6">
                            <button className="w-full py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all active:scale-95">
                                <CalendarIcon size={18} />
                                Manage Calendar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface StatCardProps {
    icon: React.ReactNode;
    iconBg: string;
    badge?: string;
    badgeColor?: string;
    label: string;
    value: string;
    subtext: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, iconBg, badge, badgeColor, label, value, subtext }) => (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all group active:scale-[0.98]">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 ${iconBg} rounded-2xl`}>{icon}</div>
            {badge && <span className={`text-[10px] font-bold ${badgeColor} px-2 py-1 rounded-lg`}>{badge}</span>}
        </div>
        <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
        <h3 className="text-3xl font-bold dark:text-white">{value}</h3>
        <p className="mt-1 text-xs text-slate-400">{subtext}</p>
    </div>
);

const PatientRow: React.FC<{ name: string; initials: string; treatment: string; date: string; status: string; statusColor: string }> = ({ name, initials, treatment, date, status, statusColor }) => (
    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group">
        <td className="px-6 py-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-sm font-bold group-hover:bg-primary group-hover:text-white transition-colors uppercase">{initials}</div>
                <span className="font-bold text-sm tracking-tight">{name}</span>
            </div>
        </td>
        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{treatment}</td>
        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-medium">{date}</td>
        <td className="px-6 py-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider ${statusColor}`}>{status}</span>
        </td>
        <td className="px-6 py-4 text-center">
            <div className="flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-slate-400 hover:text-primary transition-colors"><Eye size={18} /></button>
                <button className="p-2 text-slate-400 hover:text-primary transition-colors"><Edit size={18} /></button>
            </div>
        </td>
    </tr>
);

const AgendaItem: React.FC<{ time: string; name: string; spec: string; status: string; color: string }> = ({ time, name, spec, status, color }) => (
    <div className="flex gap-4 group">
        <div className="flex flex-col items-center">
            <div className="text-sm font-bold text-slate-400">{time}</div>
            <div className="w-0.5 h-full bg-slate-100 dark:bg-slate-800 my-1"></div>
        </div>
        <div className={`flex-1 p-4 rounded-3xl bg-slate-50/50 dark:bg-slate-800/30 border-l-[6px] ${color}`}>
            <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-sm">{name}</h4>
                <span className="text-[9px] font-bold uppercase tracking-widest text-primary">{status}</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">{spec}</p>
        </div>
    </div>
);

export default Dashboard;
