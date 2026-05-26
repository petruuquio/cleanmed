import { UpdateMedicFormValues } from "../schemas";
import { MedicRepository } from "../repositories/medic.repository";
import { ConflictError, NotFoundError } from "@/lib/errors";

export class UpdateMedicUseCase {
  constructor(private medicRepository: MedicRepository) {}

  async execute(id: string, data: UpdateMedicFormValues) {
    const existingMedic = await this.medicRepository.findById(id);

    if (!existingMedic) {
      throw new NotFoundError("Médico não encontrado.");
    }

    const medicWithSameData = await this.medicRepository.findByUniqueFieldsExceptId(
      data.email,
      data.document,
      data.crm,
      id
    );

    if (medicWithSameData) {
      if (medicWithSameData.email === data.email) {
        throw new ConflictError("Já existe outro médico com este e-mail.");
      }
      if (medicWithSameData.document === data.document) {
        throw new ConflictError("Já existe outro médico com este documento (CPF).");
      }
      if (medicWithSameData.crm === data.crm) {
        throw new ConflictError("Já existe outro médico com este CRM.");
      }
    }

    return this.medicRepository.update(id, data);
  }
}
