import React from 'react';
import { Phone, Mail, MapPin, Calendar, Clock, Clipboard, FileText, Plus, Search, Filter } from 'lucide-react';

const Patients: React.FC = () => {
    return (
        <div className="p-8 space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold">Patient Management</h2>
                    <p className="text-slate-500 font-medium">Manage patient records, history and treatments.</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Filter patients..."
                            className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary outline-none text-sm transition-all"
                        />
                    </div>
                    <button className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 hover:text-primary transition-all">
                        <Filter size={20} />
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Patient Profile Card (Detailed view of selected patient) */}
                <div className="xl:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm sticky top-8">
                        <div className="bg-gradient-to-r from-primary to-blue-600 h-32 relative">
                            <div className="absolute -bottom-12 left-8">
                                <div className="w-24 h-24 rounded-3xl bg-white p-1 shadow-xl">
                                    <div className="w-full h-full rounded-2xl bg-slate-100 flex items-center justify-center text-primary overflow-hidden">
                                        <img src="https://ui-avatars.com/api/?name=Maria+Garcia&background=0D8ABC&color=fff&size=128" alt="Maria Garcia" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="pt-16 p-8 space-y-6">
                            <div>
                                <h3 className="text-2xl font-bold">Maria Garcia</h3>
                                <p className="text-slate-500 text-sm font-medium">Patient since May 2022 • <span className="text-primary font-bold">VIP</span></p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <InfoItem icon={<Phone size={14} />} label="Phone" value="+1 555-0123" />
                                <InfoItem icon={<Mail size={14} />} label="Email" value="m.garcia@email.com" />
                                <InfoItem icon={<Calendar size={14} />} label="Born" value="Jun 12, 1988" />
                                <InfoItem icon={<MapPin size={14} />} label="City" value="New York, NY" />
                            </div>

                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                                <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400 mb-4">Quick Actions</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <QuickActionButton icon={<Plus size={16} />} label="New Note" />
                                    <QuickActionButton icon={<FileText size={16} />} label="Reports" />
                                    <QuickActionButton icon={<Clock size={16} />} label="History" />
                                    <QuickActionButton icon={<Clipboard size={16} />} label="Docs" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Treatment History & Future Sessions */}
                <div className="xl:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-bold">Clinical History</h3>
                            <button className="text-primary font-bold text-sm">+ Add Entry</button>
                        </div>

                        <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
                            <HistoryEntry
                                date="Feb 10, 2026"
                                title="Periodontal Cleaning"
                                desc="Deep scaling and root planing performed on lower left quadrant. Patient tolerated well."
                                type="clinical"
                            />
                            <HistoryEntry
                                date="Jan 15, 2026"
                                title="Initial Consultation"
                                desc="Comprehensive exam, X-rays taken. Identified 3 cavities in upper molars."
                                type="exam"
                            />
                            <HistoryEntry
                                date="Dec 20, 2025"
                                title="Emergency Visit"
                                desc="Pain in tooth 46. Root canal suggested. Prescribed antibiotics."
                                type="urgent"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SummaryCard title="Ongoing Treatments" count={3} list={['Periodontal', 'Invisalign', 'Whitening']} color="bg-blue-500" />
                        <SummaryCard title="Pending Appointments" count={1} list={['Crown Fitting - Feb 25']} color="bg-orange-500" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const InfoItem: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
    <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-slate-400">
            {icon} <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
        </div>
        <p className="text-sm font-bold truncate">{value}</p>
    </div>
);

const QuickActionButton: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
    <button className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-bold hover:bg-primary hover:text-white transition-all group">
        <span className="text-slate-400 group-hover:text-white">{icon}</span>
        {label}
    </button>
);

const HistoryEntry: React.FC<{ date: string; title: string; desc: string; type: string }> = ({ date, title, desc, type }) => (
    <div className="pl-10 relative group">
        <div className={`absolute left-2.5 top-2 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 z-10 
      ${type === 'clinical' ? 'bg-primary shadow-[0_0_8px_rgba(19,127,236,0.5)]' : ''}
      ${type === 'exam' ? 'bg-emerald-500' : ''}
      ${type === 'urgent' ? 'bg-red-500' : ''}
    `}></div>
        <div className="p-5 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl group-hover:bg-white dark:group-hover:bg-slate-800 border border-transparent group-hover:border-slate-100 dark:group-hover:border-slate-700 transition-all cursor-pointer">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">{date}</span>
            <h4 className="font-bold text-slate-900 dark:text-white mb-1">{title}</h4>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">{desc}</p>
        </div>
    </div>
);

const SummaryCard: React.FC<{ title: string; count: number; list: string[]; color: string }> = ({ title, count, list, color }) => (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400">{title}</h4>
            <span className={`px-2 py-0.5 ${color} text-white rounded-lg text-[10px] font-bold`}>{count}</span>
        </div>
        <ul className="space-y-3">
            {list.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm font-bold">
                    <ChevronRight size={14} className="text-slate-400" />
                    {item}
                </li>
            ))}
        </ul>
    </div>
);

import { ChevronRight } from 'lucide-react';
export default Patients;
