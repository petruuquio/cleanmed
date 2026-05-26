import { getPortalDashboardDataAction, getAvailableMedicsAction } from "@/features/portal/actions";
import { PortalClient } from "@/features/portal/components/PortalClient";

export const dynamic = "force-dynamic";

export default async function PortalPacientePage() {
  const [dashboardRes, medicsRes] = await Promise.all([
    getPortalDashboardDataAction(),
    getAvailableMedicsAction()
  ]);

  const patient = dashboardRes.success ? dashboardRes.data : null;
  const medics = medicsRes.success ? medicsRes.data : [];

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <h1 className="text-2xl font-bold text-on-surface mb-2">Sessão Expirada</h1>
        <p className="text-on-surface-variant">Não foi possível carregar os dados do paciente.</p>
      </div>
    );
  }

  return <PortalClient patient={patient} medics={medics} />;
}
