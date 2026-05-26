import { prisma } from "@/lib/prisma";
import { AppointmentFormValues, UpdateAppointmentFormValues } from "../schemas";

export class AppointmentRepository {
  async findAll() {
    return prisma.appointment.findMany({
      orderBy: { dateTime: "desc" },
      include: {
        patient: { select: { name: true, document: true } },
        medic: { select: { name: true, specialty: true } },
        payment: true,
      },
    });
  }

  async findById(id: string) {
    return prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: true,
        medic: true,
        payment: true,
      },
    });
  }

  async create(data: AppointmentFormValues) {
    // Transaction to create Payment alongside Appointment
    return prisma.$transaction(async (tx) => {
      // Create an empty pending payment by default
      const payment = await tx.payment.create({
        data: {
          amount: 0,
          status: "PENDING",
          method: "CASH",
        },
      });

      const appointment = await tx.appointment.create({
        data: {
          dateTime: new Date(data.dateTime),
          status: data.status,
          patientId: data.patientId,
          medicId: data.medicId,
          paymentId: payment.id,
        },
        include: {
          patient: true,
          medic: true,
          payment: true,
        },
      });

      return appointment;
    });
  }

  async update(id: string, data: UpdateAppointmentFormValues) {
    return prisma.appointment.update({
      where: { id },
      data: {
        dateTime: new Date(data.dateTime),
        status: data.status,
        patientId: data.patientId,
        medicId: data.medicId,
      },
      include: {
        patient: true,
        medic: true,
        payment: true,
      },
    });
  }

  async delete(id: string) {
    // Payment deletion will cascade according to schema, but we can do it explicitly to be safe
    // Prisma model: payment Payment @relation(fields: [paymentId], references: [id], onDelete: Cascade)
    return prisma.appointment.delete({
      where: { id },
    });
  }
}
