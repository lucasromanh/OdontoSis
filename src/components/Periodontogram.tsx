import React from 'react';
import { Save, Printer, ArrowRightLeft, Microscope, Info, AlertTriangle, Settings as SettingsIcon } from 'lucide-react';

const Periodontogram: React.FC = () => {
    return (
        <div className="p-6 space-y-6 animate-in slide-in-from-bottom-4 duration-700">
            {/* Header Info */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                        <Microscope size={28} />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold">Maria Garcia</h2>
                            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-500 uppercase tracking-widest">ID: 2527851</span>
                        </div>
                        <p className="text-slate-500 font-medium mt-1">Advanced Periodontogram • Last Updated: Feb 11, 2026</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <ActionButton icon={<Printer size={18} />} label="Print" />
                    <ActionButton icon={<ArrowRightLeft size={18} />} label="Compare" />
                    <button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2 active:scale-95">
                        <Save size={18} />
                        Save Analysis
                    </button>
                </div>
            </div>

            {/* Analysis Grid */}
            <div className="space-y-6">
                {/* Upper Arch */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex items-center gap-2">
                        <div className="w-2 h-6 bg-primary rounded-full"></div>
                        <h3 className="font-bold text-lg">Upper Arch Analysis</h3>
                    </div>
                    <div className="overflow-x-auto p-6">
                        <PeriodontalTable arch="Upper" teeth={[18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28]} />
                    </div>
                </div>

                {/* Graphical Representation */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm relative overflow-hidden">
                    <div className="absolute top-6 left-8 flex items-center gap-2">
                        <Info size={18} className="text-slate-400" />
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Interactive Mapping</span>
                    </div>

                    <div className="h-64 mt-8 flex items-center justify-around relative">
                        {/* Grid overlay */}
                        <div className="absolute inset-0 grid grid-cols-16 opacity-[0.03] pointer-events-none">
                            {[...Array(16)].map((_, i) => <div key={i} className="border-r border-slate-900 h-full"></div>)}
                        </div>

                        {/* Tooth Visuals */}
                        {[18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28].map((t) => (
                            <ToothGraphic key={t} number={t} status={t === 16 ? 'warning' : t === 26 ? 'implant' : 'normal'} />
                        ))}

                        {/* Spline Overlay (Mock SVG) */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1000 200">
                            <path d="M 0,100 Q 100,110 200,120 T 400,110 T 600,115 T 800,105 T 1000,110" fill="transparent" stroke="#EF4444" strokeWidth="2" strokeDasharray="4 2" />
                            <path d="M 0,140 Q 100,150 200,180 T 400,150 T 600,160 T 800,145 T 1000,155" fill="rgba(19, 127, 236, 0.05)" stroke="#137fec" strokeWidth="2" />
                        </svg>
                    </div>

                    <div className="flex justify-center gap-8 mt-6">
                        <LegendItem color="bg-red-500" label="Gingival Margin" />
                        <LegendItem color="bg-primary" label="Bone Level" />
                        <LegendItem color="bg-red-500/20" label="Pocket > 4mm" border="border border-red-500/50" />
                        <LegendItem color="bg-slate-200" label="Implant" icon={<SettingsIcon size={10} />} />
                    </div>
                </div>

                {/* Lower Arch */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex items-center gap-2">
                        <div className="w-2 h-6 bg-slate-400 rounded-full"></div>
                        <h3 className="font-bold text-lg">Lower Arch Analysis</h3>
                    </div>
                    <div className="overflow-x-auto p-6">
                        <PeriodontalTable arch="Lower" teeth={[48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38]} />
                    </div>
                </div>
            </div>

            {/* Summary Footer */}
            <footer className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex items-center justify-between">
                <div className="flex gap-8">
                    <Metric label="Bleeding Index" value="12%" color="text-red-500" />
                    <Metric label="Plaque Index" value="18%" color="text-primary" />
                    <Metric label="Avg. Pocket Depth" value="2.8mm" color="text-slate-700" />
                </div>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Save size={14} className="text-teal-500" /> Auto-saved: 14:02:45</span>
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">v4.2.1-stable</span>
                </div>
            </footer>
        </div>
    );
};

const ActionButton: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
    <button className="px-5 py-3 text-sm font-bold border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2 active:scale-95">
        {icon} {label}
    </button>
);

const Metric: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
    <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${color.replace('text', 'bg')}`}></div>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}:</span>
        <span className={`text-lg font-black ${color}`}>{value}</span>
    </div>
);

const ToothGraphic: React.FC<{ number: number; status: 'normal' | 'warning' | 'implant' }> = ({ number, status }) => (
    <div className="flex flex-col items-center">
        <div className={`
      w-10 h-16 rounded-b-xl relative mb-2 flex items-center justify-center transition-all cursor-pointer hover:scale-110
      ${status === 'warning' ? 'bg-red-50 border-2 border-red-500 shadow-lg shadow-red-500/20' : ''}
      ${status === 'implant' ? 'bg-slate-200 dark:bg-slate-700' : 'bg-slate-100 dark:bg-slate-800/50'}
    `}>
            {status === 'implant' && <SettingsIcon size={16} className="text-slate-400" />}
            {status === 'warning' && <AlertTriangle size={16} className="text-red-500" />}
        </div>
        <span className={`text-[10px] font-bold ${status === 'warning' ? 'text-red-500' : 'text-slate-400'}`}>{number} {status === 'implant' ? '(IMP)' : ''}</span>
    </div>
);

const LegendItem: React.FC<{ color: string; label: string; border?: string; icon?: React.ReactNode }> = ({ color, label, border = '', icon }) => (
    <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${color} ${border} flex items-center justify-center`}>{icon}</div>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
    </div>
);

const PeriodontalTable: React.FC<{ arch: string, teeth: number[] }> = ({ teeth }) => (
    <table className="w-full border-collapse">
        <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="p-3 text-left text-[10px] font-black uppercase text-slate-400 border-b border-slate-200 dark:border-slate-800 w-40">Parameter</th>
                {teeth.map(t => (
                    <th key={t} className={`p-2 text-center text-xs font-bold border-b border-slate-200 dark:border-slate-800 ${t === 16 || t === 46 ? 'text-primary' : 'text-slate-400'}`}>{t}</th>
                ))}
            </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            <PeriodontalRow label="Movilidad" value="0" teeth={teeth.length} />
            <PeriodontalRow label="Sangrado/Placa" type="dots" teeth={teeth.length} />
            <PeriodontalRow label="Margen Gingival" type="triple" teeth={teeth.length} />
            <PeriodontalRow label="Prof. Sondaje" type="triple" highlighted={true} teeth={teeth.length} />
        </tbody>
    </table>
);

const PeriodontalRow: React.FC<{ label: string; value?: string; type?: 'normal' | 'dots' | 'triple'; teeth: number; highlighted?: boolean }> = ({ label, type = 'normal', teeth, highlighted }) => (
    <tr className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
        <td className="p-3 text-[10px] font-bold uppercase text-slate-500 bg-slate-50/30 dark:bg-slate-800/10 border-r border-slate-200 dark:border-slate-800">{label}</td>
        {[...Array(teeth)].map((_, i) => (
            <td key={i} className="p-0 text-center border-r border-slate-100 dark:border-slate-800">
                {type === 'normal' && <input className="w-full h-8 text-center text-xs font-medium focus:bg-primary/5 outline-none" defaultValue="0" />}
                {type === 'dots' && (
                    <div className="flex justify-center gap-1.5 py-2">
                        <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                        <div className="w-2 h-2 rounded-full bg-primary/50"></div>
                    </div>
                )}
                {type === 'triple' && (
                    <div className={`flex h-8 ${highlighted ? 'font-bold text-red-500' : ''}`}>
                        <input className="w-1/3 h-full text-center text-[10px] border-none focus:bg-primary/5 outline-none" defaultValue="1" />
                        <input className="w-1/3 h-full text-center text-[10px] border-x border-slate-100 dark:border-slate-800 focus:bg-primary/5 outline-none" defaultValue="2" />
                        <input className="w-1/3 h-full text-center text-[10px] border-none focus:bg-primary/5 outline-none" defaultValue="1" />
                    </div>
                )}
            </td>
        ))}
    </tr>
);


export default Periodontogram;
