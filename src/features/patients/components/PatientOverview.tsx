import * as React from "react";
import {
  Heart,
  Activity,
  Stethoscope,
  FileText,
  Download,
  ChevronRight,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PatientOverviewProps {
  patientId: string;
}

export function PatientOverview({ patientId }: PatientOverviewProps) {
  // Dados mockados para exibição
  const patient = {
    name: "João Silva",
    since: "2020",
    avatar: "https://i.pravatar.cc/150?u=joao.silva",
    age: "34 anos",
    bloodType: "O+",
    weight: "78 kg",
    phone: "(11) 98765-4321",
    email: "joao.silva@email.com",
    address: "Rua das Flores, 123",
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto mt-4">

      <div className="flex items-center gap-5">
        <img
          src={patient.avatar}
          alt={patient.name}
          className="w-24 h-24 rounded-full object-cover border-4 border-surface"
        />
        <div>
          <h1 className="text-3xl font-headline font-bold text-on-surface">{patient.name}</h1>
          <p className="text-on-surface-variant font-medium mt-1">Paciente desde {patient.since}</p>
        </div>
      </div>

      <hr className="border-outline-variant/20" />

      {/* DADOS CADASTRAIS (GRID) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4">
        <div>
          <p className="text-xs font-bold text-on-surface-variant tracking-wider uppercase mb-1">Idade</p>
          <p className="text-on-surface font-medium">{patient.age}</p>
        </div>
        <div>
          <p className="text-xs font-bold text-on-surface-variant tracking-wider uppercase mb-1">Sangue</p>
          <p className="text-on-surface font-medium">{patient.bloodType}</p>
        </div>
        <div>
          <p className="text-xs font-bold text-on-surface-variant tracking-wider uppercase mb-1">Peso</p>
          <p className="text-on-surface font-medium">{patient.weight}</p>
        </div>
        <div>
          <p className="text-xs font-bold text-on-surface-variant tracking-wider uppercase mb-1">Telefone</p>
          <p className="text-on-surface font-medium">{patient.phone}</p>
        </div>
        <div>
          <p className="text-xs font-bold text-on-surface-variant tracking-wider uppercase mb-1">E-mail</p>
          <p className="text-on-surface font-medium">{patient.email}</p>
        </div>
        <div>
          <p className="text-xs font-bold text-on-surface-variant tracking-wider uppercase mb-1">Endereço</p>
          <p className="text-on-surface font-medium">{patient.address}</p>
        </div>
      </div>

      {/* SINAIS VITAIS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-on-surface-variant font-bold text-sm tracking-wide mb-4">
            <Heart size={18} />
            FREQ. CARDÍACA
          </div>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-headline font-bold text-on-surface">72</span>
            <span className="text-on-surface-variant font-medium">bpm</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            <span className="text-xs font-bold text-primary">Normal</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-on-surface-variant font-bold text-sm tracking-wide mb-4">
            <Activity size={18} />
            PRESSÃO ARTERIAL
          </div>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-headline font-bold text-on-surface">130/85</span>
            <span className="text-on-surface-variant font-medium">mmHg</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-tertiary"></span>
            <span className="text-xs font-bold text-tertiary">Elevada</span>
          </div>
        </div>
      </div>

      {/* HISTÓRICO DE CONSULTAS */}
      <div className="mt-6 flex flex-col gap-4">

        <h2 className="text-xl font-headline font-bold text-on-surface px-1">Histórico de Consultas</h2>

        <div className="flex flex-col gap-4">
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Stethoscope size={24} />
              </div>
              <div>
                <h3 className="font-bold text-on-surface text-lg">Check-up Geral</h3>
                <p className="text-sm text-on-surface-variant mb-2">Dr. Ricardo Oliveira • 15 de Out, 2023</p>
                <p className="text-sm text-on-surface-variant">
                  Paciente relatou fadiga leve. Prescritos suplementos vitamínicos e orientada rotina de exames de sangue.
                </p>
              </div>
            </div>
            <Button variant="secondary" className="shrink-0 text-xs shadow-sm bg-surface-container hover:bg-surface-container-high border-none">
              <FileText size={14} className="mr-2" />
              Ver Exames
            </Button>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0">
                <Heart size={24} />
              </div>
              <div>
                <h3 className="font-bold text-on-surface text-lg">Consulta Cardiológica</h3>
                <p className="text-sm text-on-surface-variant mb-2">Dra. Amanda Costa • 12 de Abr, 2023</p>
                <p className="text-sm text-on-surface-variant">
                  Acompanhamento de pressão arterial elevada. Ajuste de dosagem de medicação. Próximo check-up em 6 meses.
                </p>
              </div>
            </div>
            <Button variant="secondary" className="shrink-0 text-xs shadow-sm bg-surface-container hover:bg-surface-container-high border-none">
              <FileText size={14} className="mr-2" />
              Receita
            </Button>
          </div>
        </div>
      </div>

      {/* PRONTUÁRIOS MÉDICOS */}
      <div className="mt-6 flex flex-col gap-4 mb-8">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-xl font-headline font-bold text-on-surface">Prontuários Médicos</h2>
          <Button className="h-9 px-4 text-xs font-bold shadow-sm">
            <Plus size={16} className="mr-1" />
            Novo Arquivo
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:border-primary/50 transition-colors group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-secondary-container/50 text-secondary-fixed-dim flex items-center justify-center shrink-0">
                <FileText size={20} />
              </div>
              <div>
                <h4 className="font-bold text-on-surface text-sm">Resultados de Exame de Sangue</h4>
                <p className="text-xs text-on-surface-variant">Enviado em 20 Out, 2023 • PDF (2.4 MB)</p>
              </div>
            </div>
            <div className="text-on-surface-variant group-hover:text-primary transition-colors p-2">
              <Download size={20} />
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:border-primary/50 transition-colors group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-secondary-container/50 text-secondary-fixed-dim flex items-center justify-center shrink-0">
                <FileText size={20} />
              </div>
              <div>
                <h4 className="font-bold text-on-surface text-sm">Raio-X do Tórax</h4>
                <p className="text-xs text-on-surface-variant">Enviado em 05 Mai, 2023 • DICOM (15.8 MB)</p>
              </div>
            </div>
            <div className="text-on-surface-variant group-hover:text-primary transition-colors p-2">
              <Download size={20} />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
