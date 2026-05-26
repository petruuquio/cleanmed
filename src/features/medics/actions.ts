"use server";

import { revalidatePath } from "next/cache";
import { medicSchema, MedicFormValues, updateMedicSchema, UpdateMedicFormValues } from "./schemas";
import { MedicRepository } from "./repositories/medic.repository";
import { CreateMedicUseCase } from "./use-cases/create-medic.use-case";
import { UpdateMedicUseCase } from "./use-cases/update-medic.use-case";
import { DeleteMedicUseCase } from "./use-cases/delete-medic.use-case";
import { GetMedicsUseCase } from "./use-cases/get-medics.use-case";
import { AppError } from "@/lib/errors";
import { actionError, actionSuccess } from "@/lib/action-response";

const repository = new MedicRepository();
const createUseCase = new CreateMedicUseCase(repository);
const updateUseCase = new UpdateMedicUseCase(repository);
const deleteUseCase = new DeleteMedicUseCase(repository);
const getUseCase = new GetMedicsUseCase(repository);

export async function createMedicAction(data: MedicFormValues) {
  try {
    const validatedData = medicSchema.parse(data);
    const medic = await createUseCase.execute(validatedData);
    
    revalidatePath("/dashboard/medicos");
    return actionSuccess(medic, "Médico cadastrado com sucesso.");
  } catch (error: any) {
    if (error instanceof AppError) {
      return actionError(error.message, error.code);
    }
    return actionError("Erro ao criar médico. Verifique os dados e tente novamente.");
  }
}

export async function updateMedicAction(id: string, data: UpdateMedicFormValues) {
  try {
    const validatedData = updateMedicSchema.parse(data);
    const medic = await updateUseCase.execute(id, validatedData);
    
    revalidatePath("/dashboard/medicos");
    return actionSuccess(medic, "Médico atualizado com sucesso.");
  } catch (error: any) {
    if (error instanceof AppError) {
      return actionError(error.message, error.code);
    }
    return actionError("Erro ao atualizar médico. Verifique os dados e tente novamente.");
  }
}

export async function deleteMedicAction(id: string) {
  try {
    await deleteUseCase.execute(id);
    
    revalidatePath("/dashboard/medicos");
    return actionSuccess(null, "Médico excluído com sucesso.");
  } catch (error: any) {
    if (error instanceof AppError) {
      return actionError(error.message, error.code);
    }
    return actionError("Erro ao excluir médico. Pode haver consultas vinculadas.");
  }
}

export async function getMedicsAction() {
  try {
    const medics = await getUseCase.execute();
    return actionSuccess(medics);
  } catch (error: any) {
    return actionError("Erro ao buscar médicos.");
  }
}
