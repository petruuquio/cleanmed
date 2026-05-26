import { UpdatePatientFormValues } from "../schemas";
import { PatientRepository } from "../repositories/patient.repository";
import { ConflictError, NotFoundError } from "@/lib/errors";

export class UpdatePatientUseCase {
  constructor(private patientRepository: PatientRepository) {}

  async execute(id: string, data: UpdatePatientFormValues) {
    const existingPatient = await this.patientRepository.findById(id);

    if (!existingPatient) {
      throw new NotFoundError("Paciente não encontrado.");
    }

    const patientWithSameData = await this.patientRepository.findByEmailOrDocumentExceptId(
      data.email,
      data.document,
      id
    );

    if (patientWithSameData) {
      if (patientWithSameData.email === data.email) {
        throw new ConflictError("Já existe outro paciente com este e-mail.");
      }
      if (patientWithSameData.document === data.document) {
        throw new ConflictError("Já existe outro paciente com este documento (CPF).");
      }
    }

    return this.patientRepository.update(id, data);
  }
}
