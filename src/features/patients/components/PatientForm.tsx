"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Phone, Lock, FileText, MapPin, Calendar, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { patientSchema, type PatientFormValues } from "../schemas";

import { createPatientAction, updatePatientAction } from "../actions";

interface PatientFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export function PatientForm({ initialData, onSuccess }: PatientFormProps) {
  const defaultValues = {
    name: "",
    email: "",
    phone: "",
    password: "",
    document: "",
    address: "",
    birthDate: "",
  };

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    defaultValues: initialData ? { ...defaultValues, ...initialData } : defaultValues,
  });

  React.useEffect(() => {
    if (initialData) {
      reset({ ...defaultValues, ...initialData });
    } else {
      reset(defaultValues);
    }
  }, [initialData, reset]);

  const onSubmit = async (data: PatientFormValues) => {
    try {
      const res = initialData?.id 
        ? await updatePatientAction(initialData.id, data)
        : await createPatientAction(data);
      
      if (res.success) {
        if (onSuccess) onSuccess();
      } else {
        alert(res.error?.message || "Ocorreu um erro");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar paciente");
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
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-on-surface ml-1">Nome Completo</label>
          <Input placeholder="Ex: João da Silva" icon={<User size={18} />} {...register("name")} />
          {errors.name && <p className="text-xs text-error ml-1">{errors.name.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-on-surface ml-1">Documento (CPF/RG)</label>
          <Input placeholder="000.000.000-00" icon={<FileText size={18} />} {...register("document")} />
          {errors.document && <p className="text-xs text-error ml-1">{errors.document.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-on-surface ml-1">E-mail</label>
          <Input type="email" placeholder="paciente@exemplo.com" icon={<Mail size={18} />} {...register("email")} />
          {errors.email && <p className="text-xs text-error ml-1">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-on-surface ml-1">Telefone</label>
          <Input type="tel" placeholder="(00) 00000-0000" icon={<Phone size={18} />} {...register("phone")} />
          {errors.phone && <p className="text-xs text-error ml-1">{errors.phone.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
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

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-on-surface ml-1">Data de Nascimento</label>
          <Input type="date" icon={<Calendar size={18} />} {...register("birthDate")} />
          {errors.birthDate && <p className="text-xs text-error ml-1">{errors.birthDate.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-sm font-bold text-on-surface ml-1">Endereço Completo</label>
          <Input placeholder="Rua, Número, Bairro, Cidade - UF" icon={<MapPin size={18} />} {...register("address")} />
          {errors.address && <p className="text-xs text-error ml-1">{errors.address.message}</p>}
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto px-8">
          {isSubmitting ? "Cadastrando..." : "Cadastrar Paciente"}
        </Button>
      </div>
    </form>
  );
}
