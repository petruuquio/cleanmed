import { prisma } from "@/lib/prisma";
import { MedicFormValues, UpdateMedicFormValues } from "../schemas";

export class MedicRepository {
  async findAll() {
    return prisma.medic.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    return prisma.medic.findUnique({
      where: { id },
    });
  }

  async findByUniqueFields(email: string, document: string, crm: string) {
    return prisma.medic.findFirst({
      where: {
        OR: [
          { email },
          { document },
          { crm },
        ],
      },
    });
  }

  async findByUniqueFieldsExceptId(email: string, document: string, crm: string, excludeId: string) {
    return prisma.medic.findFirst({
      where: {
        OR: [
          { email },
          { document },
          { crm },
        ],
        NOT: {
          id: excludeId,
        },
      },
    });
  }

  async create(data: MedicFormValues) {
    return prisma.medic.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password, // Plain text per user request
        document: data.document,
        crm: data.crm,
        specialty: data.specialty,
        room: data.room,
      },
    });
  }

  async update(id: string, data: UpdateMedicFormValues) {
    const updateData: any = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      document: data.document,
      crm: data.crm,
      specialty: data.specialty,
      room: data.room,
    };

    if (data.password) {
      updateData.password = data.password;
    }

    return prisma.medic.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string) {
    return prisma.medic.delete({
      where: { id },
    });
  }
}
