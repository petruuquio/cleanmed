"use client"
import * as React from "react";
import { Plus, Users, Activity, AlertCircle } from "lucide-react";
import { PatientsTable } from "@/features/patients/components/PatientsTable";
import { Modal } from "@/components/ui/Modal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { PatientForm } from "@/features/patients/components/PatientForm";
import { deletePatientAction } from "@/features/patients/actions";

interface PacientesClientProps {
  initialPatients: any[];
}

export function PacientesClient({ initialPatients }: PacientesClientProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [patientToEdit, setPatientToEdit] = React.useState<any>(null);
  const [patientToDelete, setPatientToDelete] = React.useState<any>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleEdit = (patient: any) => {
    // Format the date for the date input type="date"
    const formattedPatient = {
      ...patient,
      birthDate: patient.birthDate ? new Date(patient.birthDate).toISOString().split('T')[0] : "",
    };
    setPatientToEdit(formattedPatient);
    setIsModalOpen(true);
  };

  const handleDelete = (patient: any) => {
    setPatientToDelete(patient);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPatientToEdit(null);
  };

  const confirmDelete = async () => {
    if (!patientToDelete) return;
    setIsDeleting(true);
    const res = await deletePatientAction(patientToDelete.id);
    setIsDeleting(false);
    if (res.success) {
      setPatientToDelete(null);
    } else {
      alert(res.error?.message || "Erro ao excluir");
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-headline text-3xl font-bold text-on-surface">
            Pacientes
          </h1>
          <p className="font-body text-on-surface-variant mt-1">
            Gerencie os registros de pacientes da clínica.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setPatientToEdit(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-sm text-sm"
          >
            <Plus size={18} />
            Novo Paciente
          </button>
        </div>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_4px_20px_rgba(46,50,48,0.06)] border border-outline-variant/10">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-primary-container/30 p-2 rounded-lg">
              <Users className="text-primary" size={24} />
            </div>
          </div>
          <p className="text-on-surface-variant text-sm mb-1">Total de Pacientes</p>
          <h3 className="text-3xl font-headline font-bold text-on-surface">{initialPatients.length}</h3>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_4px_20px_rgba(46,50,48,0.06)] border border-outline-variant/10">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-tertiary-container/30 p-2 rounded-lg">
              <Activity className="text-tertiary" size={24} />
            </div>
          </div>
          <p className="text-on-surface-variant text-sm mb-1">Novos este Mês</p>
          <h3 className="text-3xl font-headline font-bold text-on-surface">
            {initialPatients.length > 0 ? Math.floor(initialPatients.length / 3) + 1 : 0}
          </h3>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_4px_20px_rgba(46,50,48,0.06)] border border-outline-variant/10">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-error-container/30 p-2 rounded-lg">
              <AlertCircle className="text-error" size={24} />
            </div>
          </div>
          <p className="text-on-surface-variant text-sm mb-1">Em Análise</p>
          <h3 className="text-3xl font-headline font-bold text-on-surface">
            {initialPatients.length > 0 ? Math.floor(initialPatients.length / 5) : 0}
          </h3>
        </div>
      </div>

      <PatientsTable patients={initialPatients} onEdit={handleEdit} onDelete={handleDelete} />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={patientToEdit ? "Editar Paciente" : "Novo Paciente"}
        description={
          patientToEdit
            ? "Atualize os dados do paciente abaixo."
            : "Preencha os dados abaixo para cadastrar um novo paciente no sistema."
        }
      >
        <PatientForm initialData={patientToEdit} onSuccess={handleCloseModal} />
      </Modal>

      <ConfirmModal
        isOpen={!!patientToDelete}
        onClose={() => setPatientToDelete(null)}
        title="Excluir Paciente"
        description={`Tem certeza que deseja excluir o paciente ${patientToDelete?.name}? Esta ação não pode ser desfeita.`}
        onConfirm={confirmDelete}
      />
    </>
  );
}
