import { prisma } from "@/lib/prisma";
import { PaymentFormValues, UpdatePaymentFormValues } from "../schemas";

export class PaymentRepository {
  async findAll() {
    return prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        patient: true,
      },
    });
  }

  async findById(id: string) {
    return prisma.payment.findUnique({
      where: { id },
    });
  }

  async create(data: PaymentFormValues) {
    return prisma.payment.create({
      data: {
        amount: data.amount,
        status: data.status,
        method: data.method,
        paidAt: data.paidAt ? new Date(data.paidAt) : null,
        patientId: data.patientId,
      },
    });
  }

  async update(id: string, data: UpdatePaymentFormValues) {
    return prisma.payment.update({
      where: { id },
      data: {
        amount: data.amount,
        status: data.status,
        method: data.method,
        paidAt: data.paidAt ? new Date(data.paidAt) : null,
        patientId: data.patientId,
      },
    });
  }

  async delete(id: string) {
    return prisma.payment.delete({
      where: { id },
    });
  }
}
