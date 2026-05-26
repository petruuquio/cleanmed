import { AppointmentRepository } from "../repositories/appointment.repository";
import { NotFoundError } from "@/lib/errors";

export class GetAppointmentsUseCase {
  constructor(private appointmentRepository: AppointmentRepository) {}

  async execute() {
    const appointments = await this.appointmentRepository.findAll();
    return appointments.map((appointment) => ({
      ...appointment,
      payment: appointment.payment
        ? {
            ...appointment.payment,
            amount: Number(appointment.payment.amount),
          }
        : null,
    }));
  }

  async getById(id: string) {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new NotFoundError("Consulta não encontrada.");
    }
    return {
      ...appointment,
      payment: appointment.payment
        ? {
            ...appointment.payment,
            amount: Number(appointment.payment.amount),
          }
        : null,
    };
  }
}
