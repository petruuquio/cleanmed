import { UpdateAppointmentFormValues } from "../schemas";
import { AppointmentRepository } from "../repositories/appointment.repository";
import { NotFoundError } from "@/lib/errors";

export class UpdateAppointmentUseCase {
  constructor(private appointmentRepository: AppointmentRepository) {}

  async execute(id: string, data: UpdateAppointmentFormValues) {
    const existingAppointment = await this.appointmentRepository.findById(id);

    if (!existingAppointment) {
      throw new NotFoundError("Consulta não encontrada.");
    }

    const updatedAppointment = await this.appointmentRepository.update(id, data);
    return {
      ...updatedAppointment,
      payment: updatedAppointment.payment
        ? {
            ...updatedAppointment.payment,
            amount: Number(updatedAppointment.payment.amount),
          }
        : null,
    };
  }
}
