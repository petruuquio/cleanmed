/*
  Warnings:

  - The values [SCHEDULED] on the enum `AppointmentStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `patientId` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AppointmentStatus_new" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');
ALTER TABLE "public"."appointments" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "appointments" ALTER COLUMN "status" TYPE "AppointmentStatus_new" USING ("status"::text::"AppointmentStatus_new");
ALTER TYPE "AppointmentStatus" RENAME TO "AppointmentStatus_old";
ALTER TYPE "AppointmentStatus_new" RENAME TO "AppointmentStatus";
DROP TYPE "public"."AppointmentStatus_old";
ALTER TABLE "appointments" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "appointments" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "patientId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
