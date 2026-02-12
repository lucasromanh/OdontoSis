import React from 'react';
import { DollarSign, Plus, Printer, Download, Clock, CheckCircle2, X, Check, Save, User, Building2, MapPin, Hash, Trash2, CreditCard } from 'lucide-react';
import { ToastType } from './Notifications';

interface Treatment {
    id: string;
    description: string;
    unitPrice: number;
    quantity: number;
}

interface Budget {
    id: string;
    number: string;
    date: string;
    status: 'Pendiente' | 'Aprobado' | 'Completado' | 'Rechazado';
    patientName: string;
    patientDni: string;
    professionalName: string;
    treatments: Treatment[];
    total: number;
    amountPaid: number;
}

const CLINIC_DATA = {
    name: "Clínica Odontológica CITTA",
    address: "Av. Libertador 1234, CABA, Argentina",
    cuit: "30-12345678-9",
    phone: "+54 11 4444-5555",
    email: "administracion@citta.com.ar"
};

const Budgets: React.FC<{
    addToast?: (msg: string, type: ToastType) => void;
    patientId?: string;
    patientName?: string;
}> = ({ addToast, patientId, patientName }) => {
    // Cargar presupuestos específicos del paciente desde localStorage
    const loadPatientBudgets = () => {
        if (!patientId) return [];
        const stored = localStorage.getItem(`patient_budgets_${patientId}`);
        return stored ? JSON.parse(stored) : [];
    };

    const [budgets, setBudgets] = React.useState<Budget[]>(loadPatientBudgets());

    const [showNewModal, setShowNewModal] = React.useState(false);
    const [showPreviewModal, setShowPreviewModal] = React.useState<Budget | null>(null);
    const [showPaymentModal, setShowPaymentModal] = React.useState<Budget | null>(null);
    const [paymentAmount, setPaymentAmount] = React.useState(0);

    // New Budget Form State
    // Guardar presupuestos en localStorage cuando cambien
    React.useEffect(() => {
        if (patientId && budgets.length >= 0) {
            localStorage.setItem(`patient_budgets_${patientId}`, JSON.stringify(budgets));
        }
    }, [budgets, patientId]);

    // Recargar presupuestos cuando cambie el paciente
    React.useEffect(() => {
        setBudgets(loadPatientBudgets());
    }, [patientId]);

    const [newBudget, setNewBudget] = React.useState<Partial<Budget>>({
        number: `PRE-2026-${String(budgets.length + 1).padStart(3, '0')}`,
        date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: 'Pendiente',
        patientName: patientName || '',
        patientDni: '',
        professionalName: 'Dr. Lucas Román',
        treatments: [{ id: '1', description: '', unitPrice: 0, quantity: 1 }],
        total: 0,
        amountPaid: 0
    });

    const calculateTotal = (treatments: Treatment[]) => {
        return treatments.reduce((acc, t) => acc + (t.unitPrice * t.quantity), 0);
    };

    const handleAddTreatment = () => {
        const nextId = (newBudget.treatments?.length || 0) + 1;
        const updated = [...(newBudget.treatments || []), { id: nextId.toString(), description: '', unitPrice: 0, quantity: 1 }];
        setNewBudget({ ...newBudget, treatments: updated, total: calculateTotal(updated as Treatment[]) });
    };

    const handleUpdateTreatment = (id: string, field: keyof Treatment, value: any) => {
        const updated = newBudget.treatments?.map(t =>
            t.id === id ? { ...t, [field]: value } : t
        ) || [];
        setNewBudget({ ...newBudget, treatments: updated, total: calculateTotal(updated as Treatment[]) });
    };

    const handleSaveBudget = () => {
        if (!newBudget.treatments?.[0]?.description) {
            addToast?.("Agrega al menos un tratamiento", "error");
            return;
        }
        const budgetToSave = {
            ...newBudget,
            id: Math.random().toString(36).substr(2, 9),
        } as Budget;
        setBudgets([budgetToSave, ...budgets]);
        setShowNewModal(false);
        addToast?.("Presupuesto guardado con éxito", "success");
    };

    const handleProcessPayment = () => {
        if (!showPaymentModal || paymentAmount <= 0) return;

        const updatedBudgets = budgets.map(b => {
            if (b.id === showPaymentModal.id) {
                const newPaid = b.amountPaid + paymentAmount;
                return {
                    ...b,
                    amountPaid: newPaid,
                    status: newPaid >= b.total ? 'Completado' : b.status
                };
            }
            return b;
        });

        setBudgets(updatedBudgets);
        setShowPaymentModal(null);
        setPaymentAmount(0);
        addToast?.("Pago registrado correctamente", "success");
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Aprobado': return 'text-emerald-500 bg-emerald-50';
            case 'Pendiente': return 'text-[#137fec] bg-blue-50';
            case 'Completado': return 'text-slate-400 bg-slate-50';
            case 'Rechazado': return 'text-red-500 bg-red-50';
            default: return 'text-slate-400 bg-slate-50';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-black italic tracking-tight text-slate-800 uppercase">Presupuestos y Tratamientos</h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Control de costos y aprobaciones</p>
                </div>
                <button
                    onClick={() => setShowNewModal(true)}
                    className="flex items-center gap-2 px-8 py-3 bg-[#137fec] rounded-2xl text-[10px] font-black uppercase text-white shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all active:scale-95"
                >
                    <Plus size={18} /> Nuevo Presupuesto
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Treatments List */}
                <div className="xl:col-span-8 space-y-4">
                    {budgets.map(b => (
                        <div key={b.id} className="bg-white rounded-[2rem] border border-slate-200/60 p-6 flex flex-col md:flex-row md:items-center justify-between shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all gap-6 group">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getStatusColor(b.status)}`}>
                                    <DollarSign size={20} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-slate-800 uppercase italic leading-none">{b.number}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">
                                        {b.treatments.length} Tratamientos • {b.professionalName}
                                    </p>
                                    <div className="flex items-center gap-3 mt-2 text-[9px] font-black text-slate-400 uppercase tracking-widest px-2 py-0.5 bg-slate-50 rounded-full w-fit">
                                        <span className="flex items-center gap-1"><Clock size={10} /> {b.date}</span>
                                        <span className={`flex items-center gap-1 ${getStatusColor(b.status).split(' ')[0]}`}>
                                            <CheckCircle2 size={10} /> {b.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between md:justify-end gap-8">
                                <div className="text-right">
                                    <p className="text-xs font-black text-slate-300 uppercase tracking-tighter">TOTAL</p>
                                    <span className="text-lg font-black italic text-slate-800 tracking-tighter">${b.total.toFixed(2)}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowPreviewModal(b)}
                                        className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-[#137fec] transition-colors"
                                        title="Vista Previa / Imprimir"
                                    >
                                        <Printer size={16} />
                                    </button>
                                    <button
                                        onClick={() => setShowPreviewModal(b)}
                                        className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-[#137fec] transition-colors"
                                        title="Descargar PDF"
                                    >
                                        <Download size={16} />
                                    </button>
                                    {b.total - b.amountPaid > 0 && (
                                        <button
                                            onClick={() => {
                                                setShowPaymentModal(b);
                                                setPaymentAmount(b.total - b.amountPaid);
                                            }}
                                            className="p-2.5 bg-emerald-50 rounded-xl text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                                            title="Realizar Pago"
                                        >
                                            <CreditCard size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Billing Summary Sidebar */}
                <div className="xl:col-span-4 space-y-6">
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#137fec]/20 rounded-full blur-3xl"></div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#137fec] mb-6">Estado Consolidado</h4>
                        <div className="space-y-6">
                            <div>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">TOTAL PRESUPUESTADO</p>
                                <p className="text-4xl font-black italic tracking-tighter">
                                    ${budgets.reduce((acc, b) => acc + b.total, 0).toLocaleString()}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                                    <p className="text-[9px] font-black text-slate-500 uppercase mb-1">PAGADO</p>
                                    <p className="text-lg font-black text-emerald-400">
                                        ${budgets.reduce((acc, b) => acc + b.amountPaid, 0).toLocaleString()}
                                    </p>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                                    <p className="text-[9px] font-black text-slate-500 uppercase mb-1">PENDIENTE</p>
                                    <p className="text-lg font-black text-red-400">
                                        ${(budgets.reduce((acc, b) => acc + (b.total - b.amountPaid), 0)).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] border border-slate-200/60 p-6 shadow-sm">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-800 mb-4 px-2">Histórico de Cobros</h5>
                        <div className="space-y-4">
                            {[1, 2].map(i => (
                                <div key={i} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center">
                                            <CheckCircle2 size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-bold text-slate-700 uppercase">Recibo #0023{i}</p>
                                            <p className="text-[9px] font-black text-slate-400 uppercase">15 Ene, 2026</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-black italic text-slate-800">$235.00</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal: New Budget */}
            {showNewModal && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] w-full max-w-4xl shadow-2xl p-10 space-y-8 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-6">
                            <div>
                                <h4 className="text-2xl font-black italic tracking-tighter text-slate-800 uppercase">Nuevo Presupuesto</h4>
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">{newBudget.number}</p>
                            </div>
                            <button onClick={() => setShowNewModal(false)} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                            <div className="space-y-4">
                                <h5 className="text-[10px] font-black uppercase text-[#137fec] tracking-widest">Datos del Paciente</h5>
                                <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#137fec]"><User size={20} /></div>
                                    <div>
                                        <p className="text-xs font-black uppercase text-slate-800">{newBudget.patientName}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">DNI: {newBudget.patientDni}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h5 className="text-[10px] font-black uppercase text-[#137fec] tracking-widest">Profesional Asignado</h5>
                                <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100">
                                    <div className="w-10 h-10 rounded-full bg-[#137fec] flex items-center justify-center text-white"><User size={20} /></div>
                                    <div>
                                        <p className="text-xs font-black uppercase text-slate-800">{newBudget.professionalName}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Matrícula: MN 45.231</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-2">
                                <h5 className="text-[10px] font-black uppercase text-[#137fec] tracking-widest">Tratamientos a Realizar</h5>
                                <button
                                    onClick={handleAddTreatment}
                                    className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-600 hover:scale-105 transition-all"
                                >
                                    <Plus size={14} /> Añadir Fila
                                </button>
                            </div>
                            <div className="space-y-3">
                                {newBudget.treatments?.map((t) => (
                                    <div key={t.id} className="grid grid-cols-12 gap-4 items-center animate-in slide-in-from-left-2 duration-300">
                                        <div className="col-span-6">
                                            <input
                                                type="text"
                                                placeholder="Descripción del tratamiento..."
                                                className="w-full px-5 py-3 bg-white border border-slate-200 rounded-2xl text-[11px] font-black focus:ring-2 focus:ring-[#137fec]/20 outline-none uppercase"
                                                value={t.description}
                                                onChange={(e) => handleUpdateTreatment(t.id, 'description', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <div className="relative">
                                                <DollarSign size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="number"
                                                    placeholder="Precio"
                                                    className="w-full pl-8 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-[11px] font-black focus:ring-2 focus:ring-[#137fec]/20 outline-none"
                                                    value={t.unitPrice || ''}
                                                    onChange={(e) => handleUpdateTreatment(t.id, 'unitPrice', parseFloat(e.target.value))}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <input
                                                type="number"
                                                placeholder="Cant"
                                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-[11px] font-black text-center focus:ring-2 focus:ring-[#137fec]/20 outline-none"
                                                value={t.quantity}
                                                onChange={(e) => handleUpdateTreatment(t.id, 'quantity', parseInt(e.target.value))}
                                            />
                                        </div>
                                        <div className="col-span-1 flex justify-center">
                                            <button className="text-red-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-100 gap-6">
                            <div className="text-left">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">TOTAL ESTIMADO</p>
                                <p className="text-3xl font-black italic tracking-tighter text-slate-800">${newBudget.total?.toLocaleString()}</p>
                            </div>
                            <div className="flex gap-4 w-full md:w-auto">
                                <button
                                    onClick={() => setShowNewModal(false)}
                                    className="flex-1 md:px-10 py-4 bg-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-200 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSaveBudget}
                                    className="flex-1 md:px-10 py-4 bg-[#137fec] rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-blue-500/20 hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                                >
                                    <Save size={18} /> Generar Presupuesto
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Document Preview (Skeleton) */}
            {showPreviewModal && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="bg-white rounded-[3rem] w-full max-w-3xl shadow-2xl p-12 space-y-10 animate-in zoom-in-95 duration-300 max-h-[95vh] overflow-y-auto relative">
                        {/* Header skeleton */}
                        <div className="flex justify-between items-start">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-[#137fec]">
                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
                                        <Building2 size={24} />
                                    </div>
                                    <h1 className="text-xl font-black italic tracking-tighter uppercase">{CLINIC_DATA.name}</h1>
                                </div>
                                <div className="space-y-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    <p className="flex items-center gap-2"><MapPin size={12} /> {CLINIC_DATA.address}</p>
                                    <p className="flex items-center gap-2"><Hash size={12} /> CUIT: {CLINIC_DATA.cuit}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <h2 className="text-4xl font-black italic tracking-tighter text-slate-800 uppercase">Presupuesto</h2>
                                <p className="text-xs font-black text-[#137fec] uppercase tracking-widest mt-2">{showPreviewModal.number}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">FECHA: {showPreviewModal.date}</p>
                            </div>
                        </div>

                        {/* Customer & Professional Data Box */}
                        <div className="grid grid-cols-2 gap-8 py-8 border-y border-slate-100">
                            <div className="space-y-3">
                                <p className="text-[10px] font-black text-[#137fec] uppercase tracking-widest">PARA EL PACIENTE:</p>
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-slate-800 uppercase">{showPreviewModal.patientName}</p>
                                    <p className="text-[11px] font-bold text-slate-500 uppercase">DNI: {showPreviewModal.patientDni}</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <p className="text-[10px] font-black text-[#137fec] uppercase tracking-widest">REALIZADO POR:</p>
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-slate-800 uppercase">{showPreviewModal.professionalName}</p>
                                    <p className="text-[11px] font-bold text-slate-500 uppercase">Matrícula PROF: MN 45.231</p>
                                </div>
                            </div>
                        </div>

                        {/* Treatments Table */}
                        <div className="space-y-6">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b-2 border-slate-800">
                                        <th className="py-4 text-[10px] font-black uppercase text-slate-800">DESCRIPCIÓN DEL TRATAMIENTO</th>
                                        <th className="py-4 text-[10px] font-black uppercase text-slate-800 text-center">CANT</th>
                                        <th className="py-4 text-[10px] font-black uppercase text-slate-800 text-right">UNITARIO</th>
                                        <th className="py-4 text-[10px] font-black uppercase text-slate-800 text-right">SUBTOTAL</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {showPreviewModal.treatments.map((t, idx) => (
                                        <tr key={idx}>
                                            <td className="py-5 text-sm font-black text-slate-700 uppercase italic">{t.description}</td>
                                            <td className="py-5 text-sm font-black text-slate-500 text-center">{t.quantity}</td>
                                            <td className="py-5 text-sm font-black text-slate-500 text-right">${t.unitPrice.toLocaleString()}</td>
                                            <td className="py-5 text-sm font-black text-slate-800 text-right">${(t.unitPrice * t.quantity).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Totals Section */}
                        <div className="flex justify-end pt-8">
                            <div className="w-64 space-y-3">
                                <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                    <span>Subtotal</span>
                                    <span>${showPreviewModal.total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                    <span>IVA (0%)</span>
                                    <span>$0</span>
                                </div>
                                <div className="flex justify-between items-center py-4 border-t-2 border-slate-800 mt-4">
                                    <span className="text-sm font-black text-slate-800 uppercase">Total Final</span>
                                    <span className="text-2xl font-black italic tracking-tighter text-slate-800">${showPreviewModal.total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 border-t border-slate-100 pt-10 no-print">
                            <button
                                onClick={() => setShowPreviewModal(null)}
                                className="flex-1 py-4 bg-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500"
                            >
                                Cerrar
                            </button>
                            <button
                                onClick={() => {
                                    addToast?.("Preparando documento para impresión", "loading");
                                    setTimeout(() => window.print(), 1000);
                                }}
                                className="flex-1 py-4 bg-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white flex items-center justify-center gap-2"
                            >
                                <Printer size={18} /> Imprimir Presupuesto
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Process Payment */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] w-full max-w-sm shadow-2xl p-10 space-y-8 animate-in zoom-in-95 duration-300">
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <DollarSign size={32} />
                            </div>
                            <h4 className="text-xl font-black italic tracking-tighter text-slate-800 uppercase">Registrar Cobro</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{showPaymentModal.number}</p>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Monto a Cobrar</p>
                                <p className="text-4xl font-black italic tracking-tighter text-slate-800">${paymentAmount.toLocaleString()}</p>
                            </div>

                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Método de Pago</p>
                                <select className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-[11px] font-black uppercase outline-none focus:ring-2 focus:ring-[#137fec]/20">
                                    <option>Efectivo</option>
                                    <option>Transferencia Bancaria</option>
                                    <option>Tarjeta de Crédito / Débito</option>
                                    <option>Mercado Pago</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleProcessPayment}
                                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <Check size={18} /> Confirmar Pago
                            </button>
                            <button
                                onClick={() => setShowPaymentModal(null)}
                                className="w-full py-4 bg-slate-100 hover:bg-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 transition-all"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Budgets;
