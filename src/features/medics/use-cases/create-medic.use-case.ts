import { MedicFormValues } from "../schemas";
import { MedicRepository } from "../repositories/medic.repository";
import { ConflictError } from "@/lib/errors";

export class CreateMedicUseCase {
  constructor(private medicRepository: MedicRepository) {}

  async execute(data: MedicFormValues) {
    const existingMedic = await this.medicRepository.findByUniqueFields(data.email, data.document, data.crm);

    if (existingMedic) {
      if (existingMedic.email === data.email) {
        throw new ConflictError("Já existe um médico com este e-mail.");
      }
      if (existingMedic.document === data.document) {
        throw new ConflictError("Já existe um médico com este documento (CPF).");
      }
      if (existingMedic.crm === data.crm) {
        throw new ConflictError("Já existe um médico com este CRM.");
      }
    }

    return this.medicRepository.create(data);
  }
}
