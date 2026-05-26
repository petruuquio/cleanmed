import { z } from "zod";

export const medicSchema = z.object({
  name: z.string().min(3, "Nome completo é obrigatório"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  document: z.string().min(11, "CPF ou documento inválido"),
  crm: z.string().min(4, "CRM inválido"),
  specialty: z.string().min(2, "Especialidade é obrigatória"),
  room: z.string().min(1, "Sala/Consultório é obrigatório"),
});

export const updateMedicSchema = medicSchema.extend({
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres").optional().or(z.literal("")),
});

export type MedicFormValues = z.infer<typeof medicSchema>;
export type UpdateMedicFormValues = z.infer<typeof updateMedicSchema>;
