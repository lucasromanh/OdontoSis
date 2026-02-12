import React, { useState, useMemo } from 'react';
import { Save, Printer, ArrowRightLeft, Microscope, Info, Settings as SettingsIcon, X, Trash2, Check } from 'lucide-react';
import { ToastType } from './Notifications';

// Constantes de dientes
const UPPER_TEETH = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const LOWER_TEETH = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

const Periodontogram: React.FC<{
    patientName?: string;
    patientId?: string;
    initialData?: any;
    onDataChange?: (newData: any) => void;
    addToast?: (msg: string, type: ToastType) => void
}> = ({ patientName = "Maria Garcia", patientId = "ID: 2527851", initialData, onDataChange, addToast }) => {
    // Estado para los valores clínicos
    const [data, setData] = useState<{ [key: number]: { mg: string[], ps: string[], movilidad: string, sangrado: boolean[], placa: boolean[] } }>(() => {
        if (initialData && Object.keys(initialData).length > 0) return initialData;

        const initialState: any = {};
        [...UPPER_TEETH, ...LOWER_TEETH].forEach(t => {
            initialState[t] = {
                mg: ["0", "0", "0"],
                ps: ["2", "2", "2"],
                movilidad: "0",
                sangrado: [false, false, false],
                placa: [false, false, false]
            };
        });
        return initialState;
    });

    // Sincronizar con datos externos si cambian
    React.useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            setData(initialData);
        } else {
            // Si no hay datos, inicializamos el estado por defecto
            const initialState: any = {};
            [...UPPER_TEETH, ...LOWER_TEETH].forEach(t => {
                initialState[t] = {
                    mg: ["0", "0", "0"],
                    ps: ["2", "2", "2"],
                    movilidad: "0",
                    sangrado: [false, false, false],
                    placa: [false, false, false]
                };
            });
            setData(initialState);
        }
    }, [initialData]);

    const [history, setHistory] = useState([
        { id: 1, date: "10 Ene, 2026", professional: "Dr. Lucas Román", indices: { sangrado: "15%", placa: "20%" } },
        { id: 2, date: "15 Dic, 2025", professional: "Dra. Ana López", indices: { sangrado: "22%", placa: "35%" } }
    ]);
    const [showHistory, setShowHistory] = useState(false);
    const [confirmingSave, setConfirmingSave] = useState(false);
    const [deletingEntryId, setDeletingEntryId] = useState<number | null>(null);

    const updateValue = (tooth: number, type: 'mg' | 'ps' | 'movilidad' | 'sangrado' | 'placa', idx: number | null, val: any) => {
        setData(prev => {
            const toothData = prev[tooth];
            let newValue;

            if (idx !== null && Array.isArray(toothData[type as 'mg' | 'ps' | 'sangrado' | 'placa'])) {
                newValue = (toothData[type as 'mg' | 'ps' | 'sangrado' | 'placa'] as any[]).map((v, i) => i === idx ? val : v);
            } else {
                newValue = val;
            }

            const newState = {
                ...prev,
                [tooth]: {
                    ...toothData,
                    [type]: newValue
                }
            };
            onDataChange?.(newState);
            return newState;
        });
    };

    // Cálculos dinámicos
    const metrics = useMemo(() => {
        const totalSites = [...UPPER_TEETH, ...LOWER_TEETH].length * 3;
        let bleedingCount = 0;
        let plaqueCount = 0;
        let psSum = 0;
        let psCount = 0;

        [...UPPER_TEETH, ...LOWER_TEETH].forEach(t => {
            data[t].sangrado.forEach(v => { if (v) bleedingCount++; });
            data[t].placa.forEach(v => { if (v) plaqueCount++; });
            data[t].ps.forEach(v => {
                psSum += parseFloat(v) || 0;
                psCount++;
            });
        });

        return {
            sangrado: ((bleedingCount / totalSites) * 100).toFixed(1) + "%",
            placa: ((plaqueCount / totalSites) * 100).toFixed(1) + "%",
            psPromedio: (psSum / psCount).toFixed(1) + "mm"
        };
    }, [data]);

    // Función para calcular las rutas del gráfico
    const calculatePaths = (teeth: number[]) => {
        let mgPath = "";
        let blPath = "";
        teeth.forEach((t, i) => {
            const toothData = data[t];
            const segmentWidth = 1000 / teeth.length;
            const startX = i * segmentWidth + (segmentWidth * 0.2);
            const step = (segmentWidth * 0.6) / 2;

            [0, 1, 2].forEach(pIdx => {
                const x = startX + (pIdx * step);
                const mg = parseFloat(toothData.mg[pIdx]) || 0;
                const ps = parseFloat(toothData.ps[pIdx]) || 0;

                // Mapeo visual: 100 es la base, 6px por unidad
                const yMg = 100 + mg * 6;
                const yBl = 100 + (mg + ps) * 6;

                if (mgPath === "") mgPath = `M ${x},${yMg} `; else mgPath += ` L ${x},${yMg} `;
                if (blPath === "") blPath = `M ${x},${yBl} `; else blPath += ` L ${x},${yBl} `;
            });
        });
        return { mgPath, blPath };
    };

    const upperPaths = useMemo(() => calculatePaths(UPPER_TEETH), [data]);

    return (
        <div className="p-6 space-y-6 animate-in slide-in-from-bottom-4 duration-700 bg-[#F4F4F0] min-h-[90vh]">
            {/* Cabecera de Información */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-8">
                    <div className="w-16 h-16 bg-[#137fec]/10 rounded-2xl flex items-center justify-center text-[#137fec] shadow-inner">
                        <Microscope size={32} />
                    </div>
                    <div>
                        <div className="flex items-center gap-4">
                            <h2 className="text-3xl font-black italic tracking-tighter text-slate-800 uppercase">{patientName}</h2>
                            <span className="px-3 py-1 bg-slate-100 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-200">{patientId}</span>
                        </div>
                        <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-[10px] italic">Periodontograma Avanzado • <span className="text-[#137fec]">Actualizado: 11 de Feb, 2026</span></p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <ActionButton
                        icon={<Printer size={18} />}
                        label="Imprimir"
                        onClick={() => window.print()}
                    />
                    <ActionButton
                        icon={<ArrowRightLeft size={18} />}
                        label="Historial"
                        onClick={() => setShowHistory(true)}
                    />
                    <button
                        onClick={() => setConfirmingSave(true)}
                        className="bg-[#137fec] hover:bg-blue-600 text-white px-10 py-4 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-blue-500/20 flex items-center gap-2 active:scale-95"
                    >
                        <Save size={18} />
                        Guardar Análisis
                    </button>
                </div>
            </div>

            {/* Modal de Confirmación de Guardado */}
            {confirmingSave && (
                <div className="fixed inset-0 z-[100000] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] w-full max-w-sm shadow-2xl p-10 space-y-8 animate-in zoom-in-95 duration-300 text-center scale-[0.85]">
                        <div className="w-20 h-20 bg-blue-50 text-[#137fec] rounded-full flex items-center justify-center mx-auto">
                            <Save size={40} />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-xl font-black italic tracking-tighter text-slate-800 uppercase">¿Guardar Análisis Actual?</h4>
                            <p className="text-[11px] font-bold text-slate-400 uppercase leading-relaxed">
                                Se registrará el estado actual del periodontograma en el historial del paciente.
                            </p>
                        </div>
                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={() => setConfirmingSave(false)}
                                className="flex-1 py-4 bg-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-200 transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => {
                                    const newEntry = {
                                        id: Date.now(),
                                        date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
                                        professional: "Dr. Lucas Román",
                                        indices: { sangrado: metrics.sangrado, placa: metrics.placa }
                                    };
                                    setHistory([newEntry, ...history]);
                                    setConfirmingSave(false);
                                    addToast?.("Análisis guardado correctamente", "success");
                                }}
                                className="flex-1 py-4 bg-[#137fec] rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Historial */}
            {showHistory && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] w-full max-w-md shadow-2xl p-10 space-y-8 animate-in zoom-in-95 duration-300 scale-[0.85]">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-6">
                            <h4 className="text-xl font-black italic tracking-tighter text-slate-800 uppercase text-center w-full ml-6">Historial de Análisis</h4>
                            <button onClick={() => setShowHistory(false)} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-400">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                            {history.map(entry => (
                                <div key={entry.id} className="p-5 bg-slate-50 rounded-3xl border border-slate-100 hover:border-[#137fec]/20 transition-all group flex justify-between items-center relative overflow-hidden">
                                    <div className="space-y-1">
                                        <p className="text-xs font-black text-slate-800 uppercase tracking-tighter">{entry.date}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{entry.professional}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-red-400 uppercase">S: {entry.indices.sangrado}</p>
                                            <p className="text-[10px] font-black text-[#137fec] uppercase">P: {entry.indices.placa}</p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDeletingEntryId(entry.id);
                                            }}
                                            className="p-2 bg-red-50 text-red-400 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>

                                    {/* Confirmation Overlay for Deletion within the item */}
                                    {deletingEntryId === entry.id && (
                                        <div className="absolute inset-0 bg-red-500 flex items-center justify-around px-4 animate-in fade-in zoom-in-95 duration-200">
                                            <p className="text-[10px] font-black text-white uppercase italic">¿Confirmar Borrado?</p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setDeletingEntryId(null)}
                                                    className="p-2 bg-white/20 hover:bg-white/40 text-white rounded-lg transition-all"
                                                >
                                                    <X size={14} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setHistory(prev => prev.filter(h => h.id !== entry.id));
                                                        setDeletingEntryId(null);
                                                        addToast?.("Análisis eliminado", "success");
                                                    }}
                                                    className="p-2 bg-white text-red-500 rounded-lg transition-all shadow-lg"
                                                >
                                                    <Check size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setShowHistory(false)} className="w-full py-4 bg-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-slate-500/20 active:scale-95 transition-all">
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            {/* Cuadrícula de Análisis */}
            <div className="space-y-6">
                {/* Arcada Superior */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                    <div className="px-8 py-5 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
                        <div className="w-2 h-7 bg-[#137fec] rounded-full shadow-lg shadow-blue-500/20"></div>
                        <h3 className="font-black italic text-lg text-slate-800 uppercase tracking-tight">Análisis Arcada Superior</h3>
                    </div>
                    <div className="overflow-x-auto p-8 custom-scrollbar">
                        <PeriodontalTable teeth={UPPER_TEETH} data={data} onUpdate={updateValue} />
                    </div>
                </div>

                {/* Representación Gráfica Interactiva */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-6 left-10 flex items-center gap-2 z-10">
                        <Info size={18} className="text-[#137fec]" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Simulación Interactiva</span>
                    </div>

                    <div className="h-72 mt-8 flex items-center justify-around relative bg-[#F9F9F7] rounded-3xl border border-slate-100/50">
                        {/* IMAGEN DE FONDO ESTIRADA A LO LARGO */}
                        <img
                            src="/src/tmp/dientes.jpeg"
                            className="absolute inset-0 w-full h-full object-fill opacity-[0.15] pointer-events-none"
                            alt="Ilustración Dental"
                        />

                        {/* Superposición de cuadrícula */}
                        <div className="absolute inset-0 grid grid-cols-16 opacity-[0.05] pointer-events-none">
                            {[...Array(16)].map((_, i) => <div key={i} className="border-r border-slate-900 h-full"></div>)}
                        </div>

                        {/* Rutas SVG Dinámicas */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1000 200">
                            <path d={upperPaths.mgPath} fill="transparent" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="6 4" className="transition-all duration-300" />
                            <path d={upperPaths.blPath} fill="rgba(19, 127, 236, 0.08)" stroke="#137fec" strokeWidth="3" className="transition-all duration-300" />
                        </svg>

                        {/* Números de dientes sobre el gráfico */}
                        <div className="absolute inset-0 flex justify-around items-end pb-4 px-6 pointer-events-none">
                            {UPPER_TEETH.map(t => (
                                <span key={t} className="text-[10px] font-black text-slate-300 italic">{t}</span>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-center gap-10 mt-8 pt-6 border-t border-slate-50">
                        <LegendItem color="bg-red-500" label="Margen Gingival" dashed />
                        <LegendItem color="bg-[#137fec]" label="Nivel Óseo" />
                        <LegendItem color="bg-red-500/10" label="Bolsa > 4mm" border="border border-red-400/30" />
                        <LegendItem color="bg-slate-200" label="Implante" icon={<SettingsIcon size={12} className="text-slate-400" />} />
                    </div>
                </div>

                {/* Arcada Inferior */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                    <div className="px-8 py-5 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
                        <div className="w-2 h-7 bg-slate-400 rounded-full"></div>
                        <h3 className="font-black italic text-lg text-slate-800 uppercase tracking-tight">Análisis Arcada Inferior</h3>
                    </div>
                    <div className="overflow-x-auto p-8 custom-scrollbar">
                        <PeriodontalTable teeth={LOWER_TEETH} data={data} onUpdate={updateValue} />
                    </div>
                </div>
            </div>

            {/* Footer de Resumen */}
            <footer className="bg-white rounded-3xl border border-slate-200 p-8 flex items-center justify-between shadow-sm">
                <div className="flex gap-12">
                    <Metric label="Índice de Sangrado" value={metrics.sangrado} color="text-red-500" />
                    <Metric label="Índice de Placa" value={metrics.placa} color="text-[#137fec]" />
                    <Metric label="Prof. Promedio" value={metrics.psPromedio} color="text-slate-700" />
                </div>
                <div className="flex items-center gap-6 text-[10px] font-black text-slate-300 uppercase tracking-widest italic">
                    <span className="flex items-center gap-2"><Save size={16} className="text-teal-400" /> Auto-guardado: 14:02:45</span>
                    <span className="px-4 py-1.5 bg-slate-50 rounded-full border border-slate-100">v4.2.1-PRO</span>
                </div>
            </footer>
        </div>
    );
};

const ActionButton: React.FC<{ icon: React.ReactNode; label: string; onClick?: () => void }> = ({ icon, label, onClick }) => (
    <button
        onClick={onClick}
        className="px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-2 text-slate-400 hover:text-slate-700 active:scale-95"
    >
        {icon} {label}
    </button>
);

const Metric: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
    <div className="flex items-center gap-4">
        <div className={`w-2.5 h-2.5 rounded-full ${color.replace('text-', 'bg-')} shadow-sm`}></div>
        <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{label}</span>
            <span className={`text-xl font-black italic tracking-tighter ${color}`}>{value}</span>
        </div>
    </div>
);

const LegendItem: React.FC<{ color: string; label: string; border?: string; icon?: React.ReactNode; dashed?: boolean }> = ({ color, label, border = '', icon, dashed }) => (
    <div className="flex items-center gap-3">
        <div className={`w-4 h-4 rounded shadow-sm ${color} ${border} flex items-center justify-center ${dashed ? 'border-2 border-white border-dashed ring-1 ring-red-500/30' : ''}`}>
            {icon}
        </div>
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{label}</span>
    </div>
);

const PeriodontalTable: React.FC<{ teeth: number[]; data: any; onUpdate: any }> = ({ teeth, data, onUpdate }) => (
    <table className="w-full border-separate border-spacing-0">
        <thead>
            <tr className="bg-slate-50/50">
                <th className="p-4 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100 w-44 rounded-tl-3xl bg-slate-50/30">Métrica</th>
                {teeth.map(t => (
                    <th key={t} className={`p-2 text-center text-xs font-black italic border-b border-slate-100 ${t === 16 || t === 46 ? 'text-[#137fec] bg-blue-50/30' : 'text-slate-400'}`}>{t}</th>
                ))}
            </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
            <PeriodontalRow
                label="Movilidad"
                teeth={teeth}
                type="normal"
                values={teeth.map(t => [data[t].movilidad])}
                onUpdate={(tIdx: number, _: number, val: string) => onUpdate(teeth[tIdx], 'movilidad', null, val)}
            />
            <PeriodontalRow
                label="Sangrado/Placa"
                type="dots"
                teeth={teeth}
                values={teeth.map(t => [data[t].sangrado, data[t].placa]) as any}
                onUpdate={(tIdx: number, pIdx: number, type: 'sangrado' | 'placa') => {
                    const currentVal = data[teeth[tIdx]][type][pIdx];
                    onUpdate(teeth[tIdx], type, pIdx, !currentVal);
                }}
            />
            <PeriodontalRow
                label="Margen Gingival"
                type="triple"
                teeth={teeth}
                values={teeth.map(t => data[t].mg)}
                onUpdate={(tIdx: number, pIdx: number, val: string) => onUpdate(teeth[tIdx], 'mg', pIdx, val)}
            />
            <PeriodontalRow
                label="Prof. Sondaje"
                type="triple"
                highlighted={true}
                teeth={teeth}
                values={teeth.map(t => data[t].ps)}
                onUpdate={(tIdx: number, pIdx: number, val: string) => onUpdate(teeth[tIdx], 'ps', pIdx, val)}
            />
        </tbody>
    </table>
);

const PeriodontalRow: React.FC<{
    label: string;
    type?: 'normal' | 'dots' | 'triple';
    teeth: number[];
    highlighted?: boolean;
    values?: any[][];
    onUpdate?: (tIdx: number, pIdx: number, val: any) => void
}> = ({ label, type = 'normal', teeth, highlighted, values, onUpdate }) => (
    <tr className="hover:bg-slate-50/30 transition-all">
        <td className="p-4 text-[9px] font-black uppercase text-slate-500 bg-slate-50/10 border-r border-slate-100 italic">{label}</td>
        {teeth.map((_, tIdx) => (
            <td key={tIdx} className={`p-0 text-center border-r border-slate-50 last:border-0 ${highlighted ? 'bg-red-50/5' : ''}`}>
                {type === 'normal' && values && (
                    <input
                        className="w-full h-10 text-center text-xs font-black italic focus:bg-[#137fec]/5 outline-none bg-transparent"
                        value={values[tIdx][0]}
                        onChange={(e) => onUpdate?.(tIdx, 0, e.target.value)}
                    />
                )}
                {type === 'dots' && values && (
                    <div className="flex justify-center gap-2 py-3">
                        {[0, 1, 2].map(pIdx => (
                            <div key={pIdx} className="flex flex-col gap-1">
                                <div
                                    onClick={() => onUpdate?.(tIdx, pIdx, 'sangrado')}
                                    className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all shadow-sm ${((values[tIdx] as any)[0][pIdx]) ? 'bg-red-500 scale-125' : 'bg-red-500/20 hover:bg-red-500/40'}`}
                                ></div>
                                <div
                                    onClick={() => onUpdate?.(tIdx, pIdx, 'placa')}
                                    className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all shadow-sm ${((values[tIdx] as any)[1][pIdx]) ? 'bg-[#137fec] scale-125' : 'bg-[#137fec]/20 hover:bg-[#137fec]/40'}`}
                                ></div>
                            </div>
                        ))}
                    </div>
                )}
                {type === 'triple' && values && (
                    <div className={`flex h-10 ${highlighted ? 'text-red-600' : ''}`}>
                        {[0, 1, 2].map(pIdx => (
                            <input
                                key={pIdx}
                                className={`w-1/3 h-full text-center text-[10px] border-none focus:bg-[#137fec]/5 outline-none bg-transparent font-black transition-colors ${highlighted && parseFloat(values[tIdx][pIdx]) >= 4 ? 'bg-red-100 text-red-700' : ''}`}
                                value={values[tIdx][pIdx]}
                                onChange={(e) => onUpdate?.(tIdx, pIdx, e.target.value)}
                            />
                        ))}
                    </div>
                )}
            </td>
        ))}
    </tr>
);

export default Periodontogram;
