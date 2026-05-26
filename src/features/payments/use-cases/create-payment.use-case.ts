import { PaymentFormValues } from "../schemas";
import { PaymentRepository } from "../repositories/payment.repository";

export class CreatePaymentUseCase {
  constructor(private paymentRepository: PaymentRepository) {}

  async execute(data: PaymentFormValues) {
    const payment = await this.paymentRepository.create(data);
    return {
      ...payment,
      amount: Number(payment.amount)
    };
  }
}
