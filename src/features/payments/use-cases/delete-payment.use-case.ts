import { PaymentRepository } from "../repositories/payment.repository";
import { NotFoundError } from "@/lib/errors";

export class DeletePaymentUseCase {
  constructor(private paymentRepository: PaymentRepository) {}

  async execute(id: string) {
    const existingPayment = await this.paymentRepository.findById(id);

    if (!existingPayment) {
      throw new NotFoundError("Pagamento não encontrado.");
    }

    return this.paymentRepository.delete(id);
  }
}
