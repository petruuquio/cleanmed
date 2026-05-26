import { PatientFormValues } from "../schemas";
import { PatientRepository } from "../repositories/patient.repository";
import { ConflictError } from "@/lib/errors";

export class CreatePatientUseCase {
  constructor(private patientRepository: PatientRepository) {}

  async execute(data: PatientFormValues) {
    const existingPatient = await this.patientRepository.findByEmailOrDocument(data.email, data.document);

    if (existingPatient) {
      if (existingPatient.email === data.email) {
        throw new ConflictError("Já existe um paciente com este e-mail.");
      }
      if (existingPatient.document === data.document) {
        throw new ConflictError("Já existe um paciente com este documento (CPF).");
      }
    }

    return this.patientRepository.create(data);
  }
}
