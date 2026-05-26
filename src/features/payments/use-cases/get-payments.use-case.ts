import { PaymentRepository } from "../repositories/payment.repository";
import { NotFoundError } from "@/lib/errors";

export class GetPaymentsUseCase {
  constructor(private paymentRepository: PaymentRepository) {}

  async execute() {
    const payments = await this.paymentRepository.findAll();
    return payments.map(payment => ({
      ...payment,
      amount: Number(payment.amount)
    }));
  }

  async getById(id: string) {
    const payment = await this.paymentRepository.findById(id);
    if (!payment) {
      throw new NotFoundError("Pagamento não encontrado.");
    }
    return {
      ...payment,
      amount: Number(payment.amount)
    };
  }
}
