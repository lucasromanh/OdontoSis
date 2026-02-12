import { TrendingUp, UserPlus, DollarSign, Calendar, Eye, Edit, Link, Clock, Plus } from 'lucide-react';

const Dashboard: React.FC = () => {
    return (
        <div className="p-10 space-y-8 animate-in fade-in duration-500">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 rounded-[2.5rem] bg-[#137fec] text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-white/70 text-xs font-medium mb-1">Citas de Hoy</p>
                        <h3 className="text-4xl font-black italic tracking-tighter">12</h3>
                        <div className="mt-4 flex items-center gap-1.5 text-[10px] font-bold text-white/80">
                            <TrendingUp size={14} />
                            <span>8% de incremento vs ayer</span>
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
                    value="$1,450"
                    subtext="De 5 pacientes distintos"
                />

                <StatCard
                    icon={<UserPlus className="text-emerald-500" size={22} />}
                    iconBg="bg-emerald-50"
                    badge="+12%"
                    badgeColor="text-emerald-500 bg-emerald-50"
                    label="Nuevos Pacientes"
                    value="24"
                    subtext="Total registrados este mes"
                />

                <StatCard
                    icon={<DollarSign className="text-violet-500" size={22} />}
                    iconBg="bg-violet-50"
                    label="Ingresos Totales"
                    value="$45,800"
                    subtext="Rendimiento Anual (YTD)"
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                {/* Left Column: Recent Patients & Notes */}
                <div className="xl:col-span-8 space-y-8">
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                            <h2 className="font-bold text-xl text-slate-800">Pacientes Recientes</h2>
                            <button className="text-[#137fec] text-xs font-bold hover:underline">Ver Todos</button>
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
                                    <PatientRow name="Sofia Chen" initials="SC" treatment="Conducto Radicular" date="24 Oct, 2023" status="En Curso" statusColor="bg-blue-50 text-blue-600" />
                                    <PatientRow name="Marcus V." initials="MV" treatment="Limpieza Profunda" date="23 Oct, 2023" status="Completado" statusColor="bg-emerald-50 text-emerald-600" />
                                    <PatientRow name="Elena L." initials="EL" treatment="Ortodoncia" date="21 Oct, 2023" status="Programado" statusColor="bg-orange-50 text-orange-600" />
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 p-8">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-2 h-6 bg-[#137fec] rounded-full"></div>
                            <h2 className="font-bold text-xl text-slate-800">Notas Rápidas</h2>
                        </div>
                        <textarea
                            className="w-full h-32 bg-slate-50/50 border border-slate-100 rounded-[1.5rem] p-6 text-sm text-slate-600 focus:ring-1 focus:ring-blue-200 outline-none resize-none transition-all placeholder:text-slate-400"
                            placeholder="Escribe aquí una nota clínica o recordatorio para el equipo..."
                        />
                        <div className="mt-4 flex justify-between items-center">
                            <div className="flex gap-2">
                                <button className="p-3 text-slate-400 hover:text-[#137fec] transition-colors rounded-xl bg-slate-50 border border-slate-100"><Link size={18} /></button>
                            </div>
                            <button className="px-8 py-3 bg-[#137fec] text-white text-sm font-bold rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/10 active:scale-95">Guardar Nota</button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Agenda */}
                <div className="xl:col-span-4 bg-white rounded-[2.5rem] shadow-sm border border-slate-200/60 flex flex-col h-full overflow-hidden">
                    <div className="p-8 border-b border-slate-50">
                        <div className="flex justify-between items-center mb-1">
                            <h2 className="font-bold text-xl text-slate-800">Agenda del Día</h2>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">25 Oct, 2023</span>
                        </div>
                        <p className="text-sm text-slate-500 font-medium font-medium">Tienes 12 citas para hoy</p>
                    </div>
                    <div className="flex-1 p-8 space-y-8">
                        <AgendaItem time="09:00" name="Sofia Chen" spec="Conducto - Fase 2" status="En Curso" color="border-blue-500" bg="bg-blue-50" textColor="text-blue-600" />
                        <AgendaItem time="10:30" name="Marcus V." spec="Limpieza Profunda" status="Llegó" color="border-emerald-500" bg="bg-emerald-50" textColor="text-emerald-600" />
                        <AgendaItem time="11:15" name="Elena L." spec="Ortodoncia" status="Pendiente" color="border-slate-200 border-dashed" bg="bg-white border border-slate-100" textColor="text-slate-400" />
                        <AgendaItem time="14:00" name="David Smith" spec="Consulta Inicial" status="Cancelado" color="border-red-500" bg="bg-red-50" textColor="text-red-500" />
                    </div>
                    <div className="p-6 bg-slate-50/50">
                        <button className="w-full py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-95">
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

const PatientRow: React.FC<{ name: string; initials: string; treatment: string; date: string; status: string; statusColor: string }> = ({ name, initials, treatment, date, status, statusColor }) => (
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
                <button className="p-2 text-slate-400 hover:text-[#137fec] transition-colors"><Eye size={16} /></button>
                <button className="p-2 text-slate-400 hover:text-[#137fec] transition-colors"><Edit size={16} /></button>
            </div>
        </td>
    </tr>
);

const AgendaItem: React.FC<{ time: string; name: string; spec: string; status: string; color: string; bg: string; textColor: string }> = ({ time, name, spec, status, color, bg, textColor }) => (
    <div className="flex gap-4 group">
        <div className="flex flex-col items-center">
            <div className="text-xs font-black text-slate-300 group-hover:text-slate-500 transition-colors">{time}</div>
            <div className="w-[1px] h-full bg-slate-100 my-1"></div>
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
