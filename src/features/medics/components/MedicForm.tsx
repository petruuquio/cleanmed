"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Phone, Lock, FileText, BadgePlus, Stethoscope, MapPin, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { medicSchema, type MedicFormValues } from "../schemas";

import { createMedicAction, updateMedicAction } from "../actions";

interface MedicFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export function MedicForm({ initialData, onSuccess }: MedicFormProps) {
  const defaultValues = {
    name: "",
    email: "",
    phone: "",
    password: "",
    document: "",
    crm: "",
    specialty: "",
    room: "",
  };

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MedicFormValues>({
    resolver: zodResolver(medicSchema),
    defaultValues: initialData ? { ...defaultValues, ...initialData } : defaultValues,
  });

  React.useEffect(() => {
    if (initialData) {
      reset({ ...defaultValues, ...initialData });
    } else {
      reset(defaultValues);
    }
  }, [initialData, reset]);

  const onSubmit = async (data: MedicFormValues) => {
    try {
      const res = initialData?.id
        ? await updateMedicAction(initialData.id, data)
        : await createMedicAction(data);
      
      if (res.success) {
        if (onSuccess) onSuccess();
      } else {
        alert(res.error?.message || "Ocorreu um erro");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar médico");
    }
  };

  const handleGeneratePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setValue("password", password, { shouldValidate: true });
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-sm font-bold text-on-surface ml-1">Nome Completo</label>
          <Input placeholder="Ex: Dra. Sarah Jenkins" icon={<User size={18} />} {...register("name")} />
          {errors.name && <p className="text-xs text-error ml-1">{errors.name.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-on-surface ml-1">Documento (CPF/RG)</label>
          <Input placeholder="000.000.000-00" icon={<FileText size={18} />} {...register("document")} />
          {errors.document && <p className="text-xs text-error ml-1">{errors.document.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-on-surface ml-1">CRM</label>
          <Input placeholder="CRM-UF 123456" icon={<BadgePlus size={18} />} {...register("crm")} />
          {errors.crm && <p className="text-xs text-error ml-1">{errors.crm.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-on-surface ml-1">Especialidade</label>
          <Input placeholder="Ex: Cardiologia" icon={<Stethoscope size={18} />} {...register("specialty")} />
          {errors.specialty && <p className="text-xs text-error ml-1">{errors.specialty.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-on-surface ml-1">Sala / Consultório</label>
          <Input placeholder="Ex: Sala 204" icon={<MapPin size={18} />} {...register("room")} />
          {errors.room && <p className="text-xs text-error ml-1">{errors.room.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-on-surface ml-1">E-mail</label>
          <Input type="email" placeholder="medico@clinica.com" icon={<Mail size={18} />} {...register("email")} />
          {errors.email && <p className="text-xs text-error ml-1">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-on-surface ml-1">Telefone</label>
          <Input type="tel" placeholder="(00) 00000-0000" icon={<Phone size={18} />} {...register("phone")} />
          {errors.phone && <p className="text-xs text-error ml-1">{errors.phone.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <div className="flex justify-between items-baseline ml-1">
            <label className="text-sm font-bold text-on-surface">Senha de Acesso</label>
            <button 
              type="button" 
              onClick={handleGeneratePassword}
              className="text-xs font-bold text-primary hover:text-on-primary-fixed-variant transition-colors flex items-center gap-1"
            >
              <Wand2 size={12} /> Gerar Senha
            </button>
          </div>
          <Input type="text" placeholder="Definir senha inicial" icon={<Lock size={18} />} {...register("password")} />
          {errors.password && <p className="text-xs text-error ml-1">{errors.password.message}</p>}
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto px-8">
          {isSubmitting ? "Cadastrando..." : "Cadastrar Médico"}
        </Button>
      </div>
    </form>
  );
}
