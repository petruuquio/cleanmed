"use client";
import * as React from "react";
import { Plus, CalendarDays, FileClock, CalendarOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AppointmentsTable } from "@/features/appointments/components/AppointmentsTable";
import { Modal } from "@/components/ui/Modal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { AppointmentForm } from "@/features/appointments/components/AppointmentForm";
import { deleteAppointmentAction, updateAppointmentStatusAction } from "@/features/appointments/actions";

interface ConsultasClientProps {
  initialAppointments: any[];
  patients: any[];
  medics: any[];
}

export function ConsultasClient({ initialAppointments, patients, medics }: ConsultasClientProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [appointmentToEdit, setAppointmentToEdit] = React.useState<any>(null);
  const [appointmentToDelete, setAppointmentToDelete] = React.useState<any>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleEdit = (appointment: any) => {
    const formatted = {
      ...appointment,
      dateTime: new Date(appointment.dateTime).toISOString().slice(0, 16),
    };
    setAppointmentToEdit(formatted);
    setIsModalOpen(true);
  };

  const handleDelete = (appointment: any) => {
    setAppointmentToDelete(appointment);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setAppointmentToEdit(null);
  };

  const confirmDelete = async () => {
    if (!appointmentToDelete) return;
    setIsDeleting(true);
    const res = await deleteAppointmentAction(appointmentToDelete.id);
    setIsDeleting(false);
    if (res.success) {
      setAppointmentToDelete(null);
    } else {
      alert(res.error?.message || "Erro ao cancelar consulta");
    }
  };

  const handleAccept = async (appointment: any) => {
    const res = await updateAppointmentStatusAction(appointment.id, "CONFIRMED");
    if (!res.success) alert(res.error?.message || "Erro ao aceitar consulta");
  };

  const handleReject = async (appointment: any) => {
    const res = await updateAppointmentStatusAction(appointment.id, "CANCELLED");
    if (!res.success) alert(res.error?.message || "Erro ao recusar consulta");
  };

  return (
    <>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-headline font-bold text-on-surface">
            Consultas
          </h2>
          <p className="text-on-surface-variant mt-1 text-sm">
            Gerencie consultas passadas e futuras.
          </p>
        </div>
        <Button className="shadow-sm" onClick={() => { setAppointmentToEdit(null); setIsModalOpen(true); }}>
          <Plus size={20} />
          Nova Consulta
        </Button>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_4px_20px_rgba(46,50,48,0.06)] border border-outline-variant/10">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-primary-container/30 p-2 rounded-lg">
              <CalendarDays className="text-primary" size={24} />
            </div>
          </div>
          <p className="text-on-surface-variant text-sm mb-1">Total de Consultas</p>
          <h3 className="text-3xl font-headline font-bold text-on-surface">{initialAppointments.length}</h3>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_4px_20px_rgba(46,50,48,0.06)] border border-outline-variant/10">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-tertiary-container/30 p-2 rounded-lg">
              <FileClock className="text-tertiary" size={24} />
            </div>
          </div>
          <p className="text-on-surface-variant text-sm mb-1">Aguardando Confirmação</p>
          <h3 className="text-3xl font-headline font-bold text-on-surface">
            {initialAppointments.filter(a => a.status === "PENDING").length}
          </h3>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_4px_20px_rgba(46,50,48,0.06)] border border-outline-variant/10">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-error-container/30 p-2 rounded-lg">
              <CalendarOff className="text-error" size={24} />
            </div>
          </div>
          <p className="text-on-surface-variant text-sm mb-1">Cancelamentos</p>
          <h3 className="text-3xl font-headline font-bold text-on-surface">
            {initialAppointments.filter(a => a.status === "CANCELLED").length}
          </h3>
        </div>
      </div>

      <AppointmentsTable 
        appointments={initialAppointments} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
        onAccept={handleAccept}
        onReject={handleReject}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={appointmentToEdit ? "Editar Agendamento" : "Novo Agendamento"}
        description={
          appointmentToEdit
            ? "Atualize os detalhes da consulta abaixo."
            : "Preencha os detalhes para agendar uma nova consulta."
        }
      >
        <AppointmentForm patients={patients} medics={medics} initialData={appointmentToEdit} onSuccess={handleCloseModal} />
      </Modal>

      <ConfirmModal
        isOpen={!!appointmentToDelete}
        onClose={() => setAppointmentToDelete(null)}
        title="Cancelar Consulta"
        description={`Tem certeza que deseja cancelar a consulta do paciente ${appointmentToDelete?.patient?.name}? Esta ação não pode ser desfeita.`}
        onConfirm={confirmDelete}
      />
    </>
  );
}
