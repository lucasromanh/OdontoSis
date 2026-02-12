import React from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    ExternalLink,
    CheckCircle2
} from 'lucide-react';

const Appointments: React.FC = () => {
    return (
        <div className="flex h-full bg-[#EBEBE6] animate-in fade-in duration-500 overflow-hidden">

            {/* Sidebar de la Agenda (Izquierda) - Más compacto */}
            <aside className="w-64 border-r border-slate-200 bg-[#F4F4F0] flex flex-col overflow-y-auto custom-scrollbar shrink-0">

                {/* Mini Calendario - Escala reducida */}
                <div className="p-4 border-b border-slate-200">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xs font-black italic tracking-tight text-slate-800">Octubre 2023</h3>
                        <div className="flex gap-1">
                            <button className="p-1 hover:bg-white rounded text-slate-400"><ChevronLeft size={14} /></button>
                            <button className="p-1 hover:bg-white rounded text-slate-400"><ChevronRight size={14} /></button>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-y-1 text-center">
                        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => (
                            <span key={d} className="text-[8px] font-black text-slate-400 uppercase">{d}</span>
                        ))}
                        {[...Array(22)].map((_, i) => (
                            <span key={i} className="text-[9px] font-bold text-slate-400 py-1">{i + 1}</span>
                        ))}
                        <span className="text-[9px] font-black bg-[#137fec] text-white rounded-full w-5 h-5 flex items-center justify-center mx-auto shadow-sm py-1">23</span>
                        {[...Array(7)].map((_, i) => (
                            <span key={i} className="text-[9px] font-bold text-slate-800 py-1">{i + 24}</span>
                        ))}
                    </div>
                </div>

                {/* Sala de Espera - Compacta */}
                <div className="p-4 border-b border-slate-200">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">SALA DE ESPERA</h3>
                        <span className="text-[8px] font-black text-[#137fec] bg-blue-50 px-2 py-0.5 rounded-full">3 Pacientes</span>
                    </div>
                    <div className="space-y-2">
                        <WaitingPatient name="Sarah Jenkins" type="Limpieza" time="09:45" color="bg-emerald-500" />
                        <WaitingPatient name="Kevin Larsson" type="Cirugía" time="10:10" color="bg-violet-500" />
                        <WaitingPatient name="Maria Garcia" type="Ortodoncia" time="10:15" color="bg-blue-500" />
                    </div>
                </div>

                {/* Filtros - Compactos */}
                <div className="p-4 space-y-4">
                    <div>
                        <h3 className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">DOCTORES</h3>
                        <div className="space-y-2">
                            <FilterItem label="Dr. Smith" color="bg-blue-400" checked />
                            <FilterItem label="Dr. Garcia" color="bg-orange-400" checked />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">TRATAMIENTOS</h3>
                        <div className="space-y-2">
                            <FilterItem label="Cirugía" color="bg-violet-500" checked />
                            <FilterItem label="Limpieza" color="bg-emerald-500" checked />
                            <FilterItem label="Urgencia" color="bg-red-500" checked />
                        </div>
                    </div>
                </div>
            </aside>

            {/* Calendario Principal (Derecha) - Fondo más oscuro para contraste */}
            <div className="flex-1 flex flex-col min-h-0 bg-[#EBEBE6]">

                {/* Cabecera del Calendario - Integrada */}
                <header className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white/50 backdrop-blur-sm shrink-0">
                    <div className="flex bg-slate-200/50 p-0.5 rounded-xl border border-slate-200">
                        <button className="px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-slate-500">Día</button>
                        <button className="px-4 py-1.5 text-[9px] font-black uppercase tracking-widest bg-white text-[#137fec] rounded-lg shadow-sm">Semana</button>
                        <button className="px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-slate-500">Mes</button>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-1 text-slate-400"><ChevronLeft size={18} /></button>
                        <span className="text-xs font-black italic tracking-tight text-slate-800">Octubre 23 - 29, 2023</span>
                        <button className="p-1 text-slate-400"><ChevronRight size={18} /></button>
                    </div>

                    <button className="bg-[#137fec] hover:bg-blue-600 text-white px-6 py-2 rounded-xl font-black uppercase tracking-widest text-[9px] transition-all shadow-md shadow-blue-500/10 flex items-center gap-2">
                        <Plus size={14} />
                        Nueva Cita
                    </button>
                </header>

                {/* Rejilla del Calendario */}
                <div className="flex-1 overflow-auto bg-white/40 relative custom-scrollbar">
                    <div className="min-w-[1000px]">
                        {/* Cabecera de Días */}
                        <div className="grid grid-cols-8 border-b border-slate-200 sticky top-0 bg-[#F4F4F0]/90 backdrop-blur-md z-30">
                            <div className="p-3 border-r border-slate-200"></div>
                            {[
                                { day: 'LUN', date: '23' },
                                { day: 'MAR', date: '24' },
                                { day: 'MIÉ', date: '25' },
                                { day: 'JUE', date: '26' },
                                { day: 'VIE', date: '27' },
                                { day: 'SÁB', date: '28' },
                                { day: 'DOM', date: '29' }
                            ].map((d, i) => (
                                <div key={i} className="p-2 text-center border-r border-slate-200 last:border-0">
                                    <span className="block text-[8px] font-black uppercase tracking-widest text-slate-400">{d.day}</span>
                                    <span className={`text-xl font-black italic tracking-tighter ${d.date === '23' ? 'text-[#137fec]' : 'text-slate-700'}`}>{d.date}</span>
                                </div>
                            ))}
                        </div>

                        {/* Rejilla de Horas */}
                        <div className="grid grid-cols-8 relative bg-white/20">

                            {/* Línea de Hora Actual */}
                            <div className="absolute top-[280px] left-0 right-0 z-20 pointer-events-none">
                                <div className="h-[1.5px] w-full bg-red-400 opacity-60 relative">
                                    <div className="absolute -left-1 -top-[3px] w-2 h-2 bg-red-400 rounded-full shadow-sm"></div>
                                </div>
                            </div>

                            {/* Columna de Horas */}
                            <div className="col-span-1 border-r border-slate-200 divide-y divide-slate-100">
                                {[8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7].map(h => (
                                    <div key={h} className="h-24 p-2 text-right text-[8px] font-black text-slate-400 tracking-tighter uppercase">
                                        {h}:00 <span className="opacity-40">{h >= 8 && h < 12 ? 'AM' : 'PM'}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Columnas de Días */}
                            {[...Array(7)].map((_, dayIdx) => (
                                <div key={dayIdx} className="col-span-1 border-r border-slate-100 relative divide-y divide-slate-100/50">
                                    {[...Array(12)].map((_, i) => <div key={i} className="h-24"></div>)}

                                    {dayIdx === 0 && (
                                        <>
                                            <SimpleAppt top="top-[96px]" height="h-16" name="Alice Cooper" type="Limpieza" color="bg-emerald-50" border="border-emerald-400" textColor="text-emerald-700" />

                                            {/* Cita Detalle Marcus - Más compacta */}
                                            <div className="absolute left-1 right-1 top-[240px] bg-white rounded-xl border-2 border-blue-500 shadow-xl z-40 p-3 scale-90 origin-top">
                                                <div className="flex items-start gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                                                        <img src="https://ui-avatars.com/api/?name=MV&background=F4F4F0&color=1E293B" alt="MV" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-[10px] font-black italic text-slate-800 truncate">Marcus Villanueva</h4>
                                                        <span className="text-[7px] font-black uppercase text-violet-500 tracking-widest bg-violet-50 px-1.5 py-0.5 rounded">CIRUGÍA</span>
                                                    </div>
                                                </div>
                                                <p className="mt-2 text-[8px] text-slate-500 font-medium leading-tight">Pieza #14 - Conducto</p>
                                                <div className="flex gap-1.5 mt-3">
                                                    <button className="flex-1 py-1.5 bg-slate-50 rounded-lg text-[7px] font-black uppercase text-slate-600 border border-slate-100"><ExternalLink size={10} className="inline mr-1" /> Ver</button>
                                                    <button className="flex-1 py-1.5 bg-[#137fec] text-white rounded-lg text-[7px] font-black uppercase"><CheckCircle2 size={10} className="inline mr-1" /> Fin</button>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {dayIdx === 1 && (
                                        <SimpleAppt top="top-[300px]" height="h-20" name="Urgencia" type="Dolor" color="bg-red-50" border="border-red-300" textColor="text-red-700" />
                                    )}

                                    {dayIdx === 2 && (
                                        <SimpleAppt top="top-[96px]" height="h-12" name="James Wilson" type="Brackets" color="bg-blue-50" border="border-blue-400" textColor="text-blue-700" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer - Compacto */}
                <footer className="h-8 border-t border-slate-200 bg-[#F4F4F0] px-4 flex items-center justify-between text-[7px] font-black uppercase tracking-widest text-slate-400 shrink-0">
                    <div className="flex gap-4">
                        <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> 4 Limpiezas hoy</span>
                        <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-violet-400"></div> 2 Cirugías hoy</span>
                    </div>
                    <span className="opacity-60 italic">Oct 23, 10:18 AM</span>
                </footer>
            </div>
        </div>
    );
};

const WaitingPatient: React.FC<{ name: string; type: string; time: string; color: string }> = ({ name, type, time, color }) => (
    <div className="p-2.5 bg-white rounded-xl border border-slate-100 flex justify-between items-center hover:shadow-md transition-all cursor-pointer">
        <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${color}`}></div>
            <div className="min-w-0">
                <h4 className="text-[9px] font-black italic text-slate-800 truncate leading-none">{name}</h4>
                <p className="text-[7px] text-slate-400 font-bold uppercase mt-1">{type}</p>
            </div>
        </div>
        <span className="text-[8px] font-black text-slate-300 shrink-0">{time}</span>
    </div>
);

const FilterItem: React.FC<{ label: string; color: string; checked?: boolean }> = ({ label, color, checked }) => (
    <label className="flex items-center justify-between cursor-pointer group">
        <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${color} ${!checked && 'grayscale opacity-30'}`}></div>
            <span className={`text-[9px] font-bold italic ${checked ? 'text-slate-700' : 'text-slate-300'}`}>{label}</span>
        </div>
        <div className={`w-3.5 h-3.5 rounded border transition-all ${checked ? 'bg-[#137fec] border-[#137fec]' : 'border-slate-200'}`}>
            {checked && <div className="w-full h-full flex items-center justify-center text-white text-[8px] font-black opacity-80">✓</div>}
        </div>
    </label>
);

const SimpleAppt: React.FC<{ top: string; height: string; name: string; type: string; color: string; border: string; textColor: string }> = ({ top, height, name, type, color, border, textColor }) => (
    <div className={`absolute left-1 right-1 ${top} ${height} ${color} border-l-[3px] ${border} rounded-lg p-2 flex flex-col justify-center cursor-pointer hover:shadow-md hover:z-10 transition-all`}>
        <h5 className={`text-[8px] font-black italic tracking-tight ${textColor} truncate`}>{name}</h5>
        {type && <p className="text-[7px] font-bold text-slate-400 mt-0.5 truncate leading-none">{type}</p>}
    </div>
);

export default Appointments;
