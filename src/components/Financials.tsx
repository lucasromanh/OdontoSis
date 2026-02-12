import { DollarSign, Download, Filter, Search, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Financials: React.FC = () => {
    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black italic tracking-tighter uppercase text-slate-800">Centro Financiero</h2>
                    <p className="text-slate-500 font-medium tracking-tight">Monitoreo de ingresos, gastos y facturación de pacientes.</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <button className="px-6 py-2.5 bg-white border border-slate-200 rounded-2xl font-black uppercase tracking-widest text-[10px] text-slate-500 shadow-sm hover:shadow-md transition-all flex items-center gap-3 active:scale-95">
                        <Download size={16} />
                        Exportar
                    </button>
                    <button className="bg-[#137fec] hover:bg-blue-600 text-white px-8 py-2.5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-blue-500/20 flex items-center gap-3 active:scale-95">
                        <DollarSign size={16} />
                        Registrar Pago
                    </button>
                </div>
            </header>

            {/* Resumen Financiero */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FinanceCard
                    label="Ingresos Mensuales"
                    value="$45,800.00"
                    trend="+12.4%"
                    trendType="up"
                    chartColor="bg-[#137fec]"
                    bg="bg-white"
                />
                <FinanceCard
                    label="Facturación Pendiente"
                    value="$1,450.00"
                    trend="-2.1%"
                    trendType="down"
                    chartColor="bg-orange-500"
                    bg="bg-white border-orange-50"
                />
                <FinanceCard
                    label="Utilidad Operativa Bruta"
                    value="$32,240.00"
                    trend="+8.0%"
                    trendType="up"
                    chartColor="bg-emerald-500"
                    bg="bg-emerald-50/10"
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                {/* Historial de Transacciones */}
                <div className="xl:col-span-2">
                    <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden transition-all hover:shadow-lg">
                        <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                            <h3 className="text-xl font-black italic tracking-tight uppercase text-slate-800">Transacciones Recientes</h3>
                            <div className="flex gap-3 w-full sm:w-auto">
                                <div className="relative flex-1 sm:w-48">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                    <input className="w-full pl-9 pr-4 py-2.5 bg-slate-50/50 border border-slate-100 rounded-xl text-[10px] font-bold outline-none focus:ring-2 focus:ring-blue-100 transition-all" placeholder="Buscar factura..." />
                                </div>
                                <button className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-[#137fec]"><Filter size={16} /></button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50 text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">
                                        <th className="px-8 py-4">Paciente / Entidad</th>
                                        <th className="px-8 py-4">Categoría</th>
                                        <th className="px-8 py-4">Fecha</th>
                                        <th className="px-8 py-4">Estado</th>
                                        <th className="px-8 py-4 text-right">Monto</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    <TransactionRow name="Sofia Chen" cat="Tratamiento de Conducto" date="11 Feb, 2026" status="Pagado" amount="+$1,200.00" color="text-emerald-500" />
                                    <TransactionRow name="Distribuidora Dental" cat="Insumos Médicos" date="10 Feb, 2026" status="Gasto" amount="-$840.00" color="text-red-500" />
                                    <TransactionRow name="Marcus V." cat="Blanqueamiento Prof." date="09 Feb, 2026" status="Pagado" amount="+$250.00" color="text-emerald-500" />
                                    <TransactionRow name="Elena L." cat="Cuota Ortodoncia" date="08 Feb, 2026" status="Pendiente" amount="+$450.00" color="text-orange-500" />
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Analytics & Targets */}
                <div className="xl:col-span-1 space-y-8">
                    <div className="bg-white rounded-[2.5rem] border border-slate-200/60 p-8 shadow-sm transition-all hover:shadow-lg">
                        <h3 className="text-xl font-black italic tracking-tight uppercase text-slate-800 mb-8">Fuentes de Ingreso</h3>
                        <div className="space-y-6">
                            <SourceProgress label="Odontología Gral." value={65} color="bg-[#137fec]" />
                            <SourceProgress label="Ortodoncia" value={20} color="bg-indigo-500" />
                            <SourceProgress label="Implantes" value={10} color="bg-emerald-500" />
                            <SourceProgress label="Estética" value={5} color="bg-orange-500" />
                        </div>

                        <div className="mt-12 p-6 bg-blue-50/40 rounded-[2rem] border-2 border-dashed border-blue-100 flex flex-col items-center text-center">
                            <h4 className="font-black text-xs text-slate-800 italic tracking-tight uppercase">Meta Mensual</h4>
                            <p className="text-[10px] text-slate-500 font-bold mt-2 uppercase tracking-widest">85% de $52k completado</p>
                            <div className="w-full bg-slate-200 rounded-full h-2 mt-6 overflow-hidden">
                                <div className="bg-[#137fec] h-full w-[85%] rounded-full transition-all duration-1000"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FinanceCard: React.FC<{ label: string; value: string; trend: string; trendType: 'up' | 'down'; chartColor: string; bg: string }> = ({ label, value, trend, trendType, chartColor, bg }) => (
    <div className={`${bg} rounded-[2.5rem] border border-slate-200/60 p-8 shadow-sm hover:shadow-xl transition-all duration-500 cursor-default group`}>
        <div className="flex justify-between items-start mb-6">
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">{label}</span>
            <div className={`flex items-center gap-1 text-[9px] font-black px-2 py-1 rounded-full ${trendType === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {trendType === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {trend}
            </div>
        </div>
        <div className="flex items-end justify-between font-black">
            <h3 className="text-3xl italic tracking-tighter text-slate-800">{value}</h3>
            <div className="flex gap-1 h-10 items-end opacity-20 group-hover:opacity-100 transition-opacity">
                {[3, 5, 2, 7, 4, 8, 6].map((h, i) => (
                    <div key={i} className={`w-1.5 rounded-full ${chartColor}`} style={{ height: `${h * 10}%` }}></div>
                ))}
            </div>
        </div>
    </div>
);

const TransactionRow: React.FC<{ name: string; cat: string; date: string; status: string; amount: string; color: string }> = ({ name, cat, date, status, amount, color }) => (
    <tr className="hover:bg-slate-50/50 transition-colors cursor-pointer group">
        <td className="px-8 py-5">
            <span className="font-bold text-sm text-slate-800 block mb-0.5">{name}</span>
            <span className="text-[8px] text-[#137fec] font-black uppercase tracking-[0.2em]">Entidad</span>
        </td>
        <td className="px-8 py-5">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cat}</span>
        </td>
        <td className="px-8 py-5">
            <span className="text-xs font-bold text-slate-500 italic">{date}</span>
        </td>
        <td className="px-8 py-5">
            <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-1 bg-slate-100 text-slate-500 rounded-lg`}>{status}</span>
        </td>
        <td className="px-8 py-5 text-right font-black italic tracking-tighter text-base">
            <span className={color}>{amount}</span>
        </td>
    </tr>
);

const SourceProgress: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
    <div className="space-y-2">
        <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.2em]">
            <span className="text-slate-500">{label}</span>
            <span className="text-slate-300">{value}%</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${value}%` }}></div>
        </div>
    </div>
);

export default Financials;
