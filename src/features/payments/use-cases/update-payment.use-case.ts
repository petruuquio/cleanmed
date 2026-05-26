import { UpdatePaymentFormValues } from "../schemas";
import { PaymentRepository } from "../repositories/payment.repository";
import { NotFoundError } from "@/lib/errors";

export class UpdatePaymentUseCase {
  constructor(private paymentRepository: PaymentRepository) {}

  async execute(id: string, data: UpdatePaymentFormValues) {
    const existingPayment = await this.paymentRepository.findById(id);

    if (!existingPayment) {
      throw new NotFoundError("Pagamento não encontrado.");
    }

    const updatedPayment = await this.paymentRepository.update(id, data);
    return {
      ...updatedPayment,
      amount: Number(updatedPayment.amount)
    };
  }
}
