import { prisma } from "@/lib/prisma";
import { PatientFormValues, UpdatePatientFormValues } from "../schemas";

export class PatientRepository {
  async findAll() {
    return prisma.patient.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    return prisma.patient.findUnique({
      where: { id },
    });
  }

  async findByEmailOrDocument(email: string, document: string) {
    return prisma.patient.findFirst({
      where: {
        OR: [
          { email },
          { document },
        ],
      },
    });
  }

  async findByEmailOrDocumentExceptId(email: string, document: string, excludeId: string) {
    return prisma.patient.findFirst({
      where: {
        OR: [
          { email },
          { document },
        ],
        NOT: {
          id: excludeId,
        },
      },
    });
  }

  async create(data: PatientFormValues) {
    return prisma.patient.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password, // User requested plain text
        document: data.document,
        address: data.address,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
      },
    });
  }

  async update(id: string, data: UpdatePatientFormValues) {
    const updateData: any = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      document: data.document,
      address: data.address,
      birthDate: data.birthDate ? new Date(data.birthDate) : null,
    };

    if (data.password) {
      updateData.password = data.password;
    }

    return prisma.patient.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string) {
    return prisma.patient.delete({
      where: { id },
    });
  }
}
