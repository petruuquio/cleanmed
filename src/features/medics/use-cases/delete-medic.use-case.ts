import { MedicRepository } from "../repositories/medic.repository";
import { NotFoundError } from "@/lib/errors";

export class DeleteMedicUseCase {
  constructor(private medicRepository: MedicRepository) {}

  async execute(id: string) {
    const existingMedic = await this.medicRepository.findById(id);

    if (!existingMedic) {
      throw new NotFoundError("Médico não encontrado.");
    }

    return this.medicRepository.delete(id);
  }
}
