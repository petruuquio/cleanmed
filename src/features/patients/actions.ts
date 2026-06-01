"use server";

import { prisma } from "@/lib/prisma";

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

export async function getPatientDetailsAction(id: string) {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        appointments: {
          orderBy: { dateTime: "desc" },
          include: {
            medic: true,
          }
        },
        attachments: {
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!patient) {
      return actionError("Paciente não encontrado.");
    }

    return actionSuccess(patient);
  } catch (error: any) {
    return actionError("Erro ao carregar os detalhes do paciente.");
  }
}

export async function uploadPatientPhotoAction(id: string, base64: string) {
  try {
    const patient = await prisma.patient.update({
      where: { id },
      data: { avatarUrl: base64 }
    });
    
    revalidatePath(`/dashboard/pacientes/${id}`);
    return actionSuccess(patient, "Foto atualizada com sucesso.");
  } catch (error: any) {
    return actionError("Erro ao atualizar a foto de perfil.");
  }
}

export async function uploadPatientAttachmentAction(data: { patientId: string, title: string, fileData: string, type?: any }) {
  try {
    const attachment = await prisma.attachment.create({
      data: {
        title: data.title,
        content: data.fileData,
        type: data.type || "OTHER",
        patientId: data.patientId
      }
    });
    
    revalidatePath(`/dashboard/pacientes/${data.patientId}`);
    return actionSuccess(attachment, "Arquivo enviado com sucesso.");
  } catch (error: any) {
    return actionError("Erro ao enviar o arquivo.");
  }
}
