import React, { useState } from 'react';
import { Info, Trash2, Edit2, Plus, History, Check, X, ClipboardList } from 'lucide-react';
import { ToastType } from './Notifications';

export type FindingType = 'treatment' | 'problem' | 'healthy' | 'absent';

export interface Finding {
    id: string;
    type: FindingType;
    description: string;
    date: string;
    professional: string;
}

const TYPE_COLORS: Record<FindingType, string> = {
    treatment: 'bg-[#137fec]',
    problem: 'bg-red-500',
    healthy: 'bg-emerald-500',
    absent: 'bg-slate-300'
};

const TYPE_LABELS: Record<FindingType, string> = {
    treatment: 'Tratamiento Realizado',
    problem: 'Caries / Problema',
    healthy: 'Pieza Sana',
    absent: 'Implante / Ausente'
};

interface OdontogramProps {
    initialFindings?: Record<number, Finding[]>;
    onFindingsChange?: (findings: Record<number, Finding[]>) => void;
    addToast?: (msg: string, type: ToastType) => void;
}

const Odontogram: React.FC<OdontogramProps> = ({ initialFindings = {}, onFindingsChange, addToast }) => {
    const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingFinding, setEditingFinding] = useState<Finding | null>(null);
    const [newFinding, setNewFinding] = useState<{ type: FindingType, description: string }>({
        type: 'healthy',
        description: ''
    });

    // Sync findings with props
    const [findings, setFindings] = useState<Record<number, Finding[]>>(initialFindings);

    React.useEffect(() => {
        setFindings(initialFindings);
    }, [initialFindings]);

    const updateFindings = (newFindings: Record<number, Finding[]>) => {
        setFindings(newFindings);
        onFindingsChange?.(newFindings);
    };

    const teethRows = [
        [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
        [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38]
    ];

    const getToothStatus = (tooth: number): FindingType | 'none' => {
        const toothFindings = findings[tooth];
        if (!toothFindings || toothFindings.length === 0) return 'none';

        // Prioridad de visualización: Problema > Ausente > Tratamiento > Sano
        if (toothFindings.some(f => f.type === 'problem')) return 'problem';
        if (toothFindings.some(f => f.type === 'absent')) return 'absent';
        if (toothFindings.some(f => f.type === 'treatment')) return 'treatment';
        return 'healthy';
    };

    const handleSaveFinding = () => {
        if (!selectedTooth) return;

        const finding: Finding = editingFinding ? {
            ...editingFinding,
            type: newFinding.type,
            description: newFinding.description
        } : {
            id: Math.random().toString(36).substr(2, 9),
            type: newFinding.type,
            description: newFinding.description,
            date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
            professional: 'Dr. Lucas Román'
        };

        const currentTeethFindings = findings[selectedTooth] || [];
        let nextFindings;
        if (editingFinding) {
            nextFindings = {
                ...findings,
                [selectedTooth]: currentTeethFindings.map(f => f.id === editingFinding.id ? finding : f)
            };
        } else {
            nextFindings = {
                ...findings,
                [selectedTooth]: [finding, ...currentTeethFindings]
            };
        }
        updateFindings(nextFindings);

        addToast?.(editingFinding ? "Hallazgo actualizado" : "Nuevo hallazgo registrado", "success");
        setShowModal(false);
        setEditingFinding(null);
        setNewFinding({ type: 'healthy', description: '' });
    };

    const handleDeleteFinding = (id: string) => {
        if (!selectedTooth) return;
        const nextFindings = {
            ...findings,
            [selectedTooth]: findings[selectedTooth].filter(f => f.id !== id)
        };
        updateFindings(nextFindings);
        addToast?.("Hallazgo eliminado", "success");
    };

    const openEditModal = (finding: Finding) => {
        setEditingFinding(finding);
        setNewFinding({ type: finding.type, description: finding.description });
        setShowModal(true);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white rounded-[2.5rem] border border-slate-200/60 p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-6 left-8 flex items-center gap-2">
                    <Info size={18} className="text-[#137fec]" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Mapa Dental Interactivo</span>
                </div>

                <div className="mt-12 space-y-16">
                    {teethRows.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex justify-center flex-wrap gap-4">
                            {row.map(tooth => {
                                const status = getToothStatus(tooth);
                                return (
                                    <button
                                        key={tooth}
                                        onClick={() => setSelectedTooth(tooth)}
                                        className={`
                                            w-14 h-24 rounded-2xl relative flex flex-col items-center justify-between p-3 transition-all duration-300 group
                                            ${selectedTooth === tooth ? 'bg-blue-50 border-2 border-[#137fec] shadow-xl shadow-blue-500/10 scale-110 z-10' : 'bg-slate-50 border border-slate-100 hover:bg-white hover:border-slate-300 hover:shadow-md'}
                                        `}
                                    >
                                        <span className={`text-[10px] font-black tracking-tighter ${selectedTooth === tooth ? 'text-[#137fec]' : 'text-slate-400'}`}>{tooth}</span>

                                        <div className={`
                                            w-9 h-11 rounded-xl border-2 transition-all duration-500 mt-1
                                            ${status === 'none' ? 'border-slate-200 bg-white' : ''}
                                            ${status === 'problem' ? 'border-red-400 bg-red-50 ring-4 ring-red-500/10' : ''}
                                            ${status === 'treatment' ? 'border-[#137fec]/40 bg-blue-50 ring-4 ring-blue-500/10' : ''}
                                            ${status === 'healthy' ? 'border-emerald-400 bg-emerald-50 ring-4 ring-emerald-500/10' : ''}
                                            ${status === 'absent' ? 'border-slate-300 bg-slate-100 opacity-50' : ''}
                                            ${selectedTooth === tooth && status === 'none' ? 'border-[#137fec]/30 bg-blue-50/50' : ''}
                                        `}>
                                            {status !== 'none' && status !== 'absent' && (
                                                <div className={`w-full h-full flex items-center justify-center opacity-30`}>
                                                    <div className={`w-4 h-4 rounded-full ${TYPE_COLORS[status]}`}></div>
                                                </div>
                                            )}
                                        </div>

                                        <div className={`w-2 h-2 rounded-full mt-2 transition-all ${status !== 'none' ? TYPE_COLORS[status] : 'bg-slate-200 opacity-0 group-hover:opacity-100'}`}></div>
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>

                <div className="mt-12 flex justify-center gap-8 pt-8 border-t border-slate-50">
                    <LegendItem color="bg-[#137fec]" label="Tratamiento Realizado" />
                    <LegendItem color="bg-red-500" label="Caries / Problema" />
                    <LegendItem color="bg-emerald-500" label="Pieza Sana" />
                    <LegendItem color="bg-slate-300" label="Implante / Ausente" />
                </div>
            </div>

            {selectedTooth && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-6 duration-500">
                    {/* Panel de Detalles de la Pieza */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-200/60 p-10 shadow-sm space-y-8 flex flex-col">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-32 bg-blue-50 rounded-3xl flex items-center justify-center text-[#137fec] border border-blue-100 shadow-inner">
                                <span className="text-4xl font-black italic tracking-tighter">#{selectedTooth}</span>
                            </div>
                            <div>
                                <h4 className="text-2xl font-black italic tracking-tighter text-slate-800 uppercase">Resumen Pieza</h4>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Status: {getToothStatus(selectedTooth) === 'none' ? 'Sin Hallazgos' : TYPE_LABELS[getToothStatus(selectedTooth) as FindingType]}</p>
                            </div>
                        </div>

                        <div className="flex-1 space-y-4">
                            <button
                                onClick={() => {
                                    setEditingFinding(null);
                                    setNewFinding({ type: 'healthy', description: '' });
                                    setShowModal(true);
                                }}
                                className="w-full bg-[#137fec] hover:bg-blue-600 text-white p-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 active:scale-95"
                            >
                                <Plus size={20} /> Registrar Hallazgo
                            </button>
                            <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-500 p-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-3">
                                <History size={18} /> Ver Plan Sugerido
                            </button>
                        </div>
                    </div>

                    {/* Panel de Historial de Hallazgos */}
                    <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
                        <div className="px-10 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <ClipboardList size={22} className="text-[#137fec]" />
                                <h3 className="font-black italic text-lg text-slate-800 uppercase tracking-tight">Registro de Hallazgos</h3>
                            </div>
                            <span className="px-4 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                {findings[selectedTooth]?.length || 0} Registros
                            </span>
                        </div>

                        <div className="p-10 flex-1 max-h-[400px] overflow-y-auto custom-scrollbar">
                            {!findings[selectedTooth] || findings[selectedTooth].length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40 py-10">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                                        <Info size={32} className="text-slate-400" />
                                    </div>
                                    <p className="text-xs font-black uppercase tracking-widest text-slate-500">No hay hallazgos registrados para esta pieza</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {findings[selectedTooth].map(finding => (
                                        <div key={finding.id} className="group bg-slate-50/50 hover:bg-white border border-slate-100 hover:border-[#137fec]/30 rounded-3xl p-6 transition-all flex items-start gap-5 relative">
                                            <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${TYPE_COLORS[finding.type]}`}></div>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex justify-between items-start">
                                                    <span className="text-[10px] font-black text-[#137fec] uppercase tracking-widest">{TYPE_LABELS[finding.type]}</span>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase whitespace-nowrap">{finding.date}</span>
                                                </div>
                                                <p className="text-sm font-bold text-slate-700 leading-relaxed">{finding.description}</p>
                                                <p className="text-[10px] font-bold text-slate-400 italic">Registrado por: {finding.professional}</p>
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => openEditModal(finding)}
                                                    className="p-3 hover:bg-blue-50 rounded-2xl text-[#137fec] transition-all active:scale-90"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteFinding(finding.id)}
                                                    className="p-3 hover:bg-red-50 rounded-2xl text-red-400 transition-all active:scale-90"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para Registrar/Editar Hallazgo */}
            {showModal && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl p-10 space-y-10 animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-6">
                            <div>
                                <h4 className="text-2xl font-black italic tracking-tighter text-slate-800 uppercase">
                                    {editingFinding ? 'Editar Hallazgo' : 'Nuevo Hallazgo'}
                                </h4>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Pieza Dental #{selectedTooth}</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo de Hallazgo</p>
                                <div className="grid grid-cols-2 gap-4">
                                    {(Object.keys(TYPE_COLORS) as FindingType[]).map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setNewFinding(prev => ({ ...prev, type }))}
                                            className={`
                                                flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-[11px] font-black uppercase tracking-tight
                                                ${newFinding.type === type
                                                    ? 'border-[#137fec] bg-blue-50 text-[#137fec] ring-4 ring-blue-500/5'
                                                    : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'}
                                            `}
                                        >
                                            <div className={`w-3 h-3 rounded-full ${TYPE_COLORS[type]}`}></div>
                                            {TYPE_LABELS[type]}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Observaciones / Detalles</p>
                                <textarea
                                    value={newFinding.description}
                                    onChange={(e) => setNewFinding(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Describa el estado de la pieza o el tratamiento a realizar..."
                                    className="w-full h-32 bg-slate-50 border-2 border-slate-100 rounded-3xl p-6 text-sm font-bold text-slate-700 outline-none focus:border-[#137fec]/30 focus:bg-white transition-all resize-none shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 py-5 bg-slate-100 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-200 transition-all active:scale-95"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveFinding}
                                className="flex-2 py-5 bg-[#137fec] rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-blue-500/20 hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:scale-95"
                            >
                                <Check size={20} /> {editingFinding ? 'Actualizar Registro' : 'Confirmar Hallazgo'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const LegendItem: React.FC<{ color: string; label: string }> = ({ color, label }) => (
    <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${color}`}></div>
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{label}</span>
    </div>
);

export default Odontogram;
