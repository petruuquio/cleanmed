import { AppointmentFormValues } from "../schemas";
import { AppointmentRepository } from "../repositories/appointment.repository";

export class CreateAppointmentUseCase {
  constructor(private appointmentRepository: AppointmentRepository) {}

  async execute(data: AppointmentFormValues) {
    const appointment = await this.appointmentRepository.create(data);
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
