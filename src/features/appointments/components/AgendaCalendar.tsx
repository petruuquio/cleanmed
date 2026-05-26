"use client";

import * as React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { DatesSetArg } from "@fullcalendar/core";
import { User, Stethoscope, Calendar as CalendarIcon } from "lucide-react";
import { Select } from "@/components/ui/Select";
import { Card, CardContent } from "@/components/ui/Card";

interface AgendaCalendarProps {
  initialAppointments: any[];
  patients: any[];
  medics: any[];
}

const MONTHS = [
  { value: "0", label: "Janeiro" },
  { value: "1", label: "Fevereiro" },
  { value: "2", label: "Março" },
  { value: "3", label: "Abril" },
  { value: "4", label: "Maio" },
  { value: "5", label: "Junho" },
  { value: "6", label: "Julho" },
  { value: "7", label: "Agosto" },
  { value: "8", label: "Setembro" },
  { value: "9", label: "Outubro" },
  { value: "10", label: "Novembro" },
  { value: "11", label: "Dezembro" },
];

export function AgendaCalendar({ initialAppointments, patients, medics }: AgendaCalendarProps) {
  const calendarRef = React.useRef<FullCalendar>(null);

  const [selectedPatient, setSelectedPatient] = React.useState("");
  const [selectedMedic, setSelectedMedic] = React.useState("");
  const [selectedMonth, setSelectedMonth] = React.useState(new Date().getMonth().toString());

  // Handle FullCalendar navigation (prev/next/today clicked)
  const handleDatesSet = (arg: DatesSetArg) => {
    // The view's current start date will indicate the current month being shown
    // arg.view.currentStart gives the start of the month for dayGridMonth
    const currentMonth = arg.view.currentStart.getMonth().toString();
    if (selectedMonth !== currentMonth) {
      setSelectedMonth(currentMonth);
    }
  };

  // Handle external month filter change
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = e.target.value;
    setSelectedMonth(newMonth);

    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      const currentDate = api.getDate();
      currentDate.setMonth(parseInt(newMonth));
      api.gotoDate(currentDate);
    }
  };

  // Format real events
  const allEvents = React.useMemo(() => {
    return initialAppointments.map((apt) => ({
      id: apt.id,
      title: `${apt.medic?.specialty || 'Consulta'} - ${apt.patient?.name || 'Paciente'}`,
      date: new Date(apt.dateTime).toISOString().split("T")[0], // FullCalendar uses YYYY-MM-DD
      patientId: apt.patientId,
      medicId: apt.medicId,
      color: apt.status === "PENDING" ? "var(--color-tertiary)" :
        apt.status === "CONFIRMED" ? "var(--color-primary)" :
          apt.status === "CANCELLED" ? "var(--color-error)" : "var(--color-secondary)",
    }));
  }, [initialAppointments]);

  // Filter events based on selections
  const filteredEvents = allEvents.filter((event) => {
    const matchPatient = selectedPatient === "" || event.patientId === selectedPatient;
    const matchMedic = selectedMedic === "" || event.medicId === selectedMedic;
    return matchPatient && matchMedic;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Filters Bar */}
      <Card className="shadow-sm">
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-on-surface ml-1">Paciente</label>
              <Select
                icon={<User size={18} />}
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
              >
                <option value="">Todos os Pacientes</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-on-surface ml-1">Médico</label>
              <Select
                icon={<Stethoscope size={18} />}
                value={selectedMedic}
                onChange={(e) => setSelectedMedic(e.target.value)}
              >
                <option value="">Todos os Médicos</option>
                {medics.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-on-surface ml-1">Mês</label>
              <Select
                icon={<CalendarIcon size={18} />}
                value={selectedMonth}
                onChange={handleMonthChange}
              >
                {MONTHS.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Area */}
      <Card className="shadow-sm">
        <CardContent className="p-0 sm:p-2 overflow-hidden rounded-2xl">
          <div className="calendar-container p-4">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={filteredEvents}
              datesSet={handleDatesSet}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek'
              }}
              buttonText={{
                today: 'Hoje',
                month: 'Mês',
                week: 'Semana',
                day: 'Dia',
                list: 'Lista'
              }}
              locale="pt-br"
              height="auto"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stylize FullCalendar natively using Global CSS overrides specific to this container */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .calendar-container {
          --fc-border-color: var(--color-outline-variant);
          --fc-button-text-color: var(--color-on-primary);
          --fc-button-bg-color: var(--color-primary);
          --fc-button-border-color: var(--color-primary);
          --fc-button-hover-bg-color: var(--color-on-primary-fixed-variant);
          --fc-button-hover-border-color: var(--color-on-primary-fixed-variant);
          --fc-button-active-bg-color: var(--color-on-primary-fixed-variant);
          --fc-button-active-border-color: var(--color-on-primary-fixed-variant);
          
          --fc-today-bg-color: color-mix(in srgb, var(--color-primary) 10%, transparent);
          --fc-neutral-bg-color: var(--color-surface);
          --fc-page-bg-color: var(--color-surface-container-lowest);
        }

        .calendar-container .fc-theme-standard td, 
        .calendar-container .fc-theme-standard th, 
        .calendar-container .fc-theme-standard .fc-scrollgrid {
          border-color: color-mix(in srgb, var(--color-outline-variant) 30%, transparent);
        }

        /* Buttons Styling to match design system */
        .calendar-container .fc-button {
          font-family: 'Nunito Sans', sans-serif !important;
          font-weight: 600 !important;
          border-radius: 0.5rem !important;
          text-transform: capitalize;
          padding: 0.5rem 1rem !important;
          transition: all 0.2s ease-in-out;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }

        .calendar-container .fc-button-primary:not(:disabled):active,
        .calendar-container .fc-button-primary:not(:disabled).fc-button-active {
          background-color: var(--color-on-primary-fixed-variant) !important;
          border-color: var(--color-on-primary-fixed-variant) !important;
        }

        .calendar-container .fc-button:focus {
          box-shadow: 0 0 0 2px color-mix(in srgb, var(--color-primary) 20%, transparent) !important;
        }

        .calendar-container .fc-toolbar-chunk .fc-button-group {
          gap: 0.5rem;
        }

        /* Toolbar Title */
        .calendar-container .fc-toolbar-title {
          font-family: 'Literata', serif !important;
          font-weight: 700 !important;
          color: var(--color-on-surface) !important;
          font-size: 1.5rem !important;
          text-transform: capitalize;
        }

        /* Headers */
        .calendar-container .fc-col-header-cell-cushion {
          color: var(--color-on-surface-variant) !important;
          font-weight: 700 !important;
          padding: 0.75rem 0 !important;
        }

        /* Events */
        .calendar-container .fc-event {
          border-radius: 4px;
          border: none;
          padding: 2px 4px;
          font-size: 0.75rem;
          font-family: 'Nunito Sans', sans-serif;
          font-weight: 600;
          cursor: pointer;
        }
      `}} />
    </div>
  );
}
