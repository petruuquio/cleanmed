import { z } from "zod";

export const appointmentSchema = z.object({
  dateTime: z.string().min(1, "A data e hora são obrigatórias"),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]),
  patientId: z.string().min(1, "Selecione um paciente"),
  medicId: z.string().min(1, "Selecione um médico"),
});

export const updateAppointmentSchema = appointmentSchema;

export type AppointmentFormValues = z.infer<typeof appointmentSchema>;
export type UpdateAppointmentFormValues = z.infer<typeof updateAppointmentSchema>;
