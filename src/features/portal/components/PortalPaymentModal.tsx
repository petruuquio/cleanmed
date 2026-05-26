"use client";

import * as React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { CreditCard, CheckCircle2 } from "lucide-react";

interface PortalPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: any; 
  onSuccess: (method: string) => void;
}

export function PortalPaymentModal({ isOpen, onClose, bookingData, onSuccess }: PortalPaymentModalProps) {
  const [method, setMethod] = React.useState("CREDIT_CARD");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setMethod("CREDIT_CARD");
      setIsProcessing(false);
      setIsSuccess(false);
    }
  }, [isOpen]);

  const handlePay = async () => {
    setIsProcessing(true);
    // Simula processamento
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsProcessing(false);
    setIsSuccess(true);
    
    // Aguarda um momento antes de fechar e atualizar a tela
    setTimeout(() => {
      onSuccess(method);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Pagamento Aprovado">
        <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 size={40} className="text-primary" />
          </div>
          <h3 className="text-2xl font-headline font-bold text-on-surface mb-2">
            Consulta Confirmada!
          </h3>
          <p className="text-on-surface-variant">
            Sua consulta para <strong>{bookingData?.specialty}</strong> foi agendada e o pagamento aprovado.
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Pagamento da Consulta"
      description="Escolha a forma de pagamento para confirmar seu agendamento."
    >
      <div className="flex flex-col gap-6">
        
        <div className="bg-primary-container/20 p-4 rounded-xl border border-primary-container/30">
          <p className="text-sm text-on-surface-variant mb-1">Resumo da Consulta</p>
          <p className="font-bold text-on-surface">{bookingData?.specialty}</p>
          <p className="text-sm text-on-surface-variant">Data selecionada: {bookingData?.dateTime ? new Date(bookingData.dateTime).toLocaleString('pt-BR') : ''}</p>
          <div className="mt-4 pt-4 border-t border-outline-variant/20 flex justify-between items-center">
            <span className="font-bold text-on-surface">Valor a pagar:</span>
            <span className="text-xl font-headline font-bold text-primary">R$ 250,00</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-on-surface ml-1">Método de Pagamento</label>
          <Select 
            icon={<CreditCard size={18} />} 
            value={method} 
            onChange={(e) => setMethod(e.target.value)}
          >
            <option value="CREDIT_CARD">Cartão de Crédito</option>
            <option value="DEBIT_CARD">Cartão de Débito</option>
            <option value="PIX">PIX</option>
            <option value="HEALTH_INSURANCE">Plano de Saúde (Coparticipação)</option>
          </Select>
        </div>

        {method === "CREDIT_CARD" && (
          <div className="text-sm text-on-surface-variant bg-surface-container-low p-3 rounded-lg border border-outline-variant/30">
            * Ambiente seguro. Os dados do seu cartão serão processados pela integradora financeira.
          </div>
        )}

        <div className="mt-4 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={isProcessing}>
            Cancelar
          </Button>
          <Button onClick={handlePay} disabled={isProcessing} className="w-full sm:w-auto px-8">
            {isProcessing ? "Processando..." : "Pagar e Confirmar"}
          </Button>
        </div>

      </div>
    </Modal>
  );
}
