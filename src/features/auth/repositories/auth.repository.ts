import { prisma } from "@/lib/prisma";

export class AuthRepository {
  async findUserByEmail(email: string): Promise<{ id: string; email: string; password: string; name: string; role: "PATIENT" | "MEDIC" | "SECRETARY" } | null> {
    // Busca sequencial para identificar onde o e-mail existe
    
    // 1. Médicos
    const medic = await prisma.medic.findUnique({
      where: { email }
    });
    if (medic) return { ...medic, role: "MEDIC" };

    // 2. Secretárias
    const secretary = await prisma.secretary.findUnique({
      where: { email }
    });
    if (secretary) return { ...secretary, role: "SECRETARY" };

    // 3. Pacientes
    const patient = await prisma.patient.findUnique({
      where: { email }
    });
    if (patient) return { ...patient, role: "PATIENT" };

    return null;
  }
}
