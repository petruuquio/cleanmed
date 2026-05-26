
import { getAppointmentsAction } from "@/features/appointments/actions";
import { getPatientsAction } from "@/features/patients/actions";
import { getMedicsAction } from "@/features/medics/actions";
import { ConsultasClient } from "@/features/appointments/components/ConsultasClient";

export default async function ConsultasPage() {
  const [appointmentsRes, patientsRes, medicsRes] = await Promise.all([
    getAppointmentsAction(),
    getPatientsAction(),
    getMedicsAction(),
  ]);

  const appointments = appointmentsRes.success ? appointmentsRes.data : [];
  const patients = patientsRes.success ? patientsRes.data : [];
  const medics = medicsRes.success ? medicsRes.data : [];

  return (
    <ConsultasClient
      initialAppointments={appointments}
      patients={patients}
      medics={medics}
    />
  );
}
