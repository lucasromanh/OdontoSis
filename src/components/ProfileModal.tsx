import React, { useState } from 'react';
import { X, Camera, Save, Fingerprint, MapPin, Hash, User, Briefcase } from 'lucide-react';

interface ProfessionalProfile {
    firstName: string;
    lastName: string;
    specialty: string;
    licenseNumber: string;
    email: string;
    phone: string;
    address: string;
    signature: string; // Base64 or URL
}

interface ProfileModalProps {
    onClose: () => void;
    addToast?: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ onClose, addToast }) => {
    const [profile, setProfile] = useState<ProfessionalProfile>(() => {
        const stored = localStorage.getItem('professional_profile');
        return stored ? JSON.parse(stored) : {
            firstName: "Lucas",
            lastName: "Román",
            specialty: "Odontólogo Senior",
            licenseNumber: "MN-77291",
            email: "lucas.roman@aurem.com",
            phone: "+54 9 11 1234-5678",
            address: "Sarmiento 1234, CABA",
            signature: ""
        };
    });

    const handleSave = () => {
        try {
            if (!profile.firstName || !profile.lastName) {
                addToast?.("Nombre y apellido son obligatorios", "error");
                return;
            }

            // Validar tamaño aproximado de la firma (Base64)
            if (profile.signature && profile.signature.length > 1.5 * 1024 * 1024) { // 1.5MB aprox
                addToast?.("La imagen de la firma es demasiado pesada", "error");
                return;
            }

            localStorage.setItem('professional_profile', JSON.stringify(profile));

            // Disparar evento para que otros componentes se actualicen
            window.dispatchEvent(new CustomEvent('profileUpdated', { detail: profile }));

            if (addToast) {
                addToast("Cambios guardados correctamente", "success");
            }

            // Cerrar después de una pequeña pausa para asegurar que el usuario vea el feedback si es necesario
            setTimeout(() => {
                onClose();
            }, 100);
        } catch (error) {
            console.error("Error saving profile:", error);
            addToast?.("Error al guardar: Posiblemente la imagen es muy grande", "error");
        }
    };

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#137fec] text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <User size={24} />
                        </div>
                        <div>
                            <h2 className="font-black text-xl text-slate-800 tracking-tight">Perfil Profesional</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Configuración de Firma y Datos</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white rounded-2xl transition-all shadow-sm active:scale-95">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                    <div className="grid grid-cols-2 gap-6">
                        <ProfileInput
                            label="Nombre"
                            icon={<User size={14} />}
                            value={profile.firstName}
                            onChange={(v) => setProfile({ ...profile, firstName: v })}
                        />
                        <ProfileInput
                            label="Apellido"
                            icon={<User size={14} />}
                            value={profile.lastName}
                            onChange={(v) => setProfile({ ...profile, lastName: v })}
                        />
                        <ProfileInput
                            label="Especialidad"
                            icon={<Briefcase size={14} />}
                            value={profile.specialty}
                            onChange={(v) => setProfile({ ...profile, specialty: v })}
                        />
                        <ProfileInput
                            label="Matrícula Nacional"
                            icon={<Hash size={14} />}
                            value={profile.licenseNumber}
                            onChange={(v) => setProfile({ ...profile, licenseNumber: v })}
                        />
                        <ProfileInput
                            label="Dirección del Consultorio"
                            icon={<MapPin size={14} />}
                            className="col-span-2"
                            value={profile.address}
                            onChange={(v) => setProfile({ ...profile, address: v })}
                        />
                    </div>

                    {/* Digital Signature Area */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Fingerprint size={18} className="text-[#137fec]" />
                            <h3 className="font-bold text-slate-700">Firma Digital</h3>
                        </div>
                        <div className="h-48 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center relative overflow-hidden group">
                            {profile.signature ? (
                                <img src={profile.signature} alt="Firma" className="max-h-full object-contain p-4" />
                            ) : (
                                <div className="text-center space-y-2">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all">
                                        <Camera size={24} />
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cargar Imagen de Firma</p>
                                </div>
                            )}
                            <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (event) => {
                                            if (event.target?.result) {
                                                setProfile({ ...profile, signature: event.target.result as string });
                                            }
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                        </div>
                        <p className="text-[10px] text-slate-400 italic text-center leading-relaxed px-10">
                            Esta firma se utilizará automáticamente en recetas médicas, facturas y presupuestos generados por el sistema.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-8 border-t border-slate-50 bg-slate-50/30 flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 rounded-2xl font-bold text-slate-500 hover:bg-white transition-all shadow-sm"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 py-4 rounded-2xl bg-[#137fec] text-white font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <Save size={18} /> Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    );
};

const ProfileInput: React.FC<{ label: string; icon: React.ReactNode; value: string; onChange: (v: string) => void; className?: string }> = ({ label, icon, value, onChange, className }) => (
    <div className={`space-y-2 ${className}`}>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-2">{label}</p>
        <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#137fec]">
                {icon}
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#137fec]/20 focus:border-[#137fec] transition-all"
            />
        </div>
    </div>
);
