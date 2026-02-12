import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, UserPlus, DollarSign, Calendar, Eye, Edit, Link, Clock, Plus, Users, Search, Trash2, FileText } from 'lucide-react';
import { ToastType } from './Notifications';

interface Appointment {
    id: string;
    patientId: string;
    patientName: string;
    treatment: string;
    date: string; // YYYY-MM-DD
    startTime: string; // HH:MM
    endTime: string; // HH:MM
    status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
    notes?: string;
    cost?: number;
    paid?: number;
}

interface GlobalNote {
    id: string;
    text: string;
    date: string;
    attachment?: { name: string; url: string };
}

interface DashboardProps {
    setActiveTab: (tab: string) => void;
    onSearchChange: (value: string) => void;
    addToast?: (msg: string, type: ToastType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveTab, onSearchChange, addToast }) => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [patients, setPatients] = useState<any[]>([]);
    const [currentNoteText, setCurrentNoteText] = useState('');
    const [globalNotes, setGlobalNotes] = useState<GlobalNote[]>(() => {
        const stored = localStorage.getItem('dashboard_global_notes');
        return stored ? JSON.parse(stored) : [];
    });

    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
    const [showPatientSelector, setShowPatientSelector] = useState(false);
    const [patientSearch, setPatientSearch] = useState('');
    const [isAttaching, setIsAttaching] = useState(false);
    const [attachmentLink, setAttachmentLink] = useState('');

    useEffect(() => {
        const storedAppointments = localStorage.getItem('appointments');
        const storedPatients = localStorage.getItem('patients');

        if (storedAppointments) setAppointments(JSON.parse(storedAppointments));
        if (storedPatients) setPatients(JSON.parse(storedPatients));
    }, []);

    useEffect(() => {
        localStorage.setItem('dashboard_global_notes', JSON.stringify(globalNotes));
    }, [globalNotes]);

    const today = new Date().toISOString().split('T')[0];

    // Stats Calculations
    const todayAppointments = useMemo(() =>
        appointments.filter(apt => apt.date === today),
        [appointments, today]);

    const pendingPayments = useMemo(() => {
        return appointments.reduce((acc, apt) => {
            const cost = apt.cost || 0;
            const paid = apt.paid || 0;
            return acc + (cost - paid);
        }, 0);
    }, [appointments]);

    const newPatientsThisMonth = useMemo(() => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        return patients.filter(p => (p.createdAt || '') >= startOfMonth).length;
    }, [patients]);

    const totalIncome = useMemo(() =>
        appointments.reduce((acc, apt) => acc + (apt.paid || 0), 0),
        [appointments]);

    // Derived Lists
    const recentPatients = useMemo(() => {
        return [...patients].reverse().slice(0, 3);
    }, [patients]);

    const sortedDailyAgenda = useMemo(() =>
        [...todayAppointments].sort((a, b) => a.startTime.localeCompare(b.startTime)),
        [todayAppointments]);

    const filteredPatients = useMemo(() => {
        if (!patientSearch) return patients.slice(0, 5);
        return patients.filter(p => p.name.toLowerCase().includes(patientSearch.toLowerCase())).slice(0, 5);
    }, [patients, patientSearch]);

    const selectedPatient = useMemo(() =>
        patients.find(p => p.id === selectedPatientId),
        [patients, selectedPatientId]);

    const saveNote = () => {
        if (!currentNoteText.trim()) {
            addToast?.('Escribe algo antes de guardar', 'error');
            return;
        }

        if (selectedPatientId) {
            // Guardar nota en el historial del paciente
            const updatedPatients = patients.map(p => {
                if (p.id === selectedPatientId) {
                    const newTreatments = [...(p.treatments || [])];
                    newTreatments.push({
                        id: Math.random(),
                        date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
                        name: "Nota Evolutiva - Dashboard",
                        professional: "Dr. Lucas Román",
                        status: "Completado",
                        notes: currentNoteText + (attachmentLink ? `\nAdjunto: ${attachmentLink}` : ''),
                        cost: 0
                    });
                    return { ...p, treatments: newTreatments };
                }
                return p;
            });
            localStorage.setItem('patients', JSON.stringify(updatedPatients));
            setPatients(updatedPatients);
            addToast?.(`Nota guardada en ficha de ${selectedPatient?.name}`, 'success');
        } else {
            // Guardar como nota rápida global en la lista
            const newNote: GlobalNote = {
                id: Math.random().toString(36).substr(2, 9),
                text: currentNoteText,
                date: new Date().toLocaleString(),
                attachment: attachmentLink ? { name: 'Enlace adjunto', url: attachmentLink } : undefined
            };
            setGlobalNotes([newNote, ...globalNotes]);
            addToast?.('Nota rápida agregada al historial', 'success');
        }

        // Limpiar
        setCurrentNoteText('');
        setAttachmentLink('');
        setIsAttaching(false);
        setSelectedPatientId(null);
    };

    const deleteGlobalNote = (id: string) => {
        setGlobalNotes(globalNotes.filter(n => n.id !== id));
        addToast?.('Nota eliminada', 'info');
    };

    const handlePatientAction = (patientName: string) => {
        onSearchChange(patientName);
        setActiveTab('patients');
    };

    return (
        <div className="p-10 space-y-8 animate-in fade-in duration-500">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 rounded-[2.5rem] bg-[#137fec] text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-white/70 text-xs font-medium mb-1">Citas de Hoy</p>
                        <h3 className="text-4xl font-black italic tracking-tighter">{todayAppointments.length}</h3>
                        <div className="mt-4 flex items-center gap-1.5 text-[10px] font-bold text-white/80">
                            <TrendingUp size={14} />
                            <span>Datos en tiempo real</span>
                        </div>
                    </div>
                    <Calendar className="absolute -right-6 -bottom-6 w-32 h-32 opacity-10 group-hover:rotate-12 transition-transform duration-500" />
                </div>

                <StatCard
                    icon={<Clock className="text-orange-500" size={22} />}
                    iconBg="bg-orange-50"
                    badge="Atención"
                    badgeColor="text-orange-500 bg-orange-50"
                    label="Pagos Pendientes"
                    value={`$${pendingPayments.toLocaleString()}`}
                    subtext="Balance por cobrar"
                />

                <StatCard
                    icon={<UserPlus className="text-emerald-500" size={22} />}
                    iconBg="bg-emerald-50"
                    badge="+12%"
                    badgeColor="text-emerald-500 bg-emerald-50"
                    label="Nuevos Pacientes"
                    value={newPatientsThisMonth.toString()}
                    subtext="Total registrados este mes"
                />

                <StatCard
                    icon={<DollarSign className="text-violet-500" size={22} />}
                    iconBg="bg-violet-50"
                    label="Ingresos Totales"
                    value={`$${totalIncome.toLocaleString()}`}
                    subtext="Rendimiento histórico acumulado"
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                <div className="xl:col-span-8 space-y-8">
                    {/* Recent Patients */}
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                            <h2 className="font-bold text-xl text-slate-800">Pacientes Recientes</h2>
                            <button
                                onClick={() => setActiveTab('patients')}
                                className="text-[#137fec] text-xs font-bold hover:underline"
                            >
                                Ver Todos
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                        <th className="px-8 py-4 font-bold">Nombre del Paciente</th>
                                        <th className="px-8 py-4 font-bold">Tratamiento</th>
                                        <th className="px-8 py-4 font-bold">Última Visita</th>
                                        <th className="px-8 py-4 font-bold">Estado</th>
                                        <th className="px-8 py-4 font-bold text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {recentPatients.length > 0 ? (
                                        recentPatients.map((p, idx) => (
                                            <PatientRow
                                                key={p.id || idx}
                                                name={p.name}
                                                initials={p.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substr(0, 2)}
                                                treatment={p.treatments?.[p.treatments.length - 1]?.treatment || p.treatments?.[p.treatments.length - 1]?.name || "Consulta General"}
                                                date={p.lastVisit || "Hoy"}
                                                status="Registrado"
                                                statusColor="bg-blue-50 text-blue-600"
                                                onAction={() => handlePatientAction(p.name)}
                                            />
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-8 py-10 text-center text-slate-400 text-sm italic">
                                                No hay pacientes registrados recientemente
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Notes Section with History */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* New Note Editor */}
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 p-8 flex flex-col h-full">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-6 bg-[#137fec] rounded-full"></div>
                                    <h2 className="font-bold text-xl text-slate-800">Bloc de Notas</h2>
                                </div>

                                <div className="relative">
                                    <button
                                        onClick={() => setShowPatientSelector(!showPatientSelector)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedPatientId ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                    >
                                        <Users size={14} />
                                        {selectedPatient ? selectedPatient.name : 'Asignar a Paciente'}
                                    </button>

                                    {showPatientSelector && (
                                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-30 animate-in zoom-in-95 duration-200">
                                            <div className="relative mb-2">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={12} />
                                                <input
                                                    type="text"
                                                    placeholder="Buscar paciente..."
                                                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border-none rounded-lg text-[10px] outline-none focus:ring-1 focus:ring-blue-100"
                                                    value={patientSearch}
                                                    onChange={(e) => setPatientSearch(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <button
                                                    onClick={() => { setSelectedPatientId(null); setShowPatientSelector(false); }}
                                                    className="w-full text-left px-3 py-2 rounded-lg text-[10px] font-bold text-slate-400 hover:bg-slate-50 transition-colors"
                                                >
                                                    Nota Rápida (Sin paciente)
                                                </button>
                                                {filteredPatients.map(p => (
                                                    <button
                                                        key={p.id}
                                                        onClick={() => { setSelectedPatientId(p.id); setShowPatientSelector(false); }}
                                                        className="w-full text-left px-3 py-2 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2"
                                                    >
                                                        <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[8px]">{p.name[0]}</div>
                                                        {p.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <textarea
                                className="w-full flex-1 min-h-[150px] bg-slate-50/50 border border-slate-100 rounded-[1.5rem] p-6 text-sm text-slate-600 focus:ring-1 focus:ring-blue-200 outline-none resize-none transition-all placeholder:text-slate-400"
                                placeholder={selectedPatientId ? `Escribe una nota clínica para la ficha de ${selectedPatient?.name}...` : "Escribe aquí una nota rápida..."}
                                value={currentNoteText}
                                onChange={(e) => setCurrentNoteText(e.target.value)}
                            />

                            {isAttaching && (
                                <div className="mt-4 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                    <Link size={16} className="text-blue-500" />
                                    <input
                                        type="text"
                                        placeholder="Pega un enlace o nombre de archivo..."
                                        className="bg-transparent border-none outline-none text-xs text-blue-700 flex-1 font-bold"
                                        value={attachmentLink}
                                        onChange={(e) => setAttachmentLink(e.target.value)}
                                    />
                                    <button onClick={() => setAttachmentLink('')} className="p-1 hover:bg-blue-100 rounded-lg"><Trash2 size={12} className="text-blue-400" /></button>
                                </div>
                            )}

                            <div className="mt-4 flex justify-between items-center">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsAttaching(!isAttaching)}
                                        className={`p-3 transition-colors rounded-xl border ${isAttaching ? 'bg-blue-100 text-blue-600 border-blue-200' : 'text-slate-400 hover:text-[#137fec] bg-slate-50 border-slate-100'}`}
                                        title="Adjuntar enlace/referencia"
                                    >
                                        <Link size={18} />
                                    </button>
                                </div>
                                <button
                                    onClick={saveNote}
                                    className="px-8 py-3 bg-[#137fec] text-white text-sm font-bold rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/10 active:scale-95 flex items-center gap-2"
                                >
                                    <Plus size={16} />
                                    {selectedPatientId ? 'Guardar en Ficha' : 'Guardar'}
                                </button>
                            </div>
                        </div>

                        {/* Note History */}
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 p-8 flex flex-col h-full max-h-[400px]">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-lg text-slate-800">Notas Guardadas</h3>
                                <span className="px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest">{globalNotes.length} Notas</span>
                            </div>
                            <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
                                {globalNotes.length > 0 ? (
                                    globalNotes.map(note => (
                                        <div key={note.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 relative group animate-in slide-in-from-right-2">
                                            <button
                                                onClick={() => deleteGlobalNote(note.id)}
                                                className="absolute top-2 right-2 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{note.date}</span>
                                            </div>
                                            <p className="text-xs text-slate-600 leading-relaxed font-medium mb-2">{note.text}</p>
                                            {note.attachment && (
                                                <div className="flex items-center gap-2 px-2 py-1.5 bg-white rounded-lg border border-slate-200 w-fit">
                                                    <Link size={10} className="text-blue-500" />
                                                    <span className="text-[9px] font-bold text-blue-600 truncate max-w-[150px]">{note.attachment.url}</span>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                        <FileText size={48} className="text-slate-200 mb-4" />
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Historial vacío</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Agenda */}
                <div className="xl:col-span-4 bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 flex flex-col h-full overflow-hidden">
                    <div className="p-8 border-b border-slate-50">
                        <div className="flex justify-between items-center mb-1">
                            <h2 className="font-bold text-xl text-slate-800">Agenda del Día</h2>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 font-medium">Tienes {todayAppointments.length} citas para hoy</p>
                    </div>
                    <div className="flex-1 p-8 space-y-8 overflow-y-auto max-h-[500px] custom-scrollbar">
                        {sortedDailyAgenda.length > 0 ? (
                            sortedDailyAgenda.map(apt => (
                                <AgendaItem
                                    key={apt.id}
                                    time={apt.startTime}
                                    name={apt.patientName}
                                    spec={apt.treatment}
                                    status={apt.status === 'pending' ? 'Pendiente' : apt.status === 'in-progress' ? 'En Curso' : 'Completado'}
                                    color={apt.status === 'in-progress' ? "border-blue-500" : apt.status === 'completed' ? "border-emerald-500" : "border-slate-200 border-dashed"}
                                    bg={apt.status === 'in-progress' ? "bg-blue-50" : apt.status === 'completed' ? "bg-emerald-50" : "bg-white border border-slate-100"}
                                    textColor={apt.status === 'in-progress' ? "text-blue-600" : apt.status === 'completed' ? "text-emerald-600" : "text-slate-400"}
                                />
                            ))
                        ) : (
                            <div className="py-10 text-center space-y-4">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                                    <Calendar className="text-slate-300" size={32} />
                                </div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">No hay turnos hoy</p>
                            </div>
                        )}
                    </div>
                    <div className="p-6 bg-slate-50/50">
                        <button
                            onClick={() => setActiveTab('appointments')}
                            className="w-full py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
                        >
                            <Plus size={18} />
                            Nueva Cita
                        </button>
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
    <div className="p-6 rounded-[2.5rem] bg-white shadow-sm border border-slate-200/60 hover:shadow-xl transition-all duration-300 group active:scale-[0.98]">
        <div className="flex justify-between items-start mb-5">
            <div className={`p-4 ${iconBg} rounded-[1.25rem] shadow-inner`}>{icon}</div>
            {badge && <span className={`text-[9px] font-black ${badgeColor} px-2.5 py-1 rounded-lg uppercase tracking-wider`}>{badge}</span>}
        </div>
        <p className="text-slate-500 text-[11px] font-medium mb-1 uppercase tracking-tight">{label}</p>
        <h3 className="text-3xl font-black italic tracking-tighter text-slate-800">{value}</h3>
        <p className="mt-1 text-[10px] text-slate-400 font-medium">{subtext}</p>
    </div>
);

const PatientRow: React.FC<{ name: string; initials: string; treatment: string; date: string; status: string; statusColor: string; onAction: () => void }> = ({ name, initials, treatment, date, status, statusColor, onAction }) => (
    <tr className="hover:bg-slate-50/30 transition-colors cursor-pointer group">
        <td className="px-8 py-5">
            <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-black group-hover:bg-[#137fec] group-hover:text-white transition-all uppercase">{initials}</div>
                <span className="font-bold text-sm tracking-tight text-slate-700">{name}</span>
            </div>
        </td>
        <td className="px-8 py-5 text-sm text-slate-600 font-medium">{treatment}</td>
        <td className="px-8 py-5 text-xs text-slate-500 font-medium truncate">{date}</td>
        <td className="px-8 py-5">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.1em] ${statusColor}`}>{status}</span>
        </td>
        <td className="px-8 py-5 text-center">
            <div className="flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={(e) => { e.stopPropagation(); onAction(); }}
                    className="p-2 text-slate-400 hover:text-[#137fec] transition-colors"
                >
                    <Eye size={16} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onAction(); }}
                    className="p-2 text-slate-400 hover:text-[#137fec] transition-colors"
                >
                    <Edit size={16} />
                </button>
            </div>
        </td>
    </tr>
);

const AgendaItem: React.FC<{ time: string; name: string; spec: string; status: string; color: string; bg: string; textColor: string }> = ({ time, name, spec, status, color, bg, textColor }) => (
    <div className="flex gap-4 group">
        <div className="flex flex-col items-center">
            <div className="text-xs font-black text-slate-300 group-hover:text-slate-500 transition-colors">{time}</div>
            <div className="w-[1px] h-full min-h-[20px] bg-slate-100 my-1"></div>
        </div>
        <div className={`flex-1 p-4 rounded-[1.5rem] ${bg} border-l-4 ${color} shadow-sm group-hover:shadow-md transition-all duration-300`}>
            <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-sm text-slate-800">{name}</h4>
                <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${textColor}`}>{status}</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">{spec}</p>
        </div>
    </div>
);

export default Dashboard;
