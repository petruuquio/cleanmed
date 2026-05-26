import { getMedicsAction } from "@/features/medics/actions";
import { MedicosClient } from "@/features/medics/components/MedicosClient";

export default async function MedicosPage() {
  const res = await getMedicsAction();
  const medics = res.success ? res.data : [];

  return <MedicosClient initialMedics={medics} />;
}
