import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
    Printer,
    FileText,
    Plus,
    Edit2,
    UserPlus,
    AlertCircle,
    Upload,
    Users,
    X,
    Check,
    Search,
    PenTool,
    Heart,
    Activity,
    FileCheck,
    Save,
    ArrowRightLeft,
    Microscope,
    Info,
    Settings as SettingsIcon,
    Trash2
} from 'lucide-react';
import Timeline from './Timeline';
import Odontogram, { Finding } from './Odontogram';
import Periodontogram from './Periodontogram';
import Documents from './Documents';
import Budgets from './Budgets';
import { ToastContainer, ToastType } from './Notifications';

const INITIAL_PATIENTS = [
    {
        id: "#DP-99283",
        name: "Maria Garcia",
        age: "34 Años",
        blood: "O+",
        lastVisit: "15 Ene, 2026",
        allergy: "Penicilina",
        avatar: "https://ui-avatars.com/api/?name=Maria+Garcia&background=137fec&color=fff&size=128",
        phone: "+54 9 11 1234-5678",
        email: "maria.garcia@email.com",
        address: "Av. Santa Fe 1234, CABA",
        treatments: [
            { id: 1, date: "15 ENE, 2026", name: "Conducto Radicular - Etapa 1", professional: "Dr. Lucas Román", status: "En Curso", notes: "Paciente con dolor agudo en pieza #46. Pulpectomía realizada.", cost: 1200 },
            { id: 2, date: "12 DIC, 2025", name: "Limpieza de Rutina y Control", professional: "Hig. Sara Mills", status: "Completado", cost: 150 }
        ],
        findings: {
            46: [{ id: "f1", type: "problem", description: "Caries Profunda / Conducto", date: "15 Ene, 2026", professional: "Dr. Lucas Román" }],
            23: [{ id: "f2", type: "treatment", description: "Extracción realizada", date: "10 Dic, 2025", professional: "Dra. Ana López" }]
        } as Record<number, Finding[]>,
        periodontalData: {}
    },
    {
        id: "#DP-99284",
        name: "Juan Pérez",
        age: "42 Años",
        blood: "A-",
        lastVisit: "10 Feb, 2026",
        allergy: "Ninguna",
        avatar: "https://ui-avatars.com/api/?name=Juan+Perez&background=137fec&color=fff&size=128",
        phone: "+54 9 11 8765-4321",
        email: "juan.perez@email.com",
        address: "Calle Falsa 123, Mendoza",
        treatments: [],
        findings: {} as Record<number, Finding[]>,
        periodontalData: {}
    }
];

const Patients: React.FC<{
    externalSearch?: string;
    onExternalSearchChange?: (val: string) => void;
    forcedSubTab?: string | null;
    onForcedSubTabHandled?: () => void;
    addToast?: (msg: string, type: ToastType) => void;
}> = ({ externalSearch, onExternalSearchChange, forcedSubTab, onForcedSubTabHandled, addToast: externalAddToast }) => {
    // Toast state (internal fallback if not provided)
    const [localToasts, setLocalToasts] = useState<any[]>([]);
    const addToast = (message: string, type: ToastType) => {
        if (externalAddToast) {
            externalAddToast(message, type);
        } else {
            const id = Math.random().toString(36).substr(2, 9);
            setLocalToasts(prev => [...prev, { id, message, type }]);
        }
    };
    const removeToast = (id: string) => {
        setLocalToasts(prev => prev.filter(t => t.id !== id));
    };
    // Cargar pacientes desde localStorage al inicio
    const [patients, setPatients] = useState(() => {
        const stored = localStorage.getItem('patients');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    // Mapear el formato de Appointment Patient al formato de Patients.tsx
                    const mapped = parsed.map((p: any) => ({
                        id: p.id || `#DP-${Math.floor(10000 + Math.random() * 90000)}`,
                        name: p.name,
                        age: p.age || "N/A",
                        blood: p.blood || "O+",
                        lastVisit: p.lastVisit || (p.treatments?.length > 0 ? p.treatments[p.treatments.length - 1].date : "Sin visitas"),
                        allergy: p.allergy || p.medicalHistory || "Ninguna",
                        avatar: p.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=137fec&color=fff&size=128`,
                        phone: p.phone || "",
                        email: p.email || "",
                        address: p.address || "",
                        treatments: p.treatments?.map((t: any, idx: number) => ({
                            id: t.id || idx + 1,
                            date: t.date || new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
                            name: t.name || t.treatment,
                            professional: t.professional || "Dr. Lucas Román",
                            status: t.status || "Completado",
                            notes: t.notes || "",
                            cost: t.cost || 0
                        })) || [],
                        findings: p.findings || {},
                        periodontalData: p.periodontalData || {}
                    }));

                    // Fusionar con INITIAL_PATIENTS evitando duplicados por nombre
                    const combined = [...INITIAL_PATIENTS];
                    mapped.forEach((mp: any) => {
                        if (!combined.some(ip => ip.name.toLowerCase() === mp.name.toLowerCase())) {
                            combined.push(mp);
                        }
                    });
                    return combined;
                }
            } catch (e) {
                console.error("Error loading patients from localStorage", e);
            }
        }
        return INITIAL_PATIENTS;
    });

    const [currentPatientIndex, setCurrentPatientIndex] = useState(0);
    const patientInfo = patients[currentPatientIndex] || patients[0];

    // Guardar pacientes en localStorage cada vez que cambien
    React.useEffect(() => {
        if (patients.length > 0) {
            localStorage.setItem('patients', JSON.stringify(patients));
        }
    }, [patients]);

    // Función para refrescar pacientes desde localStorage
    const refreshPatients = React.useCallback(() => {
        const stored = localStorage.getItem('patients');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    // Mapear el formato de Appointment Patient al formato de Patients.tsx
                    const mapped = parsed.map((p: any) => ({
                        id: p.id || `#DP-${Math.floor(10000 + Math.random() * 90000)}`,
                        name: p.name,
                        age: p.age || "N/A",
                        blood: p.blood || "O+",
                        lastVisit: p.lastVisit || (p.treatments?.length > 0 ? p.treatments[p.treatments.length - 1].date : "Sin visitas"),
                        allergy: p.allergy || p.medicalHistory || "Ninguna",
                        avatar: p.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=137fec&color=fff&size=128`,
                        phone: p.phone || "",
                        email: p.email || "",
                        address: p.address || "",
                        treatments: p.treatments?.map((t: any, idx: number) => ({
                            id: t.id || idx + 1,
                            date: t.date || new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
                            name: t.name || t.treatment,
                            professional: t.professional || "Dr. Lucas Román",
                            status: t.status || "Completado",
                            notes: t.notes || "",
                            cost: t.cost || 0
                        })) || [],
                        findings: p.findings || {},
                        periodontalData: p.periodontalData || {}
                    }));

                    // Fusionar con INITIAL_PATIENTS evitando duplicados por nombre
                    const combined = [...INITIAL_PATIENTS];
                    mapped.forEach((mp: any) => {
                        const existingIdx = combined.findIndex(ip => ip.name.toLowerCase() === mp.name.toLowerCase());
                        if (existingIdx === -1) {
                            combined.push(mp);
                        } else {
                            // Actualizar paciente existente si el de localStorage tiene más tratamientos
                            if ((mp.treatments?.length || 0) > (combined[existingIdx].treatments?.length || 0)) {
                                combined[existingIdx] = { ...combined[existingIdx], ...mp };
                            }
                        }
                    });
                    setPatients(combined);
                }
            } catch (e) {
                console.error("Error refreshing patients", e);
            }
        }
    }, []);

    // Escuchar cambios de otros componentes
    React.useEffect(() => {
        const handleRefresh = () => refreshPatients();
        window.addEventListener('patientsUpdated', handleRefresh);
        window.addEventListener('storage', handleRefresh); // Sincronizar entre pestañas
        return () => {
            window.removeEventListener('patientsUpdated', handleRefresh);
            window.removeEventListener('storage', handleRefresh);
        };
    }, [refreshPatients]);

    const [activeSubTab, setActiveSubTab] = useState('Timeline');
    const [isEditing, setIsEditing] = useState(false);

    // Modals state
    const [isNewPatientOpen, setIsNewPatientOpen] = useState(false);
    const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
    const [isTreatmentOpen, setIsTreatmentOpen] = useState(false);
    const [isHistoryPrintOpen, setIsHistoryPrintOpen] = useState(false);
    const [isPatientListOpen, setIsPatientListOpen] = useState(false);
    const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

    // Filter state
    const [patientSearch, setPatientSearch] = useState("");

    // Handle forced sub-tab (e.g. from sidebar)
    React.useEffect(() => {
        if (forcedSubTab) {
            setActiveSubTab(forcedSubTab);
            onForcedSubTabHandled?.();
        }
    }, [forcedSubTab]);

    // Sync external search from top bar
    React.useEffect(() => {
        if (externalSearch !== undefined) {
            setPatientSearch(externalSearch);
            if (externalSearch.length > 0) {
                setIsPatientListOpen(true);
            }
        }
    }, [externalSearch]);

    // New patient form state
    const [newPatient, setNewPatient] = useState({
        name: "",
        age: "",
        blood: "O+",
        allergy: "Ninguna",
        phone: "",
        email: "",
        address: ""
    });

    // Prescription form state
    const [prescription, setPrescription] = useState({
        medication: "",
        dosage: "",
        duration: "",
        instructions: "",
        professionalName: "Dr. Lucas Román",
        licenseNumber: "#MN-77291"
    });
    const [isEditingSignature, setIsEditingSignature] = useState(false);

    // Treatment form state
    const [treatment, setTreatment] = useState({
        name: "",
        category: "Limpieza",
        description: "",
        cost: ""
    });



    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                addToast("Error: El archivo es demasiado pesado (máx 2MB)", "error");
                return;
            }

            addToast("Cargando archivo...", "loading");

            // Simular carga
            setTimeout(() => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (event.target?.result) {
                        const newPatients = [...patients];
                        newPatients[currentPatientIndex].avatar = event.target?.result as string;
                        setPatients(newPatients);
                        addToast("Foto de perfil actualizada", "success");
                    }
                };
                reader.readAsDataURL(file);
            }, 1000);
        }
    };

    const setPatientInfo = (updatedInfo: any) => {
        const newPatients = [...patients];
        newPatients[currentPatientIndex] = { ...newPatients[currentPatientIndex], ...updatedInfo };
        setPatients(newPatients);
    };

    const handleCreatePatient = () => {
        if (!newPatient.name) {
            addToast("El nombre es obligatorio", "error");
            return;
        }
        const createdPatient = {
            id: `#DP-${Math.floor(10000 + Math.random() * 90000)}`,
            name: newPatient.name,
            age: newPatient.age,
            blood: newPatient.blood,
            lastVisit: "Sin visitas",
            allergy: newPatient.allergy,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newPatient.name)}&background=137fec&color=fff&size=128`,
            phone: newPatient.phone,
            email: newPatient.email,
            address: newPatient.address,
            treatments: [],
            findings: {},
            periodontalData: {}
        };
        setPatients([...patients, createdPatient]);
        setCurrentPatientIndex(patients.length);
        setIsNewPatientOpen(false);
        setNewPatient({ name: "", age: "", blood: "O+", allergy: "Ninguna", phone: "", email: "", address: "" });
        addToast("Paciente creado con éxito", "success");
    };

    const handleCreatePrescription = () => {
        if (!prescription.medication) {
            addToast("La medicación es obligatoria", "error");
            return;
        }
        setIsPrescriptionOpen(false);
        addToast("Receta generada y firmada digitalmente", "success");
        setPrescription({ medication: "", dosage: "", duration: "", instructions: "", professionalName: "Dr. Lucas Román", licenseNumber: "#MN-77291" });
    };

    const handleCreateTreatment = () => {
        if (!treatment.name) {
            addToast("El nombre del tratamiento es obligatorio", "error");
            return;
        }

        const newTreatmentObj = {
            id: Math.random(),
            date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
            name: treatment.name,
            category: treatment.category,
            professional: "Dr. Lucas Román",
            status: "En Espera",
            notes: treatment.description,
            cost: parseFloat(treatment.cost) || 0
        };

        const updatedPatients = [...patients];
        updatedPatients[currentPatientIndex].treatments = [newTreatmentObj, ...(updatedPatients[currentPatientIndex].treatments || [])];
        setPatients(updatedPatients);

        setIsTreatmentOpen(false);
        addToast("Nuevo tratamiento registrado", "success");
        setTreatment({ name: "", category: "Limpieza", description: "", cost: "" });
    };

    const handleSave = () => {
        setIsEditing(false);
        addToast("Cambios guardados correctamente", "success");
    };

    const renderContent = () => {
        switch (activeSubTab) {
            case 'Timeline': return <Timeline treatments={patientInfo.treatments || []} addToast={addToast} onGenerateInvoice={() => setIsInvoiceOpen(true)} />;
            case 'Odontograma': return <Odontogram initialFindings={patientInfo.findings || {}} onFindingsChange={(newFindings) => {
                const updated = [...patients];
                updated[currentPatientIndex].findings = newFindings;
                setPatients(updated);
            }} addToast={addToast} />;
            case 'Periodontograma': return <Periodontogram
                key={patientInfo.id}
                patientName={patientInfo.name}
                patientId={patientInfo.id}
                initialData={patientInfo.periodontalData}
                onDataChange={(newData) => {
                    const updated = [...patients];
                    updated[currentPatientIndex].periodontalData = newData;
                    setPatients(updated);
                }}
                addToast={addToast}
            />;
            case 'Documentos': return <Documents addToast={addToast} patientId={patientInfo.id} patientName={patientInfo.name} />;
            case 'Presupuesto': return <Budgets addToast={addToast} patientId={patientInfo.id} patientName={patientInfo.name} />;
            default: return <Timeline treatments={patientInfo.treatments || []} addToast={addToast} onGenerateInvoice={() => setIsInvoiceOpen(true)} />;
        }
    };

    return (
        <div className="p-8 h-full space-y-8 animate-in fade-in duration-500 bg-[#F4F4F0]/30 overflow-y-auto relative">
            {/* Render local ToastContainer only if external addToast is not provided */}
            {!externalAddToast && <ToastContainer toasts={localToasts} removeToast={removeToast} />}

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileUpload}
                accept="image/*"
            />

            {/* Top Header */}
            <header className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#137fec] rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                        <Users size={24} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black italic tracking-tighter text-slate-800 uppercase">Panel de Pacientes</h2>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest italic">Gestión Clínica Avanzada</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <ActionButton icon={<Printer size={16} />} label="Imprimir Historia" onClick={() => setIsHistoryPrintOpen(true)} />
                    <ActionButton icon={<FileText size={16} />} label="Nueva Receta" onClick={() => setIsPrescriptionOpen(true)} />
                    <button
                        onClick={() => setIsTreatmentOpen(true)}
                        className="bg-[#137fec] hover:bg-blue-600 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 active:scale-95"
                    >
                        <Plus size={18} />
                        Nuevo Tratamiento
                    </button>
                </div>
            </header>

            {/* List selector & Top Quick Search */}
            <div className="flex flex-col md:flex-row items-center gap-4">
                <button
                    onClick={() => setIsPatientListOpen(true)}
                    className="w-full md:w-auto px-6 py-3 bg-white border-2 border-slate-200/60 rounded-2xl font-black uppercase tracking-widest text-[10px] text-[#137fec] hover:border-[#137fec]/30 transition-all flex items-center justify-center gap-3 shadow-sm active:scale-95"
                >
                    <Users size={16} /> Buscar Paciente en Base de Datos
                </button>
                <button
                    onClick={() => setIsNewPatientOpen(true)}
                    className="w-full md:w-auto px-8 py-3 bg-[#137fec] rounded-2xl font-black uppercase tracking-widest text-[10px] text-white shadow-xl shadow-blue-500/10 hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                    <UserPlus size={16} /> Registro de Nuevo Paciente
                </button>
            </div>

            {/* Active Patient Hero Card */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
                <div className="relative group">
                    <div
                        className="w-24 h-24 rounded-full border-4 border-slate-50 overflow-hidden shadow-xl ring-2 ring-blue-100 group-hover:ring-[#137fec]/30 transition-all cursor-pointer relative"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <img src={patientInfo.avatar} alt="Maria" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity">
                            <Upload size={20} className="text-white mb-1" />
                            <span className="text-[8px] text-white font-black uppercase">Cambiar</span>
                        </div>
                    </div>
                    <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white"></div>
                </div>

                <div className="flex-1 space-y-4 text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        {isEditing ? (
                            <input
                                className="text-3xl font-black italic tracking-tighter text-slate-800 uppercase bg-slate-50 border-b-2 border-[#137fec] outline-none px-2 rounded-t-lg"
                                value={patientInfo.name}
                                onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })}
                                autoFocus
                            />
                        ) : (
                            <h3 className="text-3xl font-black italic tracking-tighter text-slate-800 uppercase">{patientInfo.name}</h3>
                        )}
                        <span className="px-4 py-1.5 bg-red-50 text-red-600 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border border-red-100">
                            <AlertCircle size={12} /> Alergia: {isEditing ? (
                                <input
                                    className="bg-transparent border-none outline-none font-black w-24 placeholder:text-red-300"
                                    value={patientInfo.allergy}
                                    onChange={(e) => setPatientInfo({ ...patientInfo, allergy: e.target.value })}
                                />
                            ) : patientInfo.allergy}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <ProfileStat editable={isEditing} label="EDAD" value={patientInfo.age} onChange={(v) => setPatientInfo({ ...patientInfo, age: v })} />
                        <ProfileStat editable={isEditing} label="GRUPO SANGUÍNEO" value={patientInfo.blood} onChange={(v) => setPatientInfo({ ...patientInfo, blood: v })} />
                        <ProfileStat editable={isEditing} label="ÚLTIMA VISITA" value={patientInfo.lastVisit} onChange={(v) => setPatientInfo({ ...patientInfo, lastVisit: v })} />
                        <ProfileStat label="ID PACIENTE" value={patientInfo.id} color="text-[#137fec]" />
                    </div>
                </div>

                <div className="flex gap-3">
                    {isEditing ? (
                        <>
                            <button onClick={handleSave} className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors shadow-sm"><Check size={20} /></button>
                            <button onClick={() => { setIsEditing(false); addToast("Edición cancelada", "info"); }} className="p-3 bg-red-50 text-red-400 rounded-xl hover:bg-red-100 transition-colors shadow-sm"><X size={20} /></button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setIsEditing(true)} className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-[#137fec] transition-colors"><Edit2 size={18} /></button>
                            <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-[#137fec] transition-colors"><UserPlus size={18} /></button>
                        </>
                    )}
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
                            {activeSubTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#137fec] rounded-full shadow-[0_-2px_8px_rgba(19,127,236,0.3)]"></div>}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Dynamic Content Area */}
            <div className="min-h-[500px]">
                {renderContent()}
            </div>

            {/* MODAL: NUEVO PACIENTE */}
            {isNewPatientOpen && createPortal(
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-10 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] w-full max-w-2xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 scale-[0.85]">
                        <div className="flex justify-between items-center border-b border-slate-100 p-10 pb-6 shrink-0">
                            <h4 className="text-2xl font-black italic tracking-tighter text-slate-800 uppercase">Añadir Nuevo Paciente</h4>
                            <button onClick={() => setIsNewPatientOpen(false)} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-10 pt-6 space-y-8 custom-scrollbar">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <InputLabel label="Nombre Completo" />
                                    <input value={newPatient.name} onChange={e => setNewPatient({ ...newPatient, name: e.target.value })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold text-slate-700 outline-none focus:border-[#137fec]/30" placeholder="Ej: Juan Pérez" />
                                </div>
                                <div className="space-y-4">
                                    <InputLabel label="Edad" />
                                    <input value={newPatient.age} onChange={e => setNewPatient({ ...newPatient, age: e.target.value })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold text-slate-700 outline-none focus:border-[#137fec]/30" placeholder="Ej: 34 años" />
                                </div>
                                <div className="space-y-4">
                                    <InputLabel label="Grupo Sanguíneo" />
                                    <input value={newPatient.blood} onChange={e => setNewPatient({ ...newPatient, blood: e.target.value })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold text-slate-700 outline-none focus:border-[#137fec]/30" placeholder="Ej: O+" />
                                </div>
                                <div className="space-y-4">
                                    <InputLabel label="Alergias" />
                                    <input value={newPatient.allergy} onChange={e => setNewPatient({ ...newPatient, allergy: e.target.value })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold text-slate-700 outline-none focus:border-[#137fec]/30" placeholder="Ej: Penicilina" />
                                </div>
                                <div className="space-y-4">
                                    <InputLabel label="Email" />
                                    <input value={newPatient.email} onChange={e => setNewPatient({ ...newPatient, email: e.target.value })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold text-slate-700 outline-none focus:border-[#137fec]/30" placeholder="juan@ejemplo.com" />
                                </div>
                                <div className="space-y-4">
                                    <InputLabel label="Teléfono" />
                                    <input value={newPatient.phone} onChange={e => setNewPatient({ ...newPatient, phone: e.target.value })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold text-slate-700 outline-none focus:border-[#137fec]/30" placeholder="+54..." />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <InputLabel label="Dirección Residencial" />
                                <input value={newPatient.address} onChange={e => setNewPatient({ ...newPatient, address: e.target.value })} className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold text-slate-700 outline-none focus:border-[#137fec]/30" placeholder="Calle, Ciudad..." />
                            </div>
                        </div>

                        <div className="p-10 pt-6 border-t border-slate-100 shrink-0">
                            <button onClick={handleCreatePatient} className="w-full py-5 bg-[#137fec] rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
                                Crear Ficha de Paciente
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* MODAL: NUEVA RECETA */}
            {isPrescriptionOpen && createPortal(
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-10 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] w-full max-w-xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 scale-[0.85]">
                        <div className="flex justify-between items-center border-b border-slate-100 p-10 pb-6 shrink-0">
                            <div>
                                <h4 className="text-2xl font-black italic tracking-tighter text-slate-800 uppercase">Nueva Receta Digital</h4>
                                <p className="text-[10px] font-bold text-[#137fec] uppercase tracking-widest mt-1">Recetando para: {patients[currentPatientIndex].name}</p>
                            </div>
                            <button onClick={() => setIsPrescriptionOpen(false)} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-10 pt-6 space-y-6 custom-scrollbar">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <InputLabel label="Medicación" />
                                    <input value={prescription.medication} onChange={e => setPrescription({ ...prescription, medication: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 font-bold text-slate-700 outline-none focus:border-[#137fec]/30" placeholder="Ej: Amoxicilina 500mg" />
                                </div>
                                <div className="space-y-2">
                                    <InputLabel label="Frecuencia / Dosis" />
                                    <input value={prescription.dosage} onChange={e => setPrescription({ ...prescription, dosage: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 font-bold text-slate-700 outline-none focus:border-[#137fec]/30" placeholder="Cada 8 horas" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <InputLabel label="Instrucciones del Tratamiento" />
                                <textarea value={prescription.instructions} onChange={e => setPrescription({ ...prescription, instructions: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-bold text-slate-700 outline-none focus:border-[#137fec]/30 h-32 resize-none" placeholder="Indique indicaciones adicionales..." />
                            </div>


                            {/* Signature Section */}
                            <div className="p-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-center relative overflow-hidden group min-h-[140px] flex flex-col items-center justify-center">
                                <div className="absolute top-2 left-4 text-[8px] font-black text-slate-300 uppercase tracking-[0.3em]">Firma Digital Autorizada</div>

                                {isEditingSignature ? (
                                    <div className="space-y-3 w-full animate-in fade-in duration-300">
                                        <input
                                            value={prescription.professionalName}
                                            onChange={e => setPrescription({ ...prescription, professionalName: e.target.value })}
                                            className="w-full bg-white border border-slate-200 rounded-xl p-2 text-center text-sm font-bold text-slate-700 outline-none focus:border-[#137fec]"
                                            placeholder="Nombre del Profesional"
                                        />
                                        <input
                                            value={prescription.licenseNumber}
                                            onChange={e => setPrescription({ ...prescription, licenseNumber: e.target.value })}
                                            className="w-full bg-white border border-slate-200 rounded-xl p-2 text-center text-[10px] font-black text-slate-400 outline-none focus:border-[#137fec] uppercase"
                                            placeholder="Nro Matrícula"
                                        />
                                        <button
                                            onClick={() => setIsEditingSignature(false)}
                                            className="text-[9px] font-black text-[#137fec] uppercase tracking-widest hover:underline"
                                        >
                                            Guardar Firma
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mt-2 flex flex-col items-center">
                                            <p className="font-serif italic text-2xl text-blue-900/40 select-none">{prescription.professionalName}</p>
                                            <div className="w-48 h-px bg-slate-200 mt-2"></div>
                                            <p className="text-[8px] font-black text-slate-400 mt-2 uppercase tracking-widest">Matrícula Prof: {prescription.licenseNumber}</p>
                                        </div>
                                        <button
                                            onClick={() => setIsEditingSignature(true)}
                                            className="absolute inset-0 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-[10px] font-black text-[#137fec] uppercase tracking-widest cursor-pointer"
                                        >
                                            <PenTool size={14} /> Re-firmar Documento
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="p-10 pt-6 border-t border-slate-100 shrink-0">
                            <div className="flex gap-4">
                                <button onClick={handleCreatePrescription} className="flex-1 py-5 bg-[#137fec] rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-3">
                                    <FileCheck size={18} /> Generar y Enviar Receta
                                </button>
                                <button className="px-6 bg-slate-100 rounded-[1.5rem] text-slate-500 hover:bg-slate-200 transition-all flex items-center justify-center">
                                    <Printer size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* MODAL: IMPRIMIR HISTORIA (PREVIEW) */}
            {isHistoryPrintOpen && createPortal(
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-10 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="bg-white rounded-[2rem] w-full max-w-5xl h-full md:h-[90vh] shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 overflow-hidden scale-[0.85]">
                        <div className="p-8 bg-slate-50 border-b border-slate-200 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm"><Printer size={20} className="text-[#137fec]" /></div>
                                <div>
                                    <h5 className="text-sm font-black uppercase tracking-widest text-slate-800">Vista Previa de Historia Clínica</h5>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Paciente: {patientInfo.name} • {patientInfo.id}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => window.print()} className="bg-[#137fec] text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-500/20 flex items-center gap-2">
                                    <Printer size={16} /> Imprimir Reporte
                                </button>
                                <button onClick={() => setIsHistoryPrintOpen(false)} className="p-3 bg-slate-200 text-slate-600 rounded-xl hover:bg-slate-300 transition-all"><X size={20} /></button>
                            </div>
                        </div>

                        {/* Report Content */}
                        <div id="clinical-report" className="flex-1 overflow-y-auto p-16 space-y-12 bg-white print:p-0">
                            {/* Header Report */}
                            <div className="flex justify-between items-start border-b-4 border-slate-100 pb-10">
                                <div className="space-y-4">
                                    <h1 className="text-5xl font-black italic tracking-tighter text-blue-900">HISTORIA CLÍNICA</h1>
                                    <div className="flex items-center gap-4">
                                        <div className="w-20 h-20 rounded-2xl bg-slate-100 border-2 border-slate-200 overflow-hidden">
                                            <img src={patientInfo.avatar} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="space-y-1">
                                            <h2 className="text-2xl font-black uppercase text-slate-800">{patientInfo.name}</h2>
                                            <p className="text-xs font-bold text-[#137fec] uppercase tracking-widest">ID: {patientInfo.id} • DNI: 35.882.192</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right space-y-1">
                                    <p className="text-xl font-black text-slate-800 italic uppercase">CITTA ODONTOLOGÍA</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Av. del Libertador 4500, CABA</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">CUIT: 30-71458922-1</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Tel: +54 11 5522-8811</p>
                                </div>
                            </div>

                            {/* Section: General Data */}
                            <div className="grid grid-cols-3 gap-10">
                                <PrintSection label="DATOS GENERALES">
                                    <div className="space-y-3">
                                        <PrintInfoRow label="Edad" value={patientInfo.age} />
                                        <PrintInfoRow label="Grup. Sanguíneo" value={patientInfo.blood} />
                                        <PrintInfoRow label="Alergias" value={patientInfo.allergy} color="text-red-600" />
                                        <PrintInfoRow label="Última Visita" value={patientInfo.lastVisit} />
                                    </div>
                                </PrintSection>
                                <PrintSection label="CONTACTO">
                                    <div className="space-y-3">
                                        <PrintInfoRow label="Email" value={patientInfo.email} />
                                        <PrintInfoRow label="Teléfono" value={patientInfo.phone} />
                                        <PrintInfoRow label="Dirección" value={patientInfo.address} />
                                    </div>
                                </PrintSection>
                                <PrintSection label="MÉTRICAS CLÍNICAS">
                                    <div className="flex gap-4">
                                        <div className="flex-1 p-4 bg-red-50 rounded-2xl border border-red-100 text-center">
                                            <div className="flex justify-center mb-1"><Heart size={16} className="text-red-400" /></div>
                                            <p className="text-[8px] font-black text-red-400 uppercase">Sangrado</p>
                                            <p className="text-lg font-black text-red-600">12%</p>
                                        </div>
                                        <div className="flex-1 p-4 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                                            <div className="flex justify-center mb-1"><Activity size={16} className="text-blue-400" /></div>
                                            <p className="text-[8px] font-black text-blue-400 uppercase">Placa</p>
                                            <p className="text-lg font-black text-blue-600">18%</p>
                                        </div>
                                    </div>
                                </PrintSection>
                            </div>

                            {/* Section: Odontograma Snapshot */}
                            <PrintSection label="MAPA DENTAL (ODONTOGRAMA)">
                                <div className="p-10 border-2 border-slate-100 rounded-[2.5rem] bg-slate-50/50 flex flex-col items-center gap-6">
                                    <div className="grid gap-1 w-full" style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}>
                                        {[18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28].map(t => (
                                            <div key={t} className={`p-1 border rounded-[4px] text-[7px] font-black text-center ${t === 23 ? 'bg-blue-500 text-white border-blue-600' : t === 16 ? 'bg-red-500 text-white border-red-600' : 'bg-white border-slate-200 text-slate-400'}`}>{t}</div>
                                        ))}
                                    </div>
                                    <div className="grid gap-1 w-full" style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}>
                                        {[48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38].map(t => (
                                            <div key={t} className="p-1 border border-slate-200 rounded-[4px] text-[7px] font-black text-center bg-white text-slate-400">{t}</div>
                                        ))}
                                    </div>
                                    <div className="flex gap-10 mt-4 px-6 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                            <span className="text-[8px] font-black uppercase text-slate-500 tracking-tighter">Tratado</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                            <span className="text-[8px] font-black uppercase text-slate-500 tracking-tighter">Caries / Infección</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                            <span className="text-[8px] font-black uppercase text-slate-500 tracking-tighter">Pieza Sana</span>
                                        </div>
                                    </div>
                                </div>
                            </PrintSection>

                            {/* Section: Timeline Treatments */}
                            <PrintSection label="HISTORIAL DE TRATAMIENTOS RECIENTES">
                                <table className="w-full border-separate border-spacing-0">
                                    <thead>
                                        <tr className="bg-slate-50">
                                            <th className="p-4 text-left text-[9px] font-black uppercase text-slate-400 border-b border-slate-200">Fecha</th>
                                            <th className="p-4 text-left text-[9px] font-black uppercase text-slate-400 border-b border-slate-200">Tratamiento</th>
                                            <th className="p-4 text-left text-[9px] font-black uppercase text-slate-400 border-b border-slate-200">Profesional</th>
                                            <th className="p-4 text-left text-[9px] font-black uppercase text-slate-400 border-b border-slate-200">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {(patientInfo.treatments && patientInfo.treatments.length > 0) ? (
                                            patientInfo.treatments.map((treatment, idx) => (
                                                <tr key={idx}>
                                                    <td className="p-4 text-[10px] font-bold text-slate-600">{treatment.date}</td>
                                                    <td className="p-4 text-[10px] font-black text-slate-800 uppercase">{treatment.name}</td>
                                                    <td className="p-4 text-[10px] font-bold text-slate-600 italic">{treatment.professional}</td>
                                                    <td className="p-4">
                                                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${treatment.status === 'Completado' ? 'bg-emerald-50 text-emerald-600' :
                                                            treatment.status === 'En Proceso' ? 'bg-blue-50 text-blue-600' :
                                                                'bg-yellow-50 text-yellow-600'
                                                            }`}>
                                                            {treatment.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="p-8 text-center text-slate-400 text-xs font-bold uppercase">
                                                    No hay tratamientos registrados para este paciente
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </PrintSection>

                            <div className="pt-20 text-center opacity-30">
                                <p className="text-[9px] font-black uppercase tracking-[0.4em]">Documento Oficial Clinica Citta • {new Date().toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* MODAL: BUSCADOR DE PACIENTES (SELECCIÓN) */}
            {isPatientListOpen && createPortal(
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-10 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] w-full max-w-2xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 scale-[0.85]">
                        <div className="p-10 border-b border-slate-100 shrink-0">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="text-2xl font-black italic tracking-tighter text-slate-800 uppercase">Base de Datos de Pacientes</h4>
                                <button onClick={() => setIsPatientListOpen(false)} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="relative">
                                <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    autoFocus
                                    placeholder="Buscar por nombre, ID o DNI..."
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 pl-14 font-bold text-slate-700 outline-none focus:border-[#137fec]/30 transition-all shadow-inner"
                                    value={patientSearch}
                                    onChange={e => {
                                        setPatientSearch(e.target.value);
                                        onExternalSearchChange?.(e.target.value);
                                    }}
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-10 pt-4 custom-scrollbar">
                            <div className="space-y-3">
                                {patients
                                    .filter(p => {
                                        const nameMatch = p.name?.toLowerCase().includes((patientSearch || "").toLowerCase());
                                        const idMatch = p.id?.toLowerCase().includes((patientSearch || "").toLowerCase());
                                        return nameMatch || idMatch;
                                    })
                                    .map((p, idx) => (
                                        <button
                                            key={p.id}
                                            onClick={() => {
                                                const originalIndex = patients.findIndex(orig => orig.id === p.id);
                                                if (originalIndex !== -1) {
                                                    setCurrentPatientIndex(originalIndex);
                                                    setIsPatientListOpen(false);
                                                    setPatientSearch("");
                                                    onExternalSearchChange?.("");
                                                }
                                            }}
                                            className="w-full p-4 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl transition-all flex items-center justify-between group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200">
                                                    <img src={p.avatar} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-black text-slate-800 uppercase text-sm tracking-tight">{p.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase">{p.id} • {p.age}</p>
                                                </div>
                                            </div>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-[#137fec] font-black uppercase text-[10px] tracking-widest">
                                                Seleccionar <Check size={14} />
                                            </div>
                                        </button>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* MODAL: FACTURA / RECIBO */}
            {isInvoiceOpen && createPortal(
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-10 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border-[8px] border-slate-100 scale-[0.85]">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                            <h4 className="text-lg font-black italic tracking-tighter text-slate-800 uppercase">Factura Oficial</h4>
                            <button onClick={() => setIsInvoiceOpen(false)} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-400"><X size={18} /></button>
                        </div>

                        <div className="p-10 flex-1 overflow-y-auto bg-white space-y-8">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h5 className="text-2xl font-black italic tracking-tighter text-[#137fec]">CITTA ODONTOLOGÍA</h5>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase">CUIT: 30-71458922-1 • Responsable Inscripto</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-slate-400 uppercase">Factura Nro</p>
                                    <p className="text-lg font-black text-slate-800 tracking-tighter">0001 - 0000{Math.floor(Math.random() * 1000)}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                <div>
                                    <p className="text-[8px] font-black text-[#137fec] uppercase tracking-widest mb-1">Cliente / Paciente</p>
                                    <p className="font-black text-slate-800 uppercase text-sm">{patientInfo.name}</p>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase">{patientInfo.id}</p>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase">{patientInfo.address}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[8px] font-black text-[#137fec] uppercase tracking-widest mb-1">Fecha de Emisión</p>
                                    <p className="font-black text-slate-800 text-sm">{new Date().toLocaleDateString()}</p>
                                </div>
                            </div>

                            <table className="w-full">
                                <thead className="border-b border-slate-100">
                                    <tr>
                                        <th className="py-3 text-left text-[8px] font-black uppercase text-slate-400">Descripción</th>
                                        <th className="py-3 text-right text-[8px] font-black uppercase text-slate-400">Importe</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {(patientInfo.treatments || []).map(t => (
                                        <tr key={t.id}>
                                            <td className="py-4 font-bold text-slate-700 text-xs">
                                                {t.name}
                                                <p className="text-[8px] font-medium text-slate-400 uppercase tracking-tighter">{t.date} • {t.professional}</p>
                                            </td>
                                            <td className="py-4 text-right font-black text-slate-800 text-xs">${t.cost.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="border-t-2 border-slate-100">
                                    <tr>
                                        <td className="py-6 font-black text-slate-400 uppercase text-[9px] tracking-widest">Total a Pagar (ARS)</td>
                                        <td className="py-6 text-right text-2xl font-black italic tracking-tighter text-[#137fec]">${(patientInfo.treatments || []).reduce((acc, curr) => acc + curr.cost, 0).toLocaleString()}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        <div className="p-6 border-t border-slate-100 flex gap-4 bg-slate-50 shrink-0">
                            <button className="flex-1 py-4 bg-[#137fec] text-white rounded-xl font-black uppercase text-[9px] tracking-widest shadow-xl shadow-blue-500/10 active:scale-95" onClick={() => window.print()}>
                                Imprimir Comprobante
                            </button>
                            <button className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 rounded-xl font-black uppercase text-[9px] tracking-widest" onClick={() => setIsInvoiceOpen(false)}>
                                Cerrar Ventana
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* MODAL: NUEVO TRATAMIENTO */}
            {isTreatmentOpen && createPortal(
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-10 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 scale-[0.85]">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                            <h4 className="text-xl font-black italic tracking-tighter text-slate-800 uppercase">Registrar Nuevo Tratamiento</h4>
                            <button onClick={() => setIsTreatmentOpen(false)} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400"><X size={20} /></button>
                        </div>

                        <div className="p-10 flex-1 overflow-y-auto space-y-6">
                            <div className="space-y-2">
                                <InputLabel label="Nombre del Tratamiento" />
                                <input
                                    value={treatment.name}
                                    onChange={e => setTreatment({ ...treatment, name: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-bold text-slate-700 outline-none focus:border-[#137fec]/30"
                                    placeholder="Ej: Endodoncia Pieza #46"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <InputLabel label="Categoría" />
                                    <select
                                        value={treatment.category}
                                        onChange={e => setTreatment({ ...treatment, category: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-bold text-slate-700 outline-none focus:border-[#137fec]/30"
                                    >
                                        <option value="Limpieza">Limpieza</option>
                                        <option value="Conducto">Conducto</option>
                                        <option value="Extracción">Extracción</option>
                                        <option value="Implante">Implante</option>
                                        <option value="Ortodoncia">Ortodoncia</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <InputLabel label="Costo (ARS)" />
                                    <input
                                        type="number"
                                        value={treatment.cost}
                                        onChange={e => setTreatment({ ...treatment, cost: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-bold text-slate-700 outline-none focus:border-[#137fec]/30"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <InputLabel label="Notas Adicionales" />
                                <textarea
                                    value={treatment.description}
                                    onChange={e => setTreatment({ ...treatment, description: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-bold text-slate-700 outline-none focus:border-[#137fec]/30 h-32 resize-none"
                                    placeholder="Detalles sobre el procedimiento..."
                                />
                            </div>
                        </div>

                        <div className="p-8 border-t border-slate-100 bg-slate-50 shrink-0">
                            <button
                                onClick={handleCreateTreatment}
                                className="w-full py-5 bg-[#137fec] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
                            >
                                Registrar Tratamiento y Actualizar Historial
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

// Report components
const PrintSection: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="space-y-4">
        <h6 className="text-[10px] font-black text-[#137fec] uppercase tracking-widest border-l-4 border-[#137fec] pl-4">{label}</h6>
        {children}
    </div>
);

const PrintInfoRow: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color = "text-slate-800" }) => (
    <div className="flex justify-between items-center border-b border-slate-50 pb-2">
        <span className="text-[9px] font-black text-slate-400 uppercase">{label}</span>
        <span className={`text-[10px] font-black ${color} uppercase`}>{value}</span>
    </div>
);

const InputLabel: React.FC<{ label: string }> = ({ label }) => (
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-2">{label}</p>
);

// Sub-component for Profile Stats with editing capability
const ProfileStat: React.FC<{ label: string; value: string; color?: string; editable?: boolean; onChange?: (v: string) => void }> = ({ label, value, color = "text-slate-800", editable, onChange }) => (
    <div className="space-y-1">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
        {editable ? (
            <input
                className={`text-sm font-black italic tracking-tight ${color} bg-slate-50 rounded px-1 outline-none w-full border-b border-transparent focus:border-[#137fec] transition-all`}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
            />
        ) : (
            <p className={`text-sm font-black italic tracking-tight ${color} uppercase`}>{value}</p>
        )}
    </div>
);

const ActionButton: React.FC<{ icon: React.ReactNode; label: string; onClick?: () => void }> = ({ icon, label, onClick }) => (
    <button
        onClick={onClick}
        className="px-6 py-3 bg-white border border-slate-200 rounded-2xl font-black uppercase tracking-widest text-[10px] text-slate-500 shadow-sm hover:shadow-md transition-all flex items-center gap-3 active:scale-95"
    >
        {icon} {label}
    </button>
);

export default Patients;
