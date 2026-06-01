import * as React from "react";
import { PatientOverview } from "@/features/patients/components/PatientOverview";
import { getPatientDetailsAction } from "@/features/patients/actions";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PatientOverviewPage({ params }: PageProps) {
  const { id } = await params;
  
  const res = await getPatientDetailsAction(id);
  if (!res.success || !res.data) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-xl font-bold text-error">Paciente não encontrado</h2>
        <Link href="/dashboard/pacientes" className="text-primary mt-4 hover:underline">
          Voltar para a lista
        </Link>
      </div>
    );
  }

  const patient = res.data;

  return (
    <>
      <div className="mb-4 flex items-center">
        <Link 
          href="/dashboard/pacientes" 
          className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 font-bold text-sm"
        >
          <ChevronLeft size={16} /> Voltar para Pacientes
        </Link>
      </div>
      <PatientOverview patient={patient} />
    </>
  );
}
