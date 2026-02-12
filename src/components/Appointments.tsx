import React, { useState, useEffect, useMemo } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    X,
    Edit2,
    DollarSign,
    Trash2,
    Printer,
    FileText
} from 'lucide-react';
import { createPortal } from 'react-dom';
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

interface AppointmentsProps {
    addToast?: (msg: string, type: ToastType) => void;
}

// Lista de tratamientos disponibles
const TREATMENTS = [
    'Limpieza Dental',
    'Cirugía',
    'Urgencia',
    'Ortodoncia',
    'Endodoncia',
    'Periodoncia',
    'Implantes',
    'Blanqueamiento',
    'Extracción',
    'Corona/Puente',
    'Consulta General'
];

const Appointments: React.FC<AppointmentsProps> = ({ addToast }) => {
    // Estado para las citas
    const [appointments, setAppointments] = useState<Appointment[]>(() => {
        const stored = localStorage.getItem('appointments');
        return stored ? JSON.parse(stored) : [];
    });

    // Estado para el calendario
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

    // Filtros
    const [filterTreatment, setFilterTreatment] = useState<string[]>(TREATMENTS);

    // Guardar citas en localStorage
    useEffect(() => {
        localStorage.setItem('appointments', JSON.stringify(appointments));
    }, [appointments]);

    // Actualizar selectedAppointment cuando appointments cambia
    useEffect(() => {
        if (selectedAppointment) {
            const updated = appointments.find(apt => apt.id === selectedAppointment.id);
            if (updated) {
                setSelectedAppointment(updated);
            }
        }
    }, [appointments]);

    // Obtener la hora actual para la línea roja
    const [currentTime, setCurrentTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    // Calcular la posición de la línea roja
    const getCurrentTimePosition = () => {
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        const startHour = 8;
        const pixelsPerHour = 96;

        if (hours < startHour || hours >= 20) return null;

        const position = ((hours - startHour) * pixelsPerHour) + ((minutes / 60) * pixelsPerHour);
        return position;
    };

    // Obtener el rango de fechas para la vista semanal
    const getWeekDates = (date: Date) => {
        const start = new Date(date);
        start.setDate(start.getDate() - start.getDay() + 1);

        const dates = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            dates.push(d);
        }
        return dates;
    };

    const weekDates = useMemo(() => getWeekDates(currentDate), [currentDate]);

    // Filtrar citas para la sala de espera
    const waitingRoomAppointments = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        return appointments.filter(apt =>
            apt.date === today && (apt.status === 'pending' || apt.status === 'in-progress')
        ).sort((a, b) => a.startTime.localeCompare(b.startTime));
    }, [appointments]);

    // Crear nueva cita y paciente si no existe
    const handleCreateAppointment = (appointmentData: Partial<Appointment>) => {
        const patientId = Math.random().toString(36).substr(2, 9);

        const newAppointment: Appointment = {
            id: Math.random().toString(36).substr(2, 9),
            patientId,
            patientName: appointmentData.patientName || '',
            treatment: appointmentData.treatment || '',
            date: appointmentData.date || '',
            startTime: appointmentData.startTime || '',
            endTime: appointmentData.endTime || '',
            status: 'pending',
            notes: appointmentData.notes,
            cost: appointmentData.cost,
            paid: 0
        };

        // Guardar paciente en localStorage si no existe
        const patients = JSON.parse(localStorage.getItem('patients') || '[]');
        const existingPatient = patients.find((p: any) =>
            p.name?.toLowerCase() === appointmentData.patientName?.toLowerCase()
        );

        if (!existingPatient && appointmentData.patientName) {
            const newPatient = {
                id: patientId,
                name: appointmentData.patientName,
                phone: '',
                email: '',
                dateOfBirth: '',
                age: 'N/A',
                blood: 'O+',
                allergy: 'Ninguna',
                address: '',
                medicalHistory: '',
                lastVisit: new Date(appointmentData.date || new Date()).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }),
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(appointmentData.patientName || '')}&background=137fec&color=fff&size=128`,
                treatments: [{
                    id: 1,
                    treatment: appointmentData.treatment,
                    date: appointmentData.date,
                    cost: appointmentData.cost || 0,
                    notes: appointmentData.notes || '',
                    professional: "Dr. Lucas Román",
                    status: "Completado"
                }],
                createdAt: new Date().toISOString()
            };
            patients.push(newPatient);
            localStorage.setItem('patients', JSON.stringify(patients));
            addToast?.(`Paciente "${appointmentData.patientName}" creado automáticamente`, 'success');
            // Despachar evento para que Patients.tsx se entere
            window.dispatchEvent(new CustomEvent('patientsUpdated'));
        } else if (existingPatient) {
            // Actualizar tratamientos del paciente existente
            existingPatient.treatments = existingPatient.treatments || [];
            existingPatient.treatments.push({
                id: existingPatient.treatments.length + 1,
                treatment: appointmentData.treatment,
                date: appointmentData.date,
                cost: appointmentData.cost || 0,
                notes: appointmentData.notes || '',
                professional: "Dr. Lucas Román",
                status: "Completado"
            });
            existingPatient.lastVisit = new Date(appointmentData.date || new Date()).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
            localStorage.setItem('patients', JSON.stringify(patients));
            newAppointment.patientId = existingPatient.id;
        }
        setAppointments([...appointments, newAppointment]);
        setShowNewAppointmentModal(false);
        addToast?.('Cita creada exitosamente', 'success');

        // Notificación de sistema
        window.dispatchEvent(new CustomEvent('app_notification', {
            detail: {
                title: 'Nueva cita agendada',
                description: `${newAppointment.patientName} - ${newAppointment.startTime}`,
                type: 'appointment'
            }
        }));
    };

    // Actualizar cita
    const handleUpdateAppointment = (id: string, updates: Partial<Appointment>) => {
        setAppointments(appointments.map(apt =>
            apt.id === id ? { ...apt, ...updates } : apt
        ));
        addToast?.('Cita actualizada', 'success');
    };

    // Eliminar cita
    const handleDeleteAppointment = (id: string) => {
        const aptToDelete = appointments.find(a => a.id === id);
        setAppointments(appointments.filter(apt => apt.id !== id));
        setSelectedAppointment(null);
        setEditingAppointment(null);
        addToast?.('Cita eliminada', 'success');

        if (aptToDelete) {
            window.dispatchEvent(new CustomEvent('app_notification', {
                detail: {
                    title: 'Cita cancelada',
                    description: `Se eliminó el turno de ${aptToDelete.patientName}`,
                    type: 'cancel'
                }
            }));
        }
    };

    // Registrar pago y generar factura
    const handleRegisterPayment = (id: string, amount: number) => {
        const appointment = appointments.find(apt => apt.id === id);
        if (!appointment) return;

        setAppointments(appointments.map(apt =>
            apt.id === id ? { ...apt, paid: (apt.paid || 0) + amount } : apt
        ));

        // Generar factura
        const invoice = {
            id: Math.random().toString(36).substr(2, 9),
            appointmentId: id,
            patientName: appointment.patientName,
            treatment: appointment.treatment,
            amount,
            date: new Date().toISOString(),
            paymentMethod: 'Efectivo'
        };

        // Guardar factura en localStorage
        const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
        invoices.push(invoice);
        localStorage.setItem('invoices', JSON.stringify(invoices));

        setSelectedInvoice(invoice);
        addToast?.(`Pago de $${amount} registrado. Factura #${invoice.id.substr(0, 6)} generada`, 'success');

        // Notificación de sistema
        window.dispatchEvent(new CustomEvent('app_notification', {
            detail: {
                title: 'Pago registrado',
                description: `Recibo #${invoice.id.substr(0, 6)} por $${amount} (${appointment.patientName})`,
                type: 'payment'
            }
        }));
    };

    // Renderizar las citas en el calendario
    const renderAppointmentsForDay = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];
        const dayAppointments = appointments.filter(apt =>
            apt.date === dateStr && filterTreatment.includes(apt.treatment)
        );

        return dayAppointments.map(appointment => {
            const [startHour, startMin] = appointment.startTime.split(':').map(Number);
            const [endHour, endMin] = appointment.endTime.split(':').map(Number);

            const startPosition = ((startHour - 8) * 96) + ((startMin / 60) * 96);
            const duration = ((endHour - startHour) * 96) + (((endMin - startMin) / 60) * 96);

            const statusColors = {
                'pending': { bg: 'bg-blue-50', border: 'border-blue-400', text: 'text-blue-700' },
                'in-progress': { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-700' },
                'completed': { bg: 'bg-slate-50', border: 'border-slate-300', text: 'text-slate-500' },
                'cancelled': { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-500' }
            };

            const colors = statusColors[appointment.status as keyof typeof statusColors];

            return (
                <div
                    key={appointment.id}
                    className={`absolute left-1 right-1 ${colors.bg} border-l-[3px] ${colors.border} rounded-lg p-2 cursor-pointer hover:shadow-md hover:z-10 transition-all`}
                    style={{ top: `${startPosition}px`, height: `${duration}px` }}
                    onClick={() => setSelectedAppointment(appointment)}
                >
                    <h5 className={`text-[8px] font-black italic tracking-tight ${colors.text} truncate`}>
                        {appointment.patientName}
                    </h5>
                    <p className="text-[7px] font-bold text-slate-400 mt-0.5 truncate leading-none">
                        {appointment.treatment}
                    </p>
                </div>
            );
        });
    };

    const currentTimePosition = getCurrentTimePosition();

    return (
        <div className="flex h-full bg-[#EBEBE6] animate-in fade-in duration-500 overflow-hidden">
            {/* Sidebar de la Agenda (Izquierda) */}
            <aside className="w-64 border-r border-slate-200 bg-[#F4F4F0] flex flex-col overflow-y-auto custom-scrollbar shrink-0">
                {/* Mini Calendario */}
                <MiniCalendar
                    currentDate={currentDate}
                    onDateChange={setCurrentDate}
                    onDateSelect={(date) => {
                        setSelectedDate(date);
                        setShowNewAppointmentModal(true);
                    }}
                />

                {/* Sala de Espera */}
                <div className="p-4 border-b border-slate-200">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">SALA DE ESPERA</h3>
                        <span className="text-[8px] font-black text-[#137fec] bg-blue-50 px-2 py-0.5 rounded-full">
                            {waitingRoomAppointments.length} Pacientes
                        </span>
                    </div>
                    <div className="space-y-2">
                        {waitingRoomAppointments.length === 0 ? (
                            <p className="text-[8px] text-slate-400 text-center py-4 italic">No hay pacientes</p>
                        ) : (
                            waitingRoomAppointments.map(apt => (
                                <WaitingPatient
                                    key={apt.id}
                                    appointment={apt}
                                    onClick={() => setSelectedAppointment(apt)}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* Filtros - Compactos */}
                <div className="p-4 space-y-4">
                    <div>
                        <h3 className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">DOCTOR</h3>
                        <div className="space-y-2">
                            <FilterItem label="Dr. Principal" color="bg-blue-400" checked />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">TRATAMIENTOS</h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                            {TREATMENTS.map(treatment => (
                                <FilterItem
                                    key={treatment}
                                    label={treatment}
                                    color="bg-violet-500"
                                    checked={filterTreatment.includes(treatment)}
                                    onChange={(checked) => {
                                        if (checked) {
                                            setFilterTreatment([...filterTreatment, treatment]);
                                        } else {
                                            setFilterTreatment(filterTreatment.filter(t => t !== treatment));
                                        }
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Calendario Principal (Derecha) */}
            <div className="flex-1 flex flex-col min-h-0 bg-[#EBEBE6]">
                {/* Cabecera del Calendario */}
                <header className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white/50 backdrop-blur-sm shrink-0">
                    <div className="flex bg-slate-200/50 p-0.5 rounded-xl border border-slate-200">
                        <button className="px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-slate-500">Día</button>
                        <button className="px-4 py-1.5 text-[9px] font-black uppercase tracking-widest bg-white text-[#137fec] rounded-lg shadow-sm">Semana</button>
                        <button className="px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-slate-500">Mes</button>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                const newDate = new Date(currentDate);
                                newDate.setDate(newDate.getDate() - 7);
                                setCurrentDate(newDate);
                            }}
                            className="p-1 text-slate-400"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <span className="text-xs font-black italic tracking-tight text-slate-800">
                            {weekDates[0].toLocaleDateString('es-ES', { month: 'long', day: 'numeric' })} - {weekDates[6].toLocaleDateString('es-ES', { day: 'numeric', year: 'numeric' })}
                        </span>
                        <button
                            onClick={() => {
                                const newDate = new Date(currentDate);
                                newDate.setDate(newDate.getDate() + 7);
                                setCurrentDate(newDate);
                            }}
                            className="p-1 text-slate-400"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>

                    <button
                        onClick={() => {
                            setSelectedDate(new Date());
                            setShowNewAppointmentModal(true);
                        }}
                        className="bg-[#137fec] hover:bg-blue-600 text-white px-6 py-2 rounded-xl font-black uppercase tracking-widest text-[9px] transition-all shadow-md shadow-blue-500/10 flex items-center gap-2"
                    >
                        <Plus size={14} />
                        Nueva Cita
                    </button>
                </header>

                {/* Rejilla del Calendario */}
                <div
                    ref={(el) => {
                        if (el && currentTimePosition !== null) {
                            // Auto-scroll para centrar la línea roja
                            const scrollTop = currentTimePosition - (el.clientHeight / 2);
                            if (Math.abs(el.scrollTop - scrollTop) > 100) {
                                el.scrollTop = scrollTop;
                            }
                        }
                    }}
                    className="flex-1 overflow-auto bg-white/40 relative custom-scrollbar"
                >
                    <div className="min-w-[1000px]">
                        {/* Cabecera de Días */}
                        <div className="grid grid-cols-8 border-b border-slate-200 sticky top-0 bg-[#F4F4F0]/90 backdrop-blur-md z-30">
                            <div className="p-3 border-r border-slate-200"></div>
                            {weekDates.map((date, i) => {
                                const isToday = date.toDateString() === new Date().toDateString();
                                const dayNames = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
                                return (
                                    <div
                                        key={i}
                                        className="p-2 text-center border-r border-slate-200 last:border-0 cursor-pointer hover:bg-white/30 transition-colors"
                                        onClick={() => {
                                            setSelectedDate(date);
                                            setShowNewAppointmentModal(true);
                                        }}
                                    >
                                        <span className="block text-[8px] font-black uppercase tracking-widest text-slate-400">
                                            {dayNames[i]}
                                        </span>
                                        <span className={`text-xl font-black italic tracking-tighter ${isToday ? 'text-[#137fec]' : 'text-slate-700'}`}>
                                            {date.getDate()}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Rejilla de Horas */}
                        <div className="grid grid-cols-8 relative bg-white/20">
                            {/* Línea de Hora Actual - DINÁMICA */}
                            {currentTimePosition !== null && (
                                <div
                                    className="absolute left-0 right-0 z-20 pointer-events-none"
                                    style={{ top: `${currentTimePosition}px` }}
                                >
                                    <div className="h-[1.5px] w-full bg-red-400 opacity-60 relative">
                                        <div className="absolute -left-1 -top-[3px] w-2 h-2 bg-red-400 rounded-full shadow-sm"></div>
                                    </div>
                                </div>
                            )}

                            {/* Columna de Horas */}
                            <div className="col-span-1 border-r border-slate-200">
                                {[8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7].map((h) => (
                                    <div key={h} className="h-24 p-2 text-right text-[8px] font-black text-slate-400 tracking-tighter uppercase border-b border-slate-100">
                                        {h}:00 <span className="opacity-40">{h >= 8 && h < 12 ? 'AM' : 'PM'}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Columnas de Días */}
                            {weekDates.map((date, dayIdx) => (
                                <div
                                    key={dayIdx}
                                    className="col-span-1 border-r border-slate-300 relative"
                                >
                                    {/* Celdas de 30 minutos con cuadrículas */}
                                    {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map((hour) => (
                                        <div key={hour} className="relative">
                                            {/* Primera mitad de hora */}
                                            <div
                                                className="h-12 border-b border-slate-200/80 cursor-pointer hover:bg-blue-50/50 transition-colors"
                                                onClick={() => {
                                                    const clickedTime = `${hour.toString().padStart(2, '0')}:00`;
                                                    const endTime = `${hour.toString().padStart(2, '0')}:30`;
                                                    setSelectedDate(date);
                                                    setShowNewAppointmentModal(true);
                                                    // Guardar el horario seleccionado para pre-llenarlo
                                                    setTimeout(() => {
                                                        const event = new CustomEvent('appointmentTimeSelected', {
                                                            detail: { startTime: clickedTime, endTime }
                                                        });
                                                        window.dispatchEvent(event);
                                                    }, 100);
                                                }}
                                            ></div>
                                            {/* Segunda mitad de hora */}
                                            <div
                                                className="h-12 border-b border-slate-300 cursor-pointer hover:bg-blue-50/50 transition-colors"
                                                onClick={() => {
                                                    const clickedTime = `${hour.toString().padStart(2, '0')}:30`;
                                                    const nextHour = hour + 1;
                                                    const endTime = `${nextHour.toString().padStart(2, '0')}:00`;
                                                    setSelectedDate(date);
                                                    setShowNewAppointmentModal(true);
                                                    // Guardar el horario seleccionado para pre-llenarlo
                                                    setTimeout(() => {
                                                        const event = new CustomEvent('appointmentTimeSelected', {
                                                            detail: { startTime: clickedTime, endTime }
                                                        });
                                                        window.dispatchEvent(event);
                                                    }, 100);
                                                }}
                                            ></div>
                                        </div>
                                    ))}
                                    {/* Renderizar citas sobre las celdas */}
                                    {renderAppointmentsForDay(date)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="h-8 border-t border-slate-200 bg-[#F4F4F0] px-4 flex items-center justify-between text-[7px] font-black uppercase tracking-widest text-slate-400 shrink-0">
                    <div className="flex gap-4">
                        <span className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                            {appointments.filter(a => a.status === 'in-progress').length} En proceso
                        </span>
                        <span className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                            {appointments.filter(a => a.status === 'pending').length} Pendientes
                        </span>
                    </div>
                    <span className="opacity-60 italic">
                        {currentTime.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}, {currentTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </footer>
            </div>

            {/* Modal: Nueva Cita */}
            {showNewAppointmentModal && createPortal(
                <NewAppointmentModal
                    selectedDate={selectedDate}
                    onClose={() => {
                        setShowNewAppointmentModal(false);
                        setSelectedDate(null);
                    }}
                    onCreate={handleCreateAppointment}
                />,
                document.body
            )}

            {/* Modal: Detalle de Cita - CON ACTUALIZACIÓN EN TIEMPO REAL */}
            {selectedAppointment && createPortal(
                <AppointmentDetailModal
                    appointment={selectedAppointment}
                    onClose={() => setSelectedAppointment(null)}
                    onEdit={() => setEditingAppointment(selectedAppointment)}
                    onDelete={handleDeleteAppointment}
                    onUpdateStatus={(status) => handleUpdateAppointment(selectedAppointment.id, { status })}
                    onRegisterPayment={(amount) => handleRegisterPayment(selectedAppointment.id, amount)}
                />,
                document.body
            )}

            {/* Modal: Factura */}
            {selectedInvoice && createPortal(
                <InvoiceModal
                    invoice={selectedInvoice}
                    onClose={() => setSelectedInvoice(null)}
                />,
                document.body
            )}

            {/* Modal: Editar Cita */}
            {editingAppointment && createPortal(
                <EditAppointmentModal
                    appointment={editingAppointment}
                    onClose={() => {
                        setEditingAppointment(null);
                        setSelectedAppointment(null);
                    }}
                    onUpdate={(updates) => {
                        handleUpdateAppointment(editingAppointment.id, updates);
                        setEditingAppointment(null);
                        setSelectedAppointment(null);
                    }}
                />,
                document.body
            )}
        </div>
    );
};

// Componente: Mini Calendario
const MiniCalendar: React.FC<{
    currentDate: Date;
    onDateChange: (date: Date) => void;
    onDateSelect: (date: Date) => void;
}> = ({ currentDate, onDateChange, onDateSelect }) => {
    const [displayMonth, setDisplayMonth] = useState(new Date());

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

        const days = [];
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }
        return days;
    };

    const days = getDaysInMonth(displayMonth);
    const today = new Date();

    return (
        <div className="p-4 border-b border-slate-200">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-black italic tracking-tight text-slate-800">
                    {displayMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                </h3>
                <div className="flex gap-1">
                    <button
                        onClick={() => {
                            const newDate = new Date(displayMonth);
                            newDate.setMonth(newDate.getMonth() - 1);
                            setDisplayMonth(newDate);
                        }}
                        className="p-1 hover:bg-white rounded text-slate-400"
                    >
                        <ChevronLeft size={14} />
                    </button>
                    <button
                        onClick={() => {
                            const newDate = new Date(displayMonth);
                            newDate.setMonth(newDate.getMonth() + 1);
                            setDisplayMonth(newDate);
                        }}
                        className="p-1 hover:bg-white rounded text-slate-400"
                    >
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-y-1 text-center">
                {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => (
                    <span key={d} className="text-[8px] font-black text-slate-400 uppercase">{d}</span>
                ))}
                {days.map((day, i) => {
                    if (day === null) return <span key={i}></span>;

                    const date = new Date(displayMonth.getFullYear(), displayMonth.getMonth(), day);
                    const isToday = date.toDateString() === today.toDateString();
                    const isSelected = date.toDateString() === currentDate.toDateString();

                    return (
                        <button
                            key={i}
                            onClick={() => {
                                onDateChange(date);
                                onDateSelect(date);
                            }}
                            className={`text-[9px] font-bold py-1 rounded-full transition-all ${isToday
                                ? 'bg-[#137fec] text-white shadow-sm'
                                : isSelected
                                    ? 'bg-blue-100 text-[#137fec]'
                                    : 'text-slate-800 hover:bg-slate-100'
                                }`}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

const WaitingPatient: React.FC<{
    appointment: Appointment;
    onClick: () => void;
}> = ({ appointment, onClick }) => {
    const statusColors = {
        'pending': 'bg-blue-500',
        'in-progress': 'bg-emerald-500',
        'completed': 'bg-slate-400',
        'cancelled': 'bg-red-500'
    };

    return (
        <div
            onClick={onClick}
            className="p-2.5 bg-white rounded-xl border border-slate-100 flex justify-between items-center hover:shadow-md transition-all cursor-pointer"
        >
            <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${statusColors[appointment.status]}`}></div>
                <div className="min-w-0">
                    <h4 className="text-[9px] font-black italic text-slate-800 truncate leading-none">
                        {appointment.patientName}
                    </h4>
                    <p className="text-[7px] text-slate-400 font-bold uppercase mt-1">
                        {appointment.treatment}
                    </p>
                </div>
            </div>
            <span className="text-[8px] font-black text-slate-300 shrink-0">
                {appointment.startTime}
            </span>
        </div>
    );
};

const FilterItem: React.FC<{
    label: string;
    color: string;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
}> = ({ label, color, checked, onChange }) => (
    <label className="flex items-center justify-between cursor-pointer group">
        <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${color} ${!checked && 'grayscale opacity-30'}`}></div>
            <span className={`text-[9px] font-bold italic ${checked ? 'text-slate-700' : 'text-slate-300'}`}>{label}</span>
        </div>
        <div
            onClick={() => onChange?.(!checked)}
            className={`w-3.5 h-3.5 rounded border transition-all ${checked ? 'bg-[#137fec] border-[#137fec]' : 'border-slate-200'}`}
        >
            {checked && <div className="w-full h-full flex items-center justify-center text-white text-[8px] font-black opacity-80">✓</div>}
        </div>
    </label>
);

// Modal: Nueva Cita - CON SELECTOR DE TRATAMIENTO
const NewAppointmentModal: React.FC<{
    selectedDate: Date | null;
    onClose: () => void;
    onCreate: (data: Partial<Appointment>) => void;
}> = ({ selectedDate, onClose, onCreate }) => {
    const [formData, setFormData] = useState({
        patientName: '',
        treatment: TREATMENTS[0],
        date: selectedDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '10:00',
        notes: '',
        cost: ''
    });

    // Escuchar evento de selección de hora desde el calendario
    React.useEffect(() => {
        const handleTimeSelected = (e: any) => {
            const { startTime, endTime } = e.detail;
            setFormData(prev => ({
                ...prev,
                startTime,
                endTime
            }));
        };

        window.addEventListener('appointmentTimeSelected', handleTimeSelected);
        return () => {
            window.removeEventListener('appointmentTimeSelected', handleTimeSelected);
        };
    }, []);

    const handleSubmit = () => {
        if (!formData.patientName || !formData.treatment) {
            alert('Completa los campos requeridos');
            return;
        }
        onCreate({
            ...formData,
            cost: formData.cost ? parseFloat(formData.cost) : undefined
        });
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-300 max-h-[85vh] overflow-y-auto">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <h4 className="text-lg font-black italic text-slate-800 uppercase">Nueva Cita</h4>
                    <button onClick={onClose} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-400">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-3">
                    <input
                        type="text"
                        value={formData.patientName}
                        onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl ring-1 ring-slate-200 focus:ring-2 focus:ring-[#137fec] outline-none text-xs font-bold"
                        placeholder="Nombre del Paciente"
                    />

                    <select
                        value={formData.treatment}
                        onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl ring-1 ring-slate-200 focus:ring-2 focus:ring-[#137fec] outline-none text-xs font-bold"
                    >
                        {TREATMENTS.map(treatment => (
                            <option key={treatment} value={treatment}>{treatment}</option>
                        ))}
                    </select>

                    <div className="grid grid-cols-3 gap-2">
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="px-3 py-2 bg-slate-50 border-none rounded-xl ring-1 ring-slate-200 focus:ring-2 focus:ring-[#137fec] outline-none text-[10px] font-bold"
                        />
                        <input
                            type="time"
                            value={formData.startTime}
                            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                            className="px-3 py-2 bg-slate-50 border-none rounded-xl ring-1 ring-slate-200 focus:ring-2 focus:ring-[#137fec] outline-none text-[10px] font-bold"
                        />
                        <input
                            type="time"
                            value={formData.endTime}
                            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                            className="px-3 py-2 bg-slate-50 border-none rounded-xl ring-1 ring-slate-200 focus:ring-2 focus:ring-[#137fec] outline-none text-[10px] font-bold"
                        />
                    </div>

                    <input
                        type="number"
                        value={formData.cost}
                        onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl ring-1 ring-slate-200 focus:ring-2 focus:ring-[#137fec] outline-none text-xs font-bold"
                        placeholder="Costo (opcional)"
                    />

                    <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl ring-1 ring-slate-200 focus:ring-2 focus:ring-[#137fec] outline-none text-xs font-bold h-16 resize-none"
                        placeholder="Notas"
                    />
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 bg-slate-100 rounded-xl text-[9px] font-black uppercase text-slate-500"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex-1 py-2.5 bg-[#137fec] rounded-xl text-[9px] font-black uppercase text-white shadow-lg shadow-blue-500/20"
                    >
                        Crear Cita
                    </button>
                </div>
            </div>
        </div>
    );
};

// Modal: Detalle de Cita - CON ACTUALIZACIÓN EN TIEMPO REAL
const AppointmentDetailModal: React.FC<{
    appointment: Appointment;
    onClose: () => void;
    onEdit: () => void;
    onDelete: (id: string) => void;
    onUpdateStatus: (status: Appointment['status']) => void;
    onRegisterPayment: (amount: number) => void;
}> = ({ appointment: initialAppointment, onClose, onEdit, onDelete, onUpdateStatus, onRegisterPayment }) => {
    const [paymentAmount, setPaymentAmount] = useState('');
    const [showPaymentInput, setShowPaymentInput] = useState(false);
    const [appointment, setAppointment] = useState(initialAppointment);

    // Actualizar en tiempo real cuando cambia el appointment
    React.useEffect(() => {
        setAppointment(initialAppointment);
    }, [initialAppointment]);

    const statusLabels = {
        'pending': 'Pendiente',
        'in-progress': 'En Proceso',
        'completed': 'Completado',
        'cancelled': 'Cancelado'
    };

    const handlePayment = () => {
        const amount = parseFloat(paymentAmount);
        if (amount > 0) {
            onRegisterPayment(amount);
            setPaymentAmount('');
            setShowPaymentInput(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                    <div>
                        <h4 className="text-base font-black italic text-slate-800 uppercase">{appointment.patientName}</h4>
                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mt-0.5">{appointment.treatment}</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-400">
                        <X size={18} />
                    </button>
                </div>

                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-slate-50 rounded-xl">
                            <p className="text-[7px] font-black text-slate-400 uppercase mb-0.5">Fecha</p>
                            <p className="text-xs font-black text-slate-800">
                                {new Date(appointment.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })}
                            </p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl">
                            <p className="text-[7px] font-black text-slate-400 uppercase mb-0.5">Horario</p>
                            <p className="text-xs font-black text-slate-800">{appointment.startTime} - {appointment.endTime}</p>
                        </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl">
                        <p className="text-[7px] font-black text-slate-400 uppercase mb-2">Estado</p>
                        <div className="grid grid-cols-4 gap-1">
                            {(['pending', 'in-progress', 'completed', 'cancelled'] as const).map(status => (
                                <button
                                    key={status}
                                    onClick={() => {
                                        onUpdateStatus(status);
                                        setAppointment({ ...appointment, status });
                                    }}
                                    className={`py-1.5 rounded-lg text-[7px] font-black uppercase transition-all ${appointment.status === status
                                        ? 'bg-[#137fec] text-white'
                                        : 'bg-white text-slate-400 border border-slate-200'
                                        }`}
                                >
                                    {statusLabels[status].split(' ')[0]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {appointment.cost && (
                        <div className="p-3 bg-slate-50 rounded-xl">
                            <p className="text-[7px] font-black text-slate-400 uppercase mb-2">Pago</p>
                            <div className="grid grid-cols-3 gap-2 mb-2">
                                <div>
                                    <p className="text-[7px] text-slate-500 font-bold">Total</p>
                                    <p className="text-lg font-black text-slate-800">${appointment.cost}</p>
                                </div>
                                <div>
                                    <p className="text-[7px] text-slate-500 font-bold">Pagado</p>
                                    <p className="text-lg font-black text-emerald-600">${appointment.paid || 0}</p>
                                </div>
                                <div>
                                    <p className="text-[7px] text-slate-500 font-bold">Pendiente</p>
                                    <p className="text-lg font-black text-red-600">${appointment.cost - (appointment.paid || 0)}</p>
                                </div>
                            </div>

                            {!showPaymentInput ? (
                                <button
                                    onClick={() => setShowPaymentInput(true)}
                                    className="w-full py-2 bg-emerald-500 text-white rounded-lg text-[8px] font-black uppercase flex items-center justify-center gap-1.5"
                                >
                                    <DollarSign size={14} /> Registrar Pago
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={paymentAmount}
                                        onChange={(e) => setPaymentAmount(e.target.value)}
                                        placeholder="Monto"
                                        className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold outline-none"
                                    />
                                    <button
                                        onClick={handlePayment}
                                        className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-[8px] font-black uppercase"
                                    >
                                        OK
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {appointment.notes && (
                        <div className="p-3 bg-slate-50 rounded-xl">
                            <p className="text-[7px] font-black text-slate-400 uppercase mb-1">Notas</p>
                            <p className="text-xs text-slate-600 font-medium">{appointment.notes}</p>
                        </div>
                    )}
                </div>

                <div className="flex gap-2 pt-4 border-t border-slate-100">
                    <button
                        onClick={onEdit}
                        className="flex-1 py-2.5 bg-slate-100 rounded-xl text-[9px] font-black uppercase text-slate-600 flex items-center justify-center gap-1.5"
                    >
                        <Edit2 size={14} /> Editar
                    </button>
                    <button
                        onClick={() => {
                            if (confirm('¿Eliminar esta cita?')) {
                                onDelete(appointment.id);
                            }
                        }}
                        className="flex-1 py-2.5 bg-red-50 rounded-xl text-[9px] font-black uppercase text-red-600 flex items-center justify-center gap-1.5"
                    >
                        <Trash2 size={14} /> Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};

// Modal: Editar Cita - CON SELECTOR DE TRATAMIENTO
const EditAppointmentModal: React.FC<{
    appointment: Appointment;
    onClose: () => void;
    onUpdate: (updates: Partial<Appointment>) => void;
}> = ({ appointment, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        patientName: appointment.patientName,
        treatment: appointment.treatment,
        date: appointment.date,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        notes: appointment.notes || '',
        cost: appointment.cost?.toString() || ''
    });

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-300 max-h-[85vh] overflow-y-auto">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <h4 className="text-lg font-black italic text-slate-800 uppercase">Editar Cita</h4>
                    <button onClick={onClose} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-400">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-3">
                    <input
                        type="text"
                        value={formData.patientName}
                        onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl ring-1 ring-slate-200 focus:ring-2 focus:ring-[#137fec] outline-none text-xs font-bold"
                    />

                    <select
                        value={formData.treatment}
                        onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl ring-1 ring-slate-200 focus:ring-2 focus:ring-[#137fec] outline-none text-xs font-bold"
                    >
                        {TREATMENTS.map(treatment => (
                            <option key={treatment} value={treatment}>{treatment}</option>
                        ))}
                    </select>

                    <div className="grid grid-cols-3 gap-2">
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="px-3 py-2 bg-slate-50 border-none rounded-xl ring-1 ring-slate-200 focus:ring-2 focus:ring-[#137fec] outline-none text-[10px] font-bold"
                        />
                        <input
                            type="time"
                            value={formData.startTime}
                            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                            className="px-3 py-2 bg-slate-50 border-none rounded-xl ring-1 ring-slate-200 focus:ring-2 focus:ring-[#137fec] outline-none text-[10px] font-bold"
                        />
                        <input
                            type="time"
                            value={formData.endTime}
                            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                            className="px-3 py-2 bg-slate-50 border-none rounded-xl ring-1 ring-slate-200 focus:ring-2 focus:ring-[#137fec] outline-none text-[10px] font-bold"
                        />
                    </div>

                    <input
                        type="number"
                        value={formData.cost}
                        onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl ring-1 ring-slate-200 focus:ring-2 focus:ring-[#137fec] outline-none text-xs font-bold"
                    />

                    <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl ring-1 ring-slate-200 focus:ring-2 focus:ring-[#137fec] outline-none text-xs font-bold h-16 resize-none"
                    />
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 bg-slate-100 rounded-xl text-[9px] font-black uppercase text-slate-500"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => onUpdate({
                            ...formData,
                            cost: formData.cost ? parseFloat(formData.cost) : undefined
                        })}
                        className="flex-1 py-2.5 bg-[#137fec] rounded-xl text-[9px] font-black uppercase text-white shadow-lg shadow-blue-500/20"
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
};

// Modal: Factura (Invoice)
const InvoiceModal: React.FC<{
    invoice: any;
    onClose: () => void;
}> = ({ invoice, onClose }) => {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl p-8 space-y-6 animate-in zoom-in-95 duration-300 relative overflow-hidden">
                {/* Decoración */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-16 -mt-16 opacity-50"></div>

                <div className="flex justify-between items-start relative">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#137fec] rounded-xl flex items-center justify-center text-white">
                            <FileText size={20} />
                        </div>
                        <div>
                            <h4 className="text-lg font-black italic text-slate-800 uppercase leading-none">Factura</h4>
                            <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mt-1">Nº {invoice.id.toUpperCase().substr(0, 8)}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-8 py-6 border-y border-slate-100">
                    <div className="space-y-4">
                        <div>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Paciente</p>
                            <p className="text-sm font-black italic text-slate-800">{invoice.patientName}</p>
                        </div>
                        <div>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Tratamiento</p>
                            <p className="text-xs font-bold text-slate-600">{invoice.treatment}</p>
                        </div>
                    </div>
                    <div className="space-y-4 text-right">
                        <div>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Fecha</p>
                            <p className="text-xs font-bold text-slate-800">{new Date(invoice.date).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Método de Pago</p>
                            <p className="text-xs font-bold text-slate-800">{invoice.paymentMethod}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-black uppercase text-slate-500 tracking-widest">Total Pagado</span>
                        <span className="text-2xl font-black italic text-[#137fec]">${invoice.amount}</span>
                    </div>
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        onClick={() => window.print()}
                        className="flex-1 py-3 bg-slate-100 rounded-xl text-[10px] font-black uppercase text-slate-600 flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors"
                    >
                        <Printer size={16} /> Imprimir
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 bg-[#137fec] rounded-xl text-[10px] font-black uppercase text-white shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-colors"
                    >
                        Continuar
                    </button>
                </div>

                <div className="text-center">
                    <p className="text-[8px] font-bold text-slate-300 uppercase tracking-[0.2em]">Gracias por confiar en nosotros</p>
                </div>
            </div>
        </div>
    );
};

export default Appointments;
