"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { actionError, actionSuccess } from "@/lib/action-response";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function getLoggedPatientId() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role === "PATIENT") {
    return session.user.id;
  }
  return null;
}

export async function getPortalDashboardDataAction() {
  try {
    const patientId = await getLoggedPatientId();
    if (!patientId) {
      return actionError("Nenhum paciente logado encontrado.");
    }

    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        attachments: true,
        appointments: {
          orderBy: { dateTime: "asc" },
          include: {
            medic: true,
            payment: true,
          },
        },
      },
    });

    if (!patient) return actionError("Paciente não encontrado.");

    const serializedPatient = {
      ...patient,
      appointments: patient.appointments.map(apt => ({
        ...apt,
        payment: apt.payment ? {
          ...apt.payment,
          amount: Number(apt.payment.amount)
        } : null
      }))
    };

    return actionSuccess(serializedPatient);
  } catch (error) {
    console.error(error);
    return actionError("Erro ao carregar dados do portal.");
  }
}

export async function getAvailableMedicsAction() {
  try {
    const medics = await prisma.medic.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, specialty: true }
    });
    return actionSuccess(medics);
  } catch (error) {
    return actionError("Erro ao carregar médicos.");
  }
}

export async function bookPortalAppointmentAction(data: { specialty: string, medicId: string, dateTime: string }) {
  try {
    const patientId = await getLoggedPatientId();
    if (!patientId) return actionError("Sessão expirada.");

    const result = await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          patientId,
          amount: 250.0,
          status: "PENDING",
          method: "CREDIT_CARD",
        },
      });

      const appointment = await tx.appointment.create({
        data: {
          dateTime: new Date(data.dateTime),
          status: "PENDING",
          patientId: patientId,
          medicId: data.medicId,
          paymentId: payment.id,
        },
      });

      return {
        appointment,
        payment: {
          ...payment,
          amount: Number(payment.amount)
        }
      };
    });

    revalidatePath("/portal", "layout");
    revalidatePath("/dashboard/consultas");
    revalidatePath("/dashboard/agenda");
    return actionSuccess(result);
  } catch (error) {
    console.error(error);
    return actionError("Erro ao agendar consulta.");
  }
}

export async function payPortalAppointmentAction(paymentId: string, method: string) {
  try {
    const allowedMethods = ["CREDIT_CARD", "DEBIT_CARD", "PIX", "CASH", "HEALTH_INSURANCE"];
    const paymentMethod = allowedMethods.includes(method) ? method : "CREDIT_CARD";

    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "PAID",
        method: paymentMethod as any,
        paidAt: new Date(),
      },
    });

    await prisma.appointment.updateMany({
      where: { paymentId: paymentId },
      data: { status: "PENDING" }
    });

    revalidatePath("/portal", "layout");
    revalidatePath("/dashboard/consultas");
    revalidatePath("/dashboard/agenda");
    revalidatePath("/dashboard/pagamentos");
    return actionSuccess({
      ...payment,
      amount: Number(payment.amount)
    });
  } catch (error) {
    console.error(error);
    return actionError("Erro ao processar pagamento.");
  }
}
