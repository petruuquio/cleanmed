import { getPatientsAction } from "@/features/patients/actions";
import { PacientesClient } from "@/features/patients/components/PacientesClient";

export default async function PacientesPage() {
  const res = await getPatientsAction();
  const patients = res.success ? res.data : [];

  return <PacientesClient initialPatients={patients} />;
}
