import { PatientRepository } from "../repositories/patient.repository";
import { NotFoundError } from "@/lib/errors";

export class DeletePatientUseCase {
  constructor(private patientRepository: PatientRepository) {}

  async execute(id: string) {
    const existingPatient = await this.patientRepository.findById(id);

    if (!existingPatient) {
      throw new NotFoundError("Paciente não encontrado.");
    }

    return this.patientRepository.delete(id);
  }
}
