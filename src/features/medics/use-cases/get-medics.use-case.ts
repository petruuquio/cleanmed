import { MedicRepository } from "../repositories/medic.repository";
import { NotFoundError } from "@/lib/errors";

export class GetMedicsUseCase {
  constructor(private medicRepository: MedicRepository) {}

  async execute() {
    return this.medicRepository.findAll();
  }

  async getById(id: string) {
    const medic = await this.medicRepository.findById(id);
    if (!medic) {
      throw new NotFoundError("Médico não encontrado.");
    }
    return medic;
  }
}
