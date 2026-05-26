"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarClock, User, Stethoscope, Activity } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { appointmentSchema, type AppointmentFormValues } from "../schemas";

import { createAppointmentAction, updateAppointmentAction } from "../actions";

interface AppointmentFormProps {
  initialData?: any;
  patients: any[];
  medics: any[];
  onSuccess?: () => void;
}

export function AppointmentForm({ initialData, patients, medics, onSuccess }: AppointmentFormProps) {
  const defaultValues: AppointmentFormValues = {
    dateTime: "",
    status: "PENDING",
    patientId: "",
    medicId: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: initialData ? { ...defaultValues, ...initialData } : defaultValues,
  });

  React.useEffect(() => {
    if (initialData) {
      reset({ ...defaultValues, ...initialData });
    } else {
      reset(defaultValues);
    }
  }, [initialData, reset]);

  const onSubmit = async (data: AppointmentFormValues) => {
    try {
      const res = initialData?.id
        ? await updateAppointmentAction(initialData.id, data)
        : await createAppointmentAction(data);

      if (res.success) {
        if (onSuccess) onSuccess();
      } else {
        alert(res.error?.message || "Ocorreu um erro");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao agendar consulta");
    }
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-on-surface ml-1">Paciente</label>
        <Select icon={<User size={18} />} {...register("patientId")}>
          <option value="">Selecione um paciente...</option>
          {patients.map(p => (
            <option key={p.id} value={p.id}>{p.name} (CPF: {p.document})</option>
          ))}
        </Select>
        {errors.patientId && <p className="text-xs text-error ml-1">{errors.patientId.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-bold text-on-surface ml-1">Médico Responsável</label>
        <Select icon={<Stethoscope size={18} />} {...register("medicId")}>
          <option value="">Selecione um médico...</option>
          {medics.map(m => (
            <option key={m.id} value={m.id}>{m.name} ({m.specialty})</option>
          ))}
        </Select>
        {errors.medicId && <p className="text-xs text-error ml-1">{errors.medicId.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-on-surface ml-1">Data e Hora</label>
          <Input type="datetime-local" icon={<CalendarClock size={18} />} {...register("dateTime")} />
          {errors.dateTime && <p className="text-xs text-error ml-1">{errors.dateTime.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-on-surface ml-1">Status</label>
          <Select icon={<Activity size={18} />} {...register("status")}>
            <option value="PENDING">Pendente</option>
            <option value="CONFIRMED">Confirmado</option>
            <option value="COMPLETED">Concluído</option>
            <option value="CANCELLED">Cancelado</option>
          </Select>
          {errors.status && <p className="text-xs text-error ml-1">{errors.status.message}</p>}
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto px-8">
          {isSubmitting ? "Agendando..." : "Salvar Agendamento"}
        </Button>
      </div>
    </form>
  );
}
