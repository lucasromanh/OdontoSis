import React from 'react';
import { Clock, ChevronLeft, ChevronRight, Plus, MapPin, MoreVertical } from 'lucide-react';

const Appointments: React.FC = () => {
    return (
        <div className="p-8 h-full flex flex-col gap-8 animate-in slide-in-from-right-4 duration-500">
            <header className="flex justify-between items-center">
                <div className="flex items-center gap-6">
                    <h2 className="text-3xl font-bold italic tracking-tight uppercase">Schedule</h2>
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <button className="p-1 hover:text-primary transition-colors"><ChevronLeft size={20} /></button>
                        <span className="text-sm font-black px-4 uppercase tracking-widest">February 11 - 17, 2026</span>
                        <button className="p-1 hover:text-primary transition-colors"><ChevronRight size={20} /></button>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-2xl">
                        <button className="px-5 py-2 text-xs font-bold uppercase tracking-widest text-slate-500 rounded-xl hover:text-primary">Day</button>
                        <button className="px-5 py-2 text-xs font-bold uppercase tracking-widest bg-white dark:bg-slate-900 text-primary rounded-xl shadow-sm">Week</button>
                        <button className="px-5 py-2 text-xs font-bold uppercase tracking-widest text-slate-500 rounded-xl hover:text-primary">Month</button>
                    </div>
                    <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-2xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2 active:scale-95">
                        <Plus size={18} />
                        Book appointment
                    </button>
                </div>
            </header>

            <div className="flex-1 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col">
                {/* Calendar Grid */}
                <div className="grid grid-cols-8 border-b border-slate-100 dark:border-slate-800">
                    <div className="p-6 border-r border-slate-100 dark:border-slate-800 text-slate-400 font-bold text-[10px] uppercase tracking-widest flex items-end">Local Time</div>
                    {['Mon 11', 'Tue 12', 'Wed 13', 'Thu 14', 'Fri 15', 'Sat 16', 'Sun 17'].map((day, i) => (
                        <div key={i} className={`p-6 text-center border-r border-slate-100 dark:border-slate-800 last:border-0 ${i === 2 ? 'bg-primary/5' : ''}`}>
                            <span className={`block text-xs font-black uppercase tracking-widest ${i === 2 ? 'text-primary' : 'text-slate-400'}`}>{day.split(' ')[0]}</span>
                            <span className={`text-2xl font-black ${i === 2 ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>{day.split(' ')[1]}</span>
                        </div>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-8 h-full">
                        {/* Time labels */}
                        <div className="col-span-1 border-r border-slate-100 dark:border-slate-800 divide-y divide-slate-50 dark:divide-slate-800">
                            {[8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6].map(h => (
                                <div key={h} className="h-24 p-4 text-right text-[10px] font-black text-slate-300 uppercase">{h}:00 {h > 7 && h < 12 ? 'AM' : 'PM'}</div>
                            ))}
                        </div>

                        {/* Days columns */}
                        {[...Array(7)].map((_, dayIdx) => (
                            <div key={dayIdx} className={`col-span-1 border-r border-slate-100 dark:border-slate-800 relative divide-y divide-slate-50 dark:divide-slate-800 ${dayIdx === 2 ? 'bg-primary/[0.02]' : ''}`}>
                                {[...Array(11)].map((_, i) => <div key={i} className="h-24"></div>)}

                                {/* Mock Appointments */}
                                {dayIdx === 0 && <AppointmentEntry top="h-24 mt-24" height="h-24" name="Sofia Chen" type="Root Canal" color="bg-blue-500" />}
                                {dayIdx === 2 && <AppointmentEntry top="h-24 mt-48" height="h-48" name="Marcus V." type="Consultation" color="bg-primary" />}
                                {dayIdx === 2 && <AppointmentEntry top="h-24 mt-[24rem]" height="h-24" name="Elena L." type="Orthodontics" color="bg-orange-500" />}
                                {dayIdx === 4 && <AppointmentEntry top="mt-12" height="h-20" name="John Doe" type="Cleaning" color="bg-teal-500" />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const AppointmentEntry: React.FC<{ top: string; height: string; name: string; type: string; color: string }> = ({ top, height, name, type, color }) => (
    <div className={`absolute left-1 right-1 ${top} ${height} ${color} text-white p-3 rounded-2xl shadow-lg shadow-inner z-10 cursor-pointer hover:scale-[1.02] transition-all transform active:scale-95 group`}>
        <div className="flex justify-between items-start">
            <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{type}</span>
                <span className="text-xs font-black truncate">{name}</span>
            </div>
            <MoreVertical size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        {height !== 'h-24' && (
            <div className="mt-2 text-[9px] font-bold opacity-60 flex flex-col gap-1">
                <span className="flex items-center gap-1"><Clock size={10} /> 10:30 - 12:00</span>
                <span className="flex items-center gap-1"><MapPin size={10} /> Cabinet 1</span>
            </div>
        )}
    </div>
);

export default Appointments;
