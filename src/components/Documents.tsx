import React, { useState, useRef } from 'react';
import {
    FileText,
    Download,
    Trash2,
    Eye,
    Plus,
    Upload,
    X,
    Edit2,
    Check,
    FileDown,
    Search,
    Filter,
    AlertTriangle
} from 'lucide-react';
import { ToastType } from './Notifications';

interface Document {
    id: string;
    name: string;
    date: string;
    size: string;
    type: string;
    category: string;
    url?: string;
}


const CATEGORIES = ["Todos", "Historia Clínica", "Radiografía", "Legal", "Presupuesto", "Otros"];


const Documents: React.FC<{
    addToast?: (msg: string, type: ToastType) => void;
    patientId?: string;
    patientName?: string;
}> = ({ addToast, patientId }) => {
    // Cargar documentos específicos del paciente desde localStorage
    const loadPatientDocs = () => {
        if (!patientId) return [];
        const stored = localStorage.getItem(`patient_docs_${patientId}`);
        return stored ? JSON.parse(stored) : [];
    };

    const [docs, setDocs] = useState<Document[]>(loadPatientDocs());
    const [isDragging, setIsDragging] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("Todos");
    const [searchTerm, setSearchTerm] = useState("");

    // Modals state
    const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
    const [editingDoc, setEditingDoc] = useState<Document | null>(null);
    const [deletingDoc, setDeletingDoc] = useState<Document | null>(null);
    const [editName, setEditName] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);

    const filteredDocs = docs.filter(doc => {
        const matchesCategory = selectedCategory === "Todos" || doc.category === selectedCategory;
        const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Guardar documentos en localStorage cuando cambien
    React.useEffect(() => {
        if (patientId && docs.length >= 0) {
            localStorage.setItem(`patient_docs_${patientId}`, JSON.stringify(docs));
        }
    }, [docs, patientId]);

    // Recargar documentos cuando cambie el paciente
    React.useEffect(() => {
        setDocs(loadPatientDocs());
    }, [patientId]);

    const handleFileUpload = (files: FileList | null) => {
        if (!files) return;

        addToast?.(`Subiendo ${files.length} archivo(s)...`, "loading");

        setTimeout(() => {
            const newDocs: Document[] = Array.from(files).map((file) => ({
                id: Math.random().toString(36).substr(2, 9),
                name: file.name,
                date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
                size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
                type: file.type.includes('pdf') ? 'PDF' : 'IMG',
                category: "Otros",
                url: URL.createObjectURL(file)
            }));

            setDocs(prev => [...newDocs, ...prev]);
            addToast?.("Archivos subidos correctamente", "success");
        }, 1500);
    };

    const handleDelete = (doc: Document) => {
        setDeletingDoc(doc);
    };

    const confirmDelete = () => {
        if (deletingDoc) {
            setDocs(prev => prev.filter(d => d.id !== deletingDoc.id));
            setDeletingDoc(null);
            addToast?.("Documento eliminado correctamente", "success");
        }
    };

    const handleScan = () => {
        addToast?.("Iniciando escáner...", "loading");
        setTimeout(() => {
            addToast?.("Buscando escáneres en la red local...", "loading");
            setTimeout(() => {
                addToast?.("Escáner encontrado (HP LaserJet 400)", "success");
                setTimeout(() => {
                    addToast?.("Escaneando documento...", "loading");
                    setTimeout(() => {
                        const newDoc: Document = {
                            id: Math.random().toString(36).substr(2, 9),
                            name: `Escaneo_${new Date().getTime()}.pdf`,
                            date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
                            size: "1.2 MB",
                            type: "PDF",
                            category: "Otros",
                            url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                        };
                        setDocs(prev => [newDoc, ...prev]);
                        addToast?.("Documento escaneado y guardado", "success");
                    }, 2000);
                }, 1000);
            }, 1000);
        }, 1000);
    };

    const handleDownload = (doc: Document) => {
        addToast?.(`Descargando ${doc.name}...`, "loading");
        setTimeout(() => {
            const link = document.createElement('a');
            link.href = doc.url || '#';
            link.setAttribute('download', doc.name);
            document.body.appendChild(link);
            link.click();
            link.remove();
            addToast?.("Descarga completada", "success");
        }, 1000);
    };

    const startEditing = (doc: Document) => {
        setEditingDoc(doc);
        setEditName(doc.name);
    };

    const saveEdit = () => {
        if (editingDoc) {
            setDocs(prev => prev.map(d => d.id === editingDoc.id ? { ...d, name: editName } : d));
            setEditingDoc(null);
            addToast?.("Documento renombrado", "success");
        }
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileUpload(e.dataTransfer.files);
    };

    return (
        <div
            className="space-y-6 animate-in fade-in duration-500 pb-10"
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
        >
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                onChange={(e) => handleFileUpload(e.target.files)}
            />

            {/* Header Controls */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8">
                <div>
                    <h3 className="text-xl font-black italic tracking-tight text-slate-800 uppercase">Repositorio Dental</h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Gestión de Archivos Clínicos</p>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
                    <div className="relative flex-1 xl:w-64">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar documentos..."
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-[11px] font-bold outline-none focus:ring-2 focus:ring-[#137fec]/20 transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-6 py-3 bg-[#137fec] rounded-2xl text-[10px] font-black uppercase text-white shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all active:scale-95"
                    >
                        <Plus size={18} /> Nuevo Documento
                    </button>
                    <button
                        onClick={handleScan}
                        className="flex items-center gap-2 px-6 py-3 bg-emerald-50 rounded-2xl text-[10px] font-black uppercase text-emerald-600 border border-emerald-100 hover:bg-emerald-100 transition-all active:scale-95"
                    >
                        <FileDown size={16} /> Escanear
                    </button>
                </div>
            </div>

            {/* Category Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <Filter size={14} className="text-slate-400 mr-2 shrink-0" />
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`
                            px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                            ${selectedCategory === cat
                                ? 'bg-slate-800 text-white shadow-md'
                                : 'bg-white text-slate-400 border border-slate-200 hover:border-slate-300'}
                        `}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Documents Grid */}
            <div className={`
                grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 transition-all duration-300
                ${isDragging ? 'opacity-40 scale-[0.98]' : 'opacity-100 scale-100'}
            `}>
                {filteredDocs.map(doc => (
                    <div key={doc.id} className="bg-white rounded-[2rem] border border-slate-200/60 p-6 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group relative overflow-hidden">
                        {/* Overlay Gradient on Hover */}
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[#137fec]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div className="flex items-start justify-between mb-6">
                            <div className={`
                                w-14 h-14 rounded-2xl shadow-sm flex items-center justify-center transition-transform group-hover:scale-110 duration-500
                                ${doc.type === 'PDF' ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-blue-50 text-[#137fec] border border-blue-100'}
                            `}>
                                <FileText size={24} />
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => setPreviewDoc(doc)}
                                    className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-[#137fec] transition-all"
                                >
                                    <Eye size={16} />
                                </button>
                                <button
                                    onClick={() => handleDownload(doc)}
                                    className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-[#137fec] transition-all"
                                >
                                    <Download size={16} />
                                </button>
                                <button
                                    onClick={() => startEditing(doc)}
                                    className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-[#137fec] transition-all"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(doc)}
                                    className="p-2 hover:bg-red-50 rounded-lg text-red-400 transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <span className="text-[8px] font-black text-[#137fec] uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                                {doc.category}
                            </span>
                            <h4 className="text-sm font-black text-slate-800 line-clamp-1 truncate group-hover:text-[#137fec] transition-colors">{doc.name}</h4>
                        </div>

                        <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-50">
                            <div className="flex flex-col">
                                <span className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">FECHA</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">{doc.date}</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">TAMAÑO</span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase">{doc.size}</span>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredDocs.length === 0 && (
                    <div className="col-span-full py-20 bg-white/50 rounded-[3rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
                            <Search size={32} />
                        </div>
                        <h5 className="font-black text-slate-400 uppercase tracking-widest text-xs">No se encontraron documentos</h5>
                        <p className="text-[10px] text-slate-300 font-bold mt-2 uppercase">Intenta cambiar los filtros o el término de búsqueda</p>
                    </div>
                )}
            </div>

            {/* Drag & Drop Zone */}
            <div
                className={`
                    mt-12 bg-white rounded-[3rem] border-2 border-dashed p-16 flex flex-col items-center justify-center text-center space-y-4 transition-all duration-300
                    ${isDragging ? 'border-[#137fec] bg-blue-50 scale-[1.02] shadow-2xl' : 'border-slate-200 bg-white/60'}
                `}
            >
                <div className={`
                    w-20 h-20 rounded-[2rem] shadow-xl flex items-center justify-center transition-all duration-500
                    ${isDragging ? 'bg-[#137fec] text-white scale-110 -translate-y-2' : 'bg-white text-slate-300'}
                `}>
                    <Upload size={40} className={isDragging ? 'animate-bounce' : ''} />
                </div>
                <div>
                    <h5 className={`text-lg font-black italic tracking-tight transition-colors ${isDragging ? 'text-[#137fec]' : 'text-slate-800'}`}>
                        {isDragging ? '¡Suéltalos ahora!' : 'Suelta archivos para subir'}
                    </h5>
                    <p className="text-slate-400 text-[10px] mt-1 uppercase tracking-widest font-black">
                        Límite 20MB por archivo • PDF, Imágenes, Estudios 3D
                    </p>
                </div>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[#137fec] text-[11px] font-black uppercase tracking-[0.2em] hover:underline mt-4 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-[#137fec] after:opacity-0 hover:after:opacity-100 after:transition-opacity"
                >
                    BUSCAR EN MI ORDENADOR
                </button>
            </div>

            {/* Modals Container */}
            <div className="relative">
                {/* Modal: Rename */}
                {editingDoc && (
                    <div className="fixed inset-[-100vh] z-[99999] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl p-8 space-y-6 animate-in zoom-in-95 duration-300 translate-y-[15vh] xl:translate-y-0">
                            <div className="flex justify-between items-center">
                                <h4 className="text-lg font-black italic tracking-tighter text-slate-800 uppercase">Renombrar Archivo</h4>
                                <button onClick={() => setEditingDoc(null)} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nuevo Nombre</p>
                                <input
                                    type="text"
                                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl ring-1 ring-slate-200 focus:ring-2 focus:ring-[#137fec] outline-none transition-all font-bold text-sm"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => setEditingDoc(null)}
                                    className="flex-1 py-4 bg-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-200 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={saveEdit}
                                    className="flex-1 py-4 bg-[#137fec] rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                                >
                                    <Check size={18} /> Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal: Preview */}
                {previewDoc && (
                    <div className="fixed top-0 left-0 w-[117.65vw] h-[117.65vh] z-[99999] flex items-center justify-center bg-slate-900/95 backdrop-blur-2xl animate-in fade-in duration-500">
                        {/* Contenedor principal que se centra en el espacio escalado */}
                        <div className="relative w-full max-w-5xl h-[80vh] flex flex-col items-center justify-center p-6">

                            {/* Botón de cerrar posicionado relativo al contenido */}
                            <button
                                onClick={() => setPreviewDoc(null)}
                                className="absolute -top-10 -right-10 p-4 bg-[#137fec] text-white rounded-3xl shadow-2xl hover:bg-blue-600 transition-all z-[100001] active:scale-95 border-4 border-slate-900"
                            >
                                <X size={40} />
                            </button>

                            <div className="w-full h-full bg-slate-950 rounded-[4rem] border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl relative group">
                                {previewDoc.type === 'IMG' ? (
                                    <img
                                        src={previewDoc.url || "https://images.unsplash.com/photo-1579154235828-4519939b940b?auto=format&fit=crop&q=80&w=1200"}
                                        alt={previewDoc.name}
                                        className="max-w-full max-h-full object-contain p-8"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://placehold.co/1200x800/1e293b/white?text=Imagen+No+Disponible';
                                        }}
                                    />
                                ) : (
                                    <iframe
                                        src={previewDoc.url ? `https://docs.google.com/viewer?url=${encodeURIComponent(previewDoc.url)}&embedded=true` : ''}
                                        className="w-full h-full border-none bg-white rounded-[3.5rem]"
                                        title={previewDoc.name}
                                    />
                                )}

                                {/* Info Bottom Bar */}
                                <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex justify-between items-end opacity-0 group-hover:opacity-100 transition-all duration-500">
                                    <div className="space-y-1 text-left">
                                        <p className="text-white font-black italic text-2xl uppercase tracking-tighter shadow-sm">{previewDoc.name}</p>
                                        <p className="text-white/70 text-[11px] font-black uppercase tracking-[0.2em]">{previewDoc.category} • {previewDoc.date}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDownload(previewDoc)}
                                        className="p-5 bg-white rounded-2xl text-slate-900 shadow-2xl hover:scale-110 active:scale-90 transition-all border border-slate-100"
                                    >
                                        <Download size={28} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* Modal: Delete Confirmation */}
                {deletingDoc && (
                    <div className="fixed top-0 left-0 w-[117.65vw] h-[117.65vh] z-[99999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="bg-white rounded-[2.5rem] w-full max-w-sm shadow-2xl p-8 space-y-6 animate-in zoom-in-95 duration-300 text-center">
                            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                                <AlertTriangle size={40} />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-lg font-black italic tracking-tighter text-slate-800 uppercase">¿Eliminar Archivo?</h4>
                                <p className="text-[11px] font-bold text-slate-400 uppercase leading-relaxed">
                                    Estás a punto de eliminar <span className="text-slate-800">"{deletingDoc.name}"</span>.<br />Esta acción no se puede deshacer.
                                </p>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => setDeletingDoc(null)}
                                    className="flex-1 py-4 bg-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-200 transition-all"
                                >
                                    No, Volver
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 py-4 bg-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all"
                                >
                                    Sí, Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Documents;
