"use server";

import { revalidatePath } from "next/cache";
import { paymentSchema, PaymentFormValues, updatePaymentSchema, UpdatePaymentFormValues } from "./schemas";
import { PaymentRepository } from "./repositories/payment.repository";
import { CreatePaymentUseCase } from "./use-cases/create-payment.use-case";
import { UpdatePaymentUseCase } from "./use-cases/update-payment.use-case";
import { DeletePaymentUseCase } from "./use-cases/delete-payment.use-case";
import { GetPaymentsUseCase } from "./use-cases/get-payments.use-case";
import { AppError } from "@/lib/errors";
import { actionError, actionSuccess } from "@/lib/action-response";

const repository = new PaymentRepository();
const createUseCase = new CreatePaymentUseCase(repository);
const updateUseCase = new UpdatePaymentUseCase(repository);
const deleteUseCase = new DeletePaymentUseCase(repository);
const getUseCase = new GetPaymentsUseCase(repository);

export async function createPaymentAction(data: PaymentFormValues) {
  try {
    const validatedData = paymentSchema.parse(data);
    const payment = await createUseCase.execute(validatedData);
    
    revalidatePath("/dashboard/pagamentos");
    return actionSuccess(payment, "Pagamento registrado com sucesso.");
  } catch (error: any) {
    if (error instanceof AppError) {
      return actionError(error.message, error.code);
    }
    return actionError("Erro ao registrar pagamento.");
  }
}

export async function updatePaymentAction(id: string, data: UpdatePaymentFormValues) {
  try {
    const validatedData = updatePaymentSchema.parse(data);
    const payment = await updateUseCase.execute(id, validatedData);
    
    revalidatePath("/dashboard/pagamentos");
    return actionSuccess(payment, "Pagamento atualizado com sucesso.");
  } catch (error: any) {
    if (error instanceof AppError) {
      return actionError(error.message, error.code);
    }
    return actionError("Erro ao atualizar pagamento.");
  }
}

export async function deletePaymentAction(id: string) {
  try {
    await deleteUseCase.execute(id);
    
    revalidatePath("/dashboard/pagamentos");
    return actionSuccess(null, "Pagamento excluído com sucesso.");
  } catch (error: any) {
    if (error instanceof AppError) {
      return actionError(error.message, error.code);
    }
    return actionError("Erro ao excluir pagamento.");
  }
}

export async function getPaymentsAction() {
  try {
    const payments = await getUseCase.execute();
    return actionSuccess(payments);
  } catch (error: any) {
    return actionError("Erro ao buscar pagamentos.");
  }
}
