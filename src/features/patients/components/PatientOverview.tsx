"use client";

import * as React from "react";
import {
  Heart,
  Activity,
  Stethoscope,
  FileText,
  Download,
  ChevronRight,
  Plus,
  Upload,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { uploadPatientPhotoAction, uploadPatientAttachmentAction } from "../actions";

interface PatientOverviewProps {
  patient: any;
}

export function PatientOverview({ patient }: PatientOverviewProps) {
  const [isUploadingPhoto, setIsUploadingPhoto] = React.useState(false);
  const [isUploadingFile, setIsUploadingFile] = React.useState(false);

  const photoInputRef = React.useRef<HTMLInputElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Calcula idade
  const calculateAge = (birthDate: Date | string | null) => {
    if (!birthDate) return "Não informada";
    const dob = new Date(birthDate);
    const diff_ms = Date.now() - dob.getTime();
    const age_dt = new Date(diff_ms);
    return Math.abs(age_dt.getUTCFullYear() - 1970) + " anos";
  };

  const handlePhotoClick = () => {
    photoInputRef.current?.click();
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      await uploadPatientPhotoAction(patient.id, base64);
      setIsUploadingPhoto(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingFile(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      await uploadPatientAttachmentAction({
        patientId: patient.id,
        title: file.name,
        fileData: base64,
        type: "OTHER"
      });
      setIsUploadingFile(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDownloadFile = (base64Data: string, filename: string) => {
    const a = document.createElement("a");
    a.href = base64Data;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const fallbackAvatar = "https://ui-avatars.com/api/?name=" + encodeURIComponent(patient.name) + "&background=random";

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto mt-4">
      {/* Inputs ocultos */}
      <input type="file" ref={photoInputRef} className="hidden" accept="image/*" onChange={handlePhotoChange} />
      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />

      <div className="flex items-center gap-5">
        <div className="relative group cursor-pointer" onClick={handlePhotoClick}>
          <img
            src={patient.avatarUrl || fallbackAvatar}
            alt={patient.name}
            className={`w-24 h-24 rounded-full object-cover border-4 border-surface transition-opacity ${isUploadingPhoto ? 'opacity-50' : 'group-hover:opacity-80'}`}
          />
          {isUploadingPhoto ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="animate-spin text-primary" size={24} />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-full">
              <Upload className="text-white" size={24} />
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold text-on-surface">{patient.name}</h1>
          <p className="text-on-surface-variant font-medium mt-1">
            Paciente desde {new Date(patient.createdAt).getFullYear()}
          </p>
        </div>
      </div>

      <hr className="border-outline-variant/20" />

      {/* DADOS CADASTRAIS (GRID) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4">
        <div>
          <p className="text-xs font-bold text-on-surface-variant tracking-wider uppercase mb-1">Idade</p>
          <p className="text-on-surface font-medium">{calculateAge(patient.birthDate)}</p>
        </div>
        <div>
          <p className="text-xs font-bold text-on-surface-variant tracking-wider uppercase mb-1">Documento (CPF)</p>
          <p className="text-on-surface font-medium">{patient.document}</p>
        </div>
        <div>
          <p className="text-xs font-bold text-on-surface-variant tracking-wider uppercase mb-1">Data Nasc.</p>
          <p className="text-on-surface font-medium">{patient.birthDate ? new Date(patient.birthDate).toLocaleDateString("pt-BR") : "Não informada"}</p>
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

      {/* SINAIS VITAIS - FAKE (Apenas UI ilustrativa) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-on-surface-variant font-bold text-sm tracking-wide mb-4">
            <Heart size={18} />
            FREQ. CARDÍACA
          </div>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-headline font-bold text-on-surface">--</span>
            <span className="text-on-surface-variant font-medium">bpm</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-on-surface-variant">Não registrado</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-on-surface-variant font-bold text-sm tracking-wide mb-4">
            <Activity size={18} />
            PRESSÃO ARTERIAL
          </div>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-headline font-bold text-on-surface">--/--</span>
            <span className="text-on-surface-variant font-medium">mmHg</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-on-surface-variant">Não registrado</span>
          </div>
        </div>
      </div>

      {/* HISTÓRICO DE CONSULTAS */}
      <div className="mt-6 flex flex-col gap-4">
        <h2 className="text-xl font-headline font-bold text-on-surface px-1">Histórico de Consultas</h2>

        <div className="flex flex-col gap-4">
          {!patient.appointments || patient.appointments.length === 0 ? (
            <p className="text-sm text-on-surface-variant px-1">Nenhuma consulta encontrada para este paciente.</p>
          ) : (
            patient.appointments.map((apt: any) => (
              <div key={apt.id} className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Stethoscope size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-on-surface text-lg">{apt.medic.specialty || "Consulta"}</h3>
                    <p className="text-sm text-on-surface-variant mb-2">{apt.medic.name} • {new Date(apt.dateTime).toLocaleDateString("pt-BR")} às {new Date(apt.dateTime).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}</p>
                    <p className="text-sm font-bold text-on-surface-variant">
                      Status: {apt.status}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* PRONTUÁRIOS MÉDICOS E ANEXOS */}
      <div className="mt-6 flex flex-col gap-4 mb-8">
        <div className="flex justify-between items-center px-1">
          <h2 className="text-xl font-headline font-bold text-on-surface">Arquivos e Anexos</h2>
          <Button onClick={handleFileClick} disabled={isUploadingFile} className="h-9 px-4 text-xs font-bold shadow-sm">
            {isUploadingFile ? <Loader2 className="animate-spin mr-2" size={16} /> : <Plus size={16} className="mr-1" />}
            {isUploadingFile ? "Enviando..." : "Novo Arquivo"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!patient.attachments || patient.attachments.length === 0 ? (
            <p className="text-sm text-on-surface-variant px-1">Nenhum arquivo anexado.</p>
          ) : (
            patient.attachments.map((att: any) => (
              <div key={att.id} onClick={() => att.content && handleDownloadFile(att.content, att.title)} className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:border-primary/50 transition-colors group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary-container/50 text-secondary-fixed-dim flex items-center justify-center shrink-0">
                    <FileText size={20} />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-on-surface text-sm truncate">{att.title}</h4>
                    <p className="text-xs text-on-surface-variant">
                      Enviado em {new Date(att.createdAt).toLocaleDateString("pt-BR")} • {att.type}
                    </p>
                  </div>
                </div>
                <div className="text-on-surface-variant group-hover:text-primary transition-colors p-2">
                  <Download size={20} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
