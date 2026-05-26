"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DollarSign, Activity, CreditCard, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { paymentSchema, type PaymentFormValues } from "../schemas";

import { createPaymentAction, updatePaymentAction } from "../actions";

interface PaymentFormProps {
  initialData?: any;
  patients?: any[];
  onSuccess?: () => void;
}

export function PaymentForm({ initialData, patients = [], onSuccess }: PaymentFormProps) {
  const defaultValues: PaymentFormValues = {
    amount: 0,
    patientId: "",
    status: "PENDING",
    method: "CREDIT_CARD",
    paidAt: "",
  };

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: initialData ? { ...defaultValues, ...initialData } : defaultValues,
  });

  React.useEffect(() => {
    if (initialData) {
      reset({ ...defaultValues, ...initialData });
    } else {
      reset(defaultValues);
    }
  }, [initialData, reset]);

  const statusValue = watch("status");

  const onSubmit = async (data: PaymentFormValues) => {
    try {
      const res = initialData?.id
        ? await updatePaymentAction(initialData.id, data)
        : await createPaymentAction(data);

      if (res.success) {
        if (onSuccess) onSuccess();
      } else {
        alert(res.error?.message || "Ocorreu um erro");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar pagamento");
    }
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-on-surface ml-1">Paciente</label>
        <Select {...register("patientId")}>
          <option value="">Selecione um paciente...</option>
          {patients.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </Select>
        {errors.patientId && <p className="text-xs text-error ml-1">{errors.patientId.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-on-surface ml-1">Valor (R$)</label>
        <Input type="number" step="0.01" icon={<DollarSign size={18} />} {...register("amount", { valueAsNumber: true })} />
        {errors.amount && <p className="text-xs text-error ml-1">{errors.amount.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-on-surface ml-1">Método de Pagamento</label>
          <Select icon={<CreditCard size={18} />} {...register("method")}>
            <option value="CREDIT_CARD">Cartão de Crédito</option>
            <option value="DEBIT_CARD">Cartão de Débito</option>
            <option value="PIX">PIX</option>
            <option value="CASH">Dinheiro</option>
            <option value="HEALTH_INSURANCE">Plano de Saúde</option>
          </Select>
          {errors.method && <p className="text-xs text-error ml-1">{errors.method.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-on-surface ml-1">Status</label>
          <Select icon={<Activity size={18} />} {...register("status")}>
            <option value="PENDING">Pendente</option>
            <option value="PAID">Pago</option>
            <option value="REFUNDED">Reembolsado</option>
            <option value="FAILED">Falhou</option>
          </Select>
          {errors.status && <p className="text-xs text-error ml-1">{errors.status.message}</p>}
        </div>
      </div>

      {statusValue === "PAID" && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-on-surface ml-1">Data do Pagamento</label>
          <Input type="date" icon={<CalendarDays size={18} />} {...register("paidAt")} />
          {errors.paidAt && <p className="text-xs text-error ml-1">{errors.paidAt.message}</p>}
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto px-8">
          {isSubmitting ? "Registrando..." : "Registrar Transação"}
        </Button>
      </div>
    </form>
  );
}
