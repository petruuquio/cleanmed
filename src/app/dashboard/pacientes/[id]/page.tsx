import * as React from "react";
import { PatientOverview } from "@/features/patients/components/PatientOverview";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PatientOverviewPage({ params }: PageProps) {
  const { id } = await params;
  // O id do paciente está disponível em id para buscar no backend
  // Por enquanto, o PatientOverview utiliza dados mockados baseados no layout

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
      <PatientOverview patientId={id} />
    </>
  );
}
