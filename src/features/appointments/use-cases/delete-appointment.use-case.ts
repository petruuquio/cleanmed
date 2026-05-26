import { AppointmentRepository } from "../repositories/appointment.repository";
import { NotFoundError } from "@/lib/errors";

export class DeleteAppointmentUseCase {
  constructor(private appointmentRepository: AppointmentRepository) {}

  async execute(id: string) {
    const existingAppointment = await this.appointmentRepository.findById(id);

    if (!existingAppointment) {
      throw new NotFoundError("Consulta não encontrada.");
    }

    return this.appointmentRepository.delete(id);
  }
}
