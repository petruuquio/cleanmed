import { z } from "zod";

export const patientSchema = z.object({
  name: z.string().min(3, "Nome completo é obrigatório"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  document: z.string().min(11, "CPF ou documento inválido"),
  address: z.string().min(5, "Endereço completo é obrigatório"),
  birthDate: z.string().optional(), // Trabalharemos com string no input type="date"
});

export const updatePatientSchema = patientSchema.extend({
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres").optional().or(z.literal("")),
});

export type PatientFormValues = z.infer<typeof patientSchema>;
export type UpdatePatientFormValues = z.infer<typeof updatePatientSchema>;
