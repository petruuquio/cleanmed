"use client"
import * as React from "react";
import { Plus, Stethoscope, Activity, Star } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { MedicForm } from "@/features/medics/components/MedicForm";
import { MedicsTable } from "@/features/medics/components/MedicsTable";
import { deleteMedicAction } from "@/features/medics/actions";

interface MedicosClientProps {
  initialMedics: any[];
}

export function MedicosClient({ initialMedics }: MedicosClientProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [medicToEdit, setMedicToEdit] = React.useState<any>(null);
  const [medicToDelete, setMedicToDelete] = React.useState<any>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleEdit = (medic: any) => {
    setMedicToEdit(medic);
    setIsModalOpen(true);
  };

  const handleDelete = (medic: any) => {
    setMedicToDelete(medic);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setMedicToEdit(null);
  };

  const confirmDelete = async () => {
    if (!medicToDelete) return;
    setIsDeleting(true);
    const res = await deleteMedicAction(medicToDelete.id);
    setIsDeleting(false);
    if (res.success) {
      setMedicToDelete(null);
    } else {
      alert(res.error?.message || "Erro ao excluir médico");
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-headline text-3xl font-bold text-on-surface">
            Médicos
          </h1>
          <p className="font-body text-on-surface-variant mt-1">
            Gestão da equipe médica e especialidades.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setMedicToEdit(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-sm text-sm"
          >
            <Plus size={18} />
            Novo Médico
          </button>
        </div>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_4px_20px_rgba(46,50,48,0.06)] border border-outline-variant/10">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-primary-container/30 p-2 rounded-lg">
              <Stethoscope className="text-primary" size={24} />
            </div>
          </div>
          <p className="text-on-surface-variant text-sm mb-1">Total de Médicos</p>
          <h3 className="text-3xl font-headline font-bold text-on-surface">{initialMedics.length}</h3>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_4px_20px_rgba(46,50,48,0.06)] border border-outline-variant/10">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-tertiary-container/30 p-2 rounded-lg">
              <Activity className="text-tertiary" size={24} />
            </div>
          </div>
          <p className="text-on-surface-variant text-sm mb-1">Médicos Ativos</p>
          <h3 className="text-3xl font-headline font-bold text-on-surface">
            {initialMedics.length}
          </h3>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_4px_20px_rgba(46,50,48,0.06)] border border-outline-variant/10">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-secondary-container/30 p-2 rounded-lg">
              <Star className="text-secondary" size={24} />
            </div>
          </div>
          <p className="text-on-surface-variant text-sm mb-1">Especialidades</p>
          <h3 className="text-3xl font-headline font-bold text-on-surface">
            {new Set(initialMedics.map(m => m.specialty)).size}
          </h3>
        </div>
      </div>

      <MedicsTable medics={initialMedics} onEdit={handleEdit} onDelete={handleDelete} />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={medicToEdit ? "Editar Médico" : "Novo Médico"}
        description={medicToEdit ? "Atualize os dados e a especialidade do médico." : "Cadastre um novo médico e defina sua especialidade e acesso."}
      >
        <MedicForm initialData={medicToEdit} onSuccess={handleCloseModal} />
      </Modal>

      <ConfirmModal
        isOpen={!!medicToDelete}
        onClose={() => setMedicToDelete(null)}
        title="Excluir Médico"
        description={`Tem certeza que deseja excluir o médico ${medicToDelete?.name}?`}
        onConfirm={confirmDelete}
      />
    </>
  );
}
