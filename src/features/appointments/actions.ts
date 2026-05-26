"use server";

import { revalidatePath } from "next/cache";
import { appointmentSchema, AppointmentFormValues, updateAppointmentSchema, UpdateAppointmentFormValues } from "./schemas";
import { AppointmentRepository } from "./repositories/appointment.repository";
import { prisma } from "@/lib/prisma";
import { CreateAppointmentUseCase } from "./use-cases/create-appointment.use-case";
import { UpdateAppointmentUseCase } from "./use-cases/update-appointment.use-case";
import { DeleteAppointmentUseCase } from "./use-cases/delete-appointment.use-case";
import { GetAppointmentsUseCase } from "./use-cases/get-appointments.use-case";
import { AppError } from "@/lib/errors";
import { actionError, actionSuccess } from "@/lib/action-response";

const repository = new AppointmentRepository();
const createUseCase = new CreateAppointmentUseCase(repository);
const updateUseCase = new UpdateAppointmentUseCase(repository);
const deleteUseCase = new DeleteAppointmentUseCase(repository);
const getUseCase = new GetAppointmentsUseCase(repository);

export async function createAppointmentAction(data: AppointmentFormValues) {
  try {
    const validatedData = appointmentSchema.parse(data);
    const appointment = await createUseCase.execute(validatedData);
    
    revalidatePath("/dashboard/consultas");
    return actionSuccess(appointment, "Consulta agendada com sucesso.");
  } catch (error: any) {
    if (error instanceof AppError) {
      return actionError(error.message, error.code);
    }
    return actionError("Erro ao agendar consulta.");
  }
}

export async function updateAppointmentAction(id: string, data: UpdateAppointmentFormValues) {
  try {
    const validatedData = updateAppointmentSchema.parse(data);
    const appointment = await updateUseCase.execute(id, validatedData);
    
    revalidatePath("/dashboard/consultas");
    return actionSuccess(appointment, "Consulta atualizada com sucesso.");
  } catch (error: any) {
    if (error instanceof AppError) {
      return actionError(error.message, error.code);
    }
    return actionError("Erro ao atualizar consulta.");
  }
}

export async function deleteAppointmentAction(id: string) {
  try {
    await deleteUseCase.execute(id);
    
    revalidatePath("/dashboard/consultas");
    return actionSuccess(null, "Consulta cancelada/excluída com sucesso.");
  } catch (error: any) {
    if (error instanceof AppError) {
      return actionError(error.message, error.code);
    }
    return actionError("Erro ao excluir consulta.");
  }
}

export async function updateAppointmentStatusAction(id: string, status: any) {
  try {
    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status }
    });
    
    revalidatePath("/dashboard/consultas");
    revalidatePath("/dashboard/agenda");
    return actionSuccess(appointment, `Status atualizado para ${status}`);
  } catch (error: any) {
    return actionError("Erro ao atualizar status da consulta.");
  }
}

export async function getAppointmentsAction() {
  try {
    const appointments = await getUseCase.execute();
    return actionSuccess(appointments);
  } catch (error: any) {
    return actionError("Erro ao buscar consultas.");
  }
}
