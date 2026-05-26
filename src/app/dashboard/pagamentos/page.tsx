import { getPaymentsAction } from "@/features/payments/actions";
import { getPatientsAction } from "@/features/patients/actions";
import { PagamentosClient } from "@/features/payments/components/PagamentosClient";

export default async function PagamentosPage() {
  const [paymentsRes, patientsRes] = await Promise.all([
    getPaymentsAction(),
    getPatientsAction(),
  ]);

  const payments = paymentsRes.success ? paymentsRes.data : [];
  const patients = patientsRes.success ? patientsRes.data : [];

  return <PagamentosClient initialPayments={payments} patients={patients} />;
}
