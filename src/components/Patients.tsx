import React, { useState } from 'react';
import {
    Printer,
    FileText,
    Plus,
    Edit2,
    UserPlus,
    AlertCircle,
    Upload,
    Image as ImageIcon,
    DollarSign,
    Clock,
    Users,
    Microscope
} from 'lucide-react';

const Patients: React.FC = () => {
    const [activeSubTab, setActiveSubTab] = useState('Timeline');

    return (
        <div className="p-8 h-full space-y-8 animate-in fade-in duration-500">
            {/* Top Header - Patient Management Header */}
            <header className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#137fec] rounded-xl flex items-center justify-center text-white shadow-lg">
                        <Users size={24} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black italic tracking-tighter text-slate-800">Panel de Pacientes</h2>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Gestión Clínica Avanzada</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <ActionButton icon={<Printer size={16} />} label="Imprimir Historia" />
                    <ActionButton icon={<FileText size={16} />} label="Nueva Receta" />
                    <button className="bg-[#137fec] hover:bg-blue-600 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 active:scale-95">
                        <Plus size={18} />
                        Nuevo Tratamiento
                    </button>
                </div>
            </header>

            {/* Patient Profile Card (Profile Info Area) */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm flex flex-col md:flex-row items-center gap-10">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-slate-50 overflow-hidden shadow-xl ring-2 ring-blue-100">
                        <img src="https://ui-avatars.com/api/?name=Maria+Garcia&background=137fec&color=fff&size=128" alt="Maria" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white"></div>
                </div>

                <div className="flex-1 space-y-4 text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <h3 className="text-3xl font-black italic tracking-tighter text-slate-800">Maria Garcia</h3>
                        <span className="px-4 py-1.5 bg-red-50 text-red-600 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border border-red-100">
                            <AlertCircle size={12} /> Alergia: Penicilina
                        </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <ProfileStat label="EDAD" value="34 Años" />
                        <ProfileStat label="GRUPO SANGUÍNEO" value="O+" />
                        <ProfileStat label="ÚLTIMA VISITA" value="15 Ene, 2026" />
                        <ProfileStat label="ID PACIENTE" value="#DP-99283" color="text-[#137fec]" />
                    </div>
                </div>

                <div className="flex gap-3">
                    <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-[#137fec] transition-colors"><Edit2 size={18} /></button>
                    <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-[#137fec] transition-colors"><UserPlus size={18} /></button>
                </div>
            </div>

            {/* Sub-navigation Tabs */}
            <div className="border-b border-slate-200">
                <nav className="flex gap-10">
                    {['Timeline', 'Odontograma', 'Periodontograma', 'Documentos', 'Presupuesto'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveSubTab(tab)}
                            className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeSubTab === tab ? 'text-[#137fec]' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {tab}
                            {activeSubTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#137fec] rounded-full"></div>}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">

                {/* Left Column: Timeline */}
                <div className="xl:col-span-8 space-y-8">
                    <div className="relative pl-8 space-y-8 before:absolute before:left-0 before:top-4 before:bottom-0 before:w-[2px] before:bg-slate-100 italic">

                        <div className="relative">
                            <div className="absolute -left-10 top-2 w-4 h-4 rounded-full bg-[#137fec] border-4 border-white shadow-[0_0_0_2px_rgba(19,127,236,0.1)] z-10"></div>
                            <div className="bg-white rounded-[2rem] border border-slate-200/60 p-8 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="text-[10px] font-black text-[#137fec] uppercase tracking-widest">15 DE ENERO, 2026</span>
                                        <h4 className="text-xl font-black italic tracking-tight text-slate-800 mt-1">Conducto Radicular - Etapa 1</h4>
                                        <p className="text-slate-500 text-[11px] font-medium mt-1">Atendido por <span className="text-slate-800 font-bold">Dr. Lucas Román</span></p>
                                    </div>
                                    <span className="px-3 py-1 bg-blue-50 text-[#137fec] rounded-lg text-[9px] font-black uppercase tracking-widest">En Curso</span>
                                </div>

                                <div className="bg-slate-50/50 rounded-2xl p-6 mt-6 border border-slate-100">
                                    <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">NOTAS CLÍNICAS</h5>
                                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                        Paciente con dolor agudo en pieza #46. Rayos X mostraron caries profunda llegando a pulpa. Se administró anestesia local. Pulpectomía realizada con éxito. Seguimiento la próxima semana.
                                    </p>
                                </div>

                                <div className="flex gap-8 mt-6 pt-6 border-t border-slate-50 text-slate-400">
                                    <div className="flex items-center gap-2 text-[10px] font-bold">
                                        <Microscope size={14} /> Pieza #46
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-bold">
                                        <Clock size={14} /> 45 min duración
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -left-10 top-2 w-4 h-4 rounded-full bg-slate-200 border-4 border-white z-10"></div>
                            <div className="bg-white rounded-[2rem] border border-slate-200/60 p-8 shadow-sm">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">12 DE DICIEMBRE, 2025</span>
                                        <h4 className="text-xl font-black italic tracking-tight text-slate-800 mt-1">Limpieza de Rutina y Control</h4>
                                        <p className="text-slate-500 text-[11px] font-medium mt-1">Atendido por <span className="text-slate-800 font-bold">Hig. Sara Mills</span></p>
                                    </div>
                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest">Completado</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Imagery & Finance */}
                <div className="xl:col-span-4 space-y-8">

                    <div className="bg-white rounded-[2.5rem] border border-slate-200/60 p-8 shadow-sm space-y-6">
                        <div className="flex justify-between items-center">
                            <h4 className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-800">Imágenes y Rayos X</h4>
                            <button className="text-[10px] font-black text-[#137fec] uppercase tracking-widest hover:underline">Ver Todo</button>
                        </div>

                        <div className="space-y-4">
                            <div className="relative group rounded-3xl overflow-hidden aspect-[4/3] bg-slate-100 border border-slate-200">
                                <img src="https://images.unsplash.com/photo-1579154235828-4519939b940b?auto=format&fit=crop&q=80&w=400" alt="X-Ray" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-5">
                                    <p className="text-white text-xs font-black italic">Radiografía Panorámica</p>
                                    <p className="text-white/70 text-[9px] font-bold">15 de Ene, 2026</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100">
                                    <img src="https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=200" alt="Small X-Ray" className="w-full h-full object-cover opacity-80" />
                                </div>
                                <div className="aspect-square rounded-2xl overflow-hidden bg-emerald-900 flex items-center justify-center">
                                    <ImageIcon size={32} className="text-emerald-400 opacity-40" />
                                </div>
                            </div>

                            <button className="w-full py-6 border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-200 transition-all group">
                                <div className="p-3 bg-blue-50 rounded-2xl text-[#137fec] group-hover:scale-110 transition-transform">
                                    <Upload size={20} />
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subir Nuevo Archivo</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-[#137fec]/5 rounded-[2.5rem] border border-blue-100 p-8 shadow-sm space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#137fec] rounded-xl text-white">
                                <DollarSign size={16} />
                            </div>
                            <h4 className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-800">Resumen Financiero</h4>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-medium text-slate-500">Balance Actual</span>
                                <span className="font-black text-slate-800">$450.00</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-medium text-slate-500">Total Tratamiento</span>
                                <span className="font-black text-slate-800">$1,200.00</span>
                            </div>
                            <div className="w-full bg-blue-100 h-2.5 rounded-full overflow-hidden">
                                <div className="bg-[#137fec] h-full w-[40%] rounded-full shadow-sm shadow-blue-500/20"></div>
                            </div>
                            <button className="w-full py-4 bg-white border border-slate-200 rounded-2xl text-[#137fec] text-[10px] font-black uppercase tracking-widest hover:bg-white/50 transition-all active:scale-95 mt-4">
                                Generar Factura
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

const ActionButton: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
    <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl font-black uppercase tracking-widest text-[10px] text-slate-500 shadow-sm hover:shadow-md transition-all flex items-center gap-3 active:scale-95">
        {icon} {label}
    </button>
);

const ProfileStat: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color = "text-slate-800" }) => (
    <div className="space-y-1">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
        <p className={`text-sm font-black italic tracking-tight ${color}`}>{value}</p>
    </div>
);

export default Patients;
