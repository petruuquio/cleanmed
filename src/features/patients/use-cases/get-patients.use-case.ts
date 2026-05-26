import { PatientRepository } from "../repositories/patient.repository";
import { NotFoundError } from "@/lib/errors";

export class GetPatientsUseCase {
  constructor(private patientRepository: PatientRepository) {}

  async execute() {
    return this.patientRepository.findAll();
  }

  async getById(id: string) {
    const patient = await this.patientRepository.findById(id);
    if (!patient) {
      throw new NotFoundError("Paciente não encontrado.");
    }
    return patient;
  }
}
