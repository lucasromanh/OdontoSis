import React from 'react';
import { DollarSign, TrendingUp, Download, Filter, Search, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Financials: React.FC = () => {
    return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold uppercase italic tracking-tighter">Finance Hub</h2>
                    <p className="text-slate-500 font-medium">Monitoring clinic revenue, expenses and patient billing.</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-sm shadow-sm hover:shadow-md transition-all flex items-center gap-2 active:scale-95">
                        <Download size={18} />
                        Export Data
                    </button>
                    <button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2 active:scale-95">
                        <DollarSign size={18} />
                        Register Payment
                    </button>
                </div>
            </header>

            {/* Financial Overview Tags */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FinanceCard
                    label="Total Revenue"
                    value="$45,800.00"
                    trend="+12.4%"
                    trendType="up"
                    chartColor="bg-primary"
                />
                <FinanceCard
                    label="Pending Billing"
                    value="$1,450.00"
                    trend="-2.1%"
                    trendType="down"
                    chartColor="bg-orange-500"
                />
                <FinanceCard
                    label="Estimated Profit"
                    value="$32,240.00"
                    trend="+8.0%"
                    trendType="up"
                    chartColor="bg-emerald-500"
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="text-xl font-bold">Transaction History</h3>
                            <div className="flex gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input className="pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800/50 border-none rounded-xl text-xs outline-none" placeholder="Search..." />
                                </div>
                                <button className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500"><Filter size={16} /></button>
                            </div>
                        </div>
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                                    <th className="px-8 py-4 text-left">Entity</th>
                                    <th className="px-8 py-4 text-left">Category</th>
                                    <th className="px-8 py-4 text-left">Date</th>
                                    <th className="px-8 py-4 text-left">Status</th>
                                    <th className="px-8 py-4 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                <TransactionRow name="Sofia Chen" cat="Root Canal Treatment" date="Feb 11, 2026" status="Paid" amount="+$1,200.00" color="text-emerald-500" />
                                <TransactionRow name="Dentsply Sirona" cat="Dental Supplies" date="Feb 10, 2026" status="Outcome" amount="-$840.00" color="text-red-500" />
                                <TransactionRow name="Marcus V." cat="Cleaning & Whitening" date="Feb 09, 2026" status="Paid" amount="+$250.00" color="text-emerald-500" />
                                <TransactionRow name="Elena L." cat="Orthodontics (Installment)" date="Feb 08, 2026" status="Pending" amount="+$450.00" color="text-orange-500" />
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="xl:col-span-1 space-y-8">
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                        <h3 className="text-xl font-bold mb-6">Revenue Sources</h3>
                        <div className="space-y-6">
                            <SourceProgress label="General Dentistry" value={65} color="bg-primary" />
                            <SourceProgress label="Orthodontics" value={20} color="bg-indigo-500" />
                            <SourceProgress label="Implants" value={10} color="bg-teal-500" />
                            <SourceProgress label="Cosmetics" value={5} color="bg-orange-500" />
                        </div>
                        <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center text-center">
                            <TrendingUp size={32} className="text-primary mb-4" />
                            <h4 className="font-bold text-sm">Target Monthly Revenue</h4>
                            <p className="text-xs text-slate-500 mt-1">You are at 85% of your $52k goal</p>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-4 overflow-hidden">
                                <div className="bg-primary h-full w-[85%] rounded-full shadow-[0_0_10px_rgba(19,127,236,0.3)]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FinanceCard: React.FC<{ label: string; value: string; trend: string; trendType: 'up' | 'down'; chartColor: string }> = ({ label, value, trend, trendType, chartColor }) => (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-xl transition-all cursor-default">
        <div className="flex justify-between items-start mb-6">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{label}</span>
            <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full ${trendType === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                {trendType === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {trend}
            </div>
        </div>
        <div className="flex items-end justify-between">
            <h3 className="text-3xl font-black italic tracking-tighter">{value}</h3>
            <div className="flex gap-1 h-8 items-end">
                {[4, 6, 3, 8, 5, 9, 7].map((h, i) => (
                    <div key={i} className={`w-1.5 rounded-full ${chartColor} opacity-${i * 10 + 30}`} style={{ height: `${h * 10}%` }}></div>
                ))}
            </div>
        </div>
    </div>
);

const TransactionRow: React.FC<{ name: string; cat: string; date: string; status: string; amount: string; color: string }> = ({ name, cat, date, status, amount, color }) => (
    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group">
        <td className="px-8 py-5">
            <span className="font-bold text-sm block">{name}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Entity</span>
        </td>
        <td className="px-8 py-5">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{cat}</span>
        </td>
        <td className="px-8 py-5">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{date}</span>
        </td>
        <td className="px-8 py-5">
            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg`}>{status}</span>
        </td>
        <td className="px-8 py-5 text-right font-black italic tracking-tight">
            <span className={color}>{amount}</span>
        </td>
    </tr>
);

const SourceProgress: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
    <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
            <span>{label}</span>
            <span className="text-slate-400">{value}%</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className={`h-full ${color} rounded-full`} style={{ width: `${value}%` }}></div>
        </div>
    </div>
);

export default Financials;
