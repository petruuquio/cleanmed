import { z } from "zod";

export const paymentSchema = z.object({
  amount: z.number().min(0.01),
  patientId: z.string().min(1, "Selecione um paciente"),
  status: z.enum(["PENDING", "PAID", "REFUNDED", "FAILED"]),
  method: z.enum(["CASH", "CREDIT_CARD", "DEBIT_CARD", "PIX", "HEALTH_INSURANCE"]),
  paidAt: z.string().optional(),
});

export const updatePaymentSchema = paymentSchema;

export type PaymentFormValues = z.infer<typeof paymentSchema>;
export type UpdatePaymentFormValues = z.infer<typeof updatePaymentSchema>;
