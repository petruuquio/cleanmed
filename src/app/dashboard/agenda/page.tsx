import * as React from "react";
import { AgendaCalendar } from "@/features/appointments/components/AgendaCalendar";
import { getAppointmentsAction } from "@/features/appointments/actions";
import { getPatientsAction } from "@/features/patients/actions";
import { getMedicsAction } from "@/features/medics/actions";

export default async function AgendaPage() {
  const [appointmentsRes, patientsRes, medicsRes] = await Promise.all([
    getAppointmentsAction(),
    getPatientsAction(),
    getMedicsAction()
  ]);

  const appointments = appointmentsRes.success ? appointmentsRes.data : [];
  const patients = patientsRes.success ? patientsRes.data : [];
  const medics = medicsRes.success ? medicsRes.data : [];

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-headline text-3xl font-bold text-on-surface">
            Agenda
          </h1>
          <p className="font-body text-on-surface-variant mt-1">
            Visão geral do calendário de atendimentos da clínica.
          </p>
        </div>
      </div>

      <AgendaCalendar 
        initialAppointments={appointments}
        patients={patients}
        medics={medics}
      />
    </>
  );
}
