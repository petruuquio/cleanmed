"use client"
import * as React from "react";
import { Download, Plus, DollarSign, Clock, CreditCard } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { PaymentForm } from "@/features/payments/components/PaymentForm";
import { PaymentsTable } from "@/features/payments/components/PaymentsTable";
import { deletePaymentAction } from "@/features/payments/actions";

interface PagamentosClientProps {
  initialPayments: any[];
  patients: any[];
}

export function PagamentosClient({ initialPayments, patients }: PagamentosClientProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [paymentToEdit, setPaymentToEdit] = React.useState<any>(null);
  const [paymentToDelete, setPaymentToDelete] = React.useState<any>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleEdit = (payment: any) => {
    // Format date for input
    const formatted = {
      ...payment,
      paidAt: payment.paidAt ? new Date(payment.paidAt).toISOString().split('T')[0] : "",
      amount: Number(payment.amount),
    };
    setPaymentToEdit(formatted);
    setIsModalOpen(true);
  };

  const handleDelete = (payment: any) => {
    setPaymentToDelete(payment);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPaymentToEdit(null);
  };

  const confirmDelete = async () => {
    if (!paymentToDelete) return;
    setIsDeleting(true);
    const res = await deletePaymentAction(paymentToDelete.id);
    setIsDeleting(false);
    if (res.success) {
      setPaymentToDelete(null);
    } else {
      alert(res.error?.message || "Erro ao excluir pagamento");
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-headline text-3xl font-bold text-on-surface">
            Pagamentos
          </h1>
          <p className="font-body text-on-surface-variant mt-1">
            Controle financeiro, faturamentos e recebimentos.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/30 text-on-surface px-4 py-2.5 rounded-xl font-semibold hover:bg-surface-container-low transition-colors shadow-sm text-sm">
            <Download size={18} />
            Exportar
          </button>
          <button
            onClick={() => { setPaymentToEdit(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-sm text-sm"
          >
            <Plus size={18} />
            Nova Transação
          </button>
        </div>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_4px_20px_rgba(46,50,48,0.06)] border border-outline-variant/10">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-primary-container/30 p-2 rounded-lg">
              <DollarSign className="text-primary" size={24} />
            </div>
          </div>
          <p className="text-on-surface-variant text-sm mb-1">Receita Total (Paga)</p>
          <h3 className="text-3xl font-headline font-bold text-on-surface">
            R$ {initialPayments.filter(p => p.status === "PAID").reduce((acc, curr) => acc + Number(curr.amount), 0).toFixed(2)}
          </h3>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_4px_20px_rgba(46,50,48,0.06)] border border-outline-variant/10">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-tertiary-container/30 p-2 rounded-lg">
              <Clock className="text-tertiary" size={24} />
            </div>
          </div>
          <p className="text-on-surface-variant text-sm mb-1">Pagamentos Pendentes</p>
          <h3 className="text-3xl font-headline font-bold text-on-surface">
            R$ {initialPayments.filter(p => p.status !== "PAID").reduce((acc, curr) => acc + Number(curr.amount), 0).toFixed(2)}
          </h3>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_4px_20px_rgba(46,50,48,0.06)] border border-outline-variant/10">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-secondary-container/30 p-2 rounded-lg">
              <CreditCard className="text-secondary" size={24} />
            </div>
          </div>
          <p className="text-on-surface-variant text-sm mb-1">Transações Realizadas</p>
          <h3 className="text-3xl font-headline font-bold text-on-surface">
            {initialPayments.length}
          </h3>
        </div>
      </div>

      <PaymentsTable payments={initialPayments} onEdit={handleEdit} onDelete={handleDelete} />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={paymentToEdit ? "Editar Transação" : "Nova Transação"}
        description={paymentToEdit ? "Atualize os dados desta transação." : "Registre um novo pagamento recebido ou pendente."}
      >
        <PaymentForm initialData={paymentToEdit} patients={patients} onSuccess={handleCloseModal} />
      </Modal>

      <ConfirmModal
        isOpen={!!paymentToDelete}
        onClose={() => setPaymentToDelete(null)}
        title="Excluir Transação"
        description={`Tem certeza que deseja excluir o pagamento ${paymentToDelete?.id}? Esta ação afetará o fluxo de caixa.`}
        onConfirm={confirmDelete}
      />
    </>
  );
}
