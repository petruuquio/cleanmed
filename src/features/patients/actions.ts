"use server";

import { revalidatePath } from "next/cache";
import { patientSchema, PatientFormValues, updatePatientSchema, UpdatePatientFormValues } from "./schemas";
import { PatientRepository } from "./repositories/patient.repository";
import { CreatePatientUseCase } from "./use-cases/create-patient.use-case";
import { UpdatePatientUseCase } from "./use-cases/update-patient.use-case";
import { DeletePatientUseCase } from "./use-cases/delete-patient.use-case";
import { GetPatientsUseCase } from "./use-cases/get-patients.use-case";
import { AppError } from "@/lib/errors";
import { actionError, actionSuccess } from "@/lib/action-response";

const repository = new PatientRepository();
const createUseCase = new CreatePatientUseCase(repository);
const updateUseCase = new UpdatePatientUseCase(repository);
const deleteUseCase = new DeletePatientUseCase(repository);
const getUseCase = new GetPatientsUseCase(repository);

export async function createPatientAction(data: PatientFormValues) {
  try {
    const validatedData = patientSchema.parse(data);
    const patient = await createUseCase.execute(validatedData);
    
    revalidatePath("/dashboard/pacientes");
    return actionSuccess(patient, "Paciente cadastrado com sucesso.");
  } catch (error: any) {
    if (error instanceof AppError) {
      return actionError(error.message, error.code);
    }
    return actionError("Erro ao criar paciente. Verifique os dados e tente novamente.");
  }
}

export async function updatePatientAction(id: string, data: UpdatePatientFormValues) {
  try {
    const validatedData = updatePatientSchema.parse(data);
    const patient = await updateUseCase.execute(id, validatedData);
    
    revalidatePath("/dashboard/pacientes");
    return actionSuccess(patient, "Paciente atualizado com sucesso.");
  } catch (error: any) {
    if (error instanceof AppError) {
      return actionError(error.message, error.code);
    }
    return actionError("Erro ao atualizar paciente. Verifique os dados e tente novamente.");
  }
}

export async function deletePatientAction(id: string) {
  try {
    await deleteUseCase.execute(id);
    
    revalidatePath("/dashboard/pacientes");
    return actionSuccess(null, "Paciente excluído com sucesso.");
  } catch (error: any) {
    if (error instanceof AppError) {
      return actionError(error.message, error.code);
    }
    return actionError("Erro ao excluir paciente. Pode haver consultas vinculadas.");
  }
}

export async function getPatientsAction() {
  try {
    const patients = await getUseCase.execute();
    return actionSuccess(patients);
  } catch (error: any) {
    return actionError("Erro ao buscar pacientes.");
  }
}
