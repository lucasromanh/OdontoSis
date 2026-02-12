import React from 'react';
import { Clock, DollarSign, Upload, FileCheck } from 'lucide-react';
import { ToastType } from './Notifications';

interface TimelineProps {
    treatments: any[];
    addToast?: (msg: string, type: ToastType) => void;
    onGenerateInvoice?: () => void;
}

const Timeline: React.FC<TimelineProps> = ({ treatments, addToast, onGenerateInvoice }) => {
    const totalBalance = treatments.reduce((acc, t) => acc + (t.cost || 0), 0);

    return (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start animate-in fade-in duration-500">
            {/* Left Column: Timeline */}
            <div className="xl:col-span-8 space-y-8">
                {treatments.length === 0 ? (
                    <div className="bg-white rounded-[3rem] border-2 border-dashed border-slate-100 p-20 text-center flex flex-col items-center gap-4">
                        <div className="p-6 bg-slate-50 rounded-full text-slate-300">
                            <Clock size={40} />
                        </div>
                        <div>
                            <h4 className="text-xl font-black italic tracking-tighter text-slate-400 uppercase">Sin Actividad Reciente</h4>
                            <p className="text-slate-300 text-[10px] font-bold uppercase tracking-widest mt-1">Este paciente no tiene tratamientos registrados aún</p>
                        </div>
                    </div>
                ) : (
                    <div className="relative pl-8 space-y-8 before:absolute before:left-0 before:top-4 before:bottom-0 before:w-[2px] before:bg-slate-200 italic">
                        {treatments.map((t, idx) => (
                            <div key={t.id || idx} className="relative">
                                <div className={`absolute -left-10 top-2 w-4 h-4 rounded-full border-4 border-white shadow-[0_0_0_2px_rgba(19,127,236,0.1)] z-10 ${t.status === 'En Curso' ? 'bg-[#137fec]' : 'bg-emerald-500'}`}></div>
                                <div className="bg-white rounded-[2rem] border border-slate-200/60 p-8 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className="text-[10px] font-black text-[#137fec] uppercase tracking-widest">{t.date}</span>
                                            <h4 className="text-xl font-black italic tracking-tight text-slate-800 mt-1">{t.name}</h4>
                                            <p className="text-slate-500 text-[11px] font-medium mt-1">Atendido por <span className="text-slate-800 font-bold">{t.professional}</span></p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${t.status === 'En Curso' ? 'bg-blue-50 text-[#137fec]' : 'bg-emerald-50 text-emerald-600'}`}>
                                            {t.status}
                                        </span>
                                    </div>

                                    {t.notes && (
                                        <div className="bg-slate-50/50 rounded-2xl p-6 mt-6 border border-slate-100">
                                            <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">NOTAS CLÍNICAS</h5>
                                            <p className="text-xs text-slate-600 font-medium leading-relaxed">{t.notes}</p>
                                        </div>
                                    )}

                                    <div className="flex gap-8 mt-6 pt-6 border-t border-slate-50 text-slate-400">
                                        <div className="flex items-center gap-2 text-[10px] font-bold">
                                            <DollarSign size={14} /> Costo: ${t.cost}
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-bold">
                                            <Clock size={14} /> Registro Automático
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Right Column: Imagery & Finance */}
            <div className="xl:col-span-4 space-y-8">
                <div className="bg-white rounded-[2.5rem] border border-slate-200/60 p-8 shadow-sm space-y-6">
                    <div className="flex justify-between items-center">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-800 italic">Imágenes y Rayos X</h4>
                        <button className="text-[10px] font-black text-[#137fec] uppercase tracking-widest hover:underline">Ver Todo</button>
                    </div>

                    <div className="space-y-4">
                        <div className="relative group rounded-3xl overflow-hidden aspect-[4/3] bg-slate-100 border border-slate-200">
                            <img src="https://images.unsplash.com/photo-1579154235828-4519939b940b?auto=format&fit=crop&q=80&w=400" alt="X-Ray" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-5">
                                <p className="text-white text-xs font-black italic">Radiografía Panorámica</p>
                                <p className="text-white/70 text-[9px] font-bold italic uppercase tracking-tighter">Sin archivos vinculados</p>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                addToast?.("Iniciando carga de imagen...", "loading");
                                setTimeout(() => addToast?.("Imagen subida con éxito", "success"), 1500);
                            }}
                            className="w-full py-6 border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-200 transition-all group"
                        >
                            <div className="p-3 bg-blue-50 rounded-2xl text-[#137fec] group-hover:scale-110 transition-transform">
                                <Upload size={20} />
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vincular Nueva Placa</span>
                        </button>
                    </div>
                </div>

                <div className="bg-[#137fec]/5 rounded-[2.5rem] border border-blue-100 p-8 shadow-sm space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#137fec] rounded-xl text-white">
                            <DollarSign size={16} />
                        </div>
                        <h4 className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-800 italic">Resumen Financiero</h4>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-xs">
                            <span className="font-medium text-slate-500 uppercase tracking-tighter">Balance Actual Adeudado</span>
                            <span className="font-black text-red-600">${totalBalance.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="font-medium text-slate-500 uppercase tracking-tighter">Tratamientos Totales</span>
                            <span className="font-black text-slate-800">{treatments.length}</span>
                        </div>
                        <div className="w-full bg-blue-100 h-2.5 rounded-full overflow-hidden">
                            <div className="bg-[#137fec] h-full w-[100%] rounded-full shadow-sm shadow-blue-500/20"></div>
                        </div>
                        <button
                            onClick={onGenerateInvoice}
                            className="w-full py-5 bg-[#137fec] text-white rounded-3xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 active:scale-95 mt-4 flex items-center justify-center gap-2"
                        >
                            <FileCheck size={16} /> NUEVA FACTURA / RECIBO
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Timeline;
