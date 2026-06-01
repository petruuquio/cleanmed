"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Plus, CalendarDays, Clock, Receipt, Paperclip, Download, Hospital, Activity, Heart, Pill, Weight, ChevronLeft, ChevronRight, CalendarOff, LogOut } from "lucide-react";
import { PortalBookingModal } from "./PortalBookingModal";
import { signOut } from "next-auth/react";
import { PortalPaymentModal } from "./PortalPaymentModal";
import { Button } from "@/components/ui/Button";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { bookPortalAppointmentAction, payPortalAppointmentAction } from "../actions";

interface PortalClientProps {
  patient: any;
  medics: any[];
}

export function PortalClient({ patient, medics }: PortalClientProps) {
  const [isBookingOpen, setIsBookingOpen] = React.useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = React.useState(false);
  const [pendingBookingData, setPendingBookingData] = React.useState<any>(null);

  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  // Deriving lists from patient data
  const appointments = patient.appointments || [];
  const upcomingAppointments = appointments.filter((a: any) => ["CONFIRMED", "PENDING"].includes(a.status));
  const historyAppointments = appointments.filter((a: any) => ["COMPLETED", "CANCELLED"].includes(a.status));
  const payments = appointments.map((a: any) => a.payment).filter(Boolean);
  const attachments = patient.attachments || [];

  const handleProceedToPayment = async (data: any) => {
    setIsBookingOpen(false);

    try {
      const res = await bookPortalAppointmentAction({
        specialty: data.specialty,
        medicId: data.medicId,
        dateTime: data.dateTime,
      });

      if (res.success) {
        setPendingBookingData({
          ...data,
          paymentId: res.data.payment.id,
        });

        // Abre o pagamento após transição
        setTimeout(() => {
          setIsPaymentOpen(true);
        }, 300);
      } else {
        alert(res.error?.message || "Erro ao agendar consulta");
      }
    } catch (error) {
      alert("Erro ao processar");
    }
  };

  const handlePaymentSuccess = async (method: string) => {
    try {
      if (pendingBookingData?.paymentId) {
        const res = await payPortalAppointmentAction(pendingBookingData.paymentId, method);
        if (!res.success) {
          alert(res.error?.message || "Erro ao atualizar pagamento");
        }
      }
    } catch (e) {
      console.error(e);
    }
    setIsPaymentOpen(false);
  };

  return (
    <div className="bg-background min-h-screen font-body flex flex-col">
      <header className="sticky top-0 z-40 w-full bg-on-primary-fixed text-primary-fixed shadow-xl transition-all duration-300 ease-in-out">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Hospital size={32} className="text-surface-container-lowest" />
            <div className="hidden sm:block">
              <h1 className="font-headline font-bold text-2xl text-surface-container-lowest tracking-tight leading-none">
                CleanMed
              </h1>
              <p className="text-xs text-primary-fixed-dim/80 mt-1">
                Portal do Paciente
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Button onClick={() => setIsBookingOpen(true)} className="shadow-sm h-10 px-4 bg-surface-container-lowest text-on-primary-fixed hover:bg-surface-container-lowest/90 border-transparent">
              <Plus size={18} className="mr-2" />
              Nova Consulta
            </Button>
            <div className="flex items-center gap-3 border-l border-primary-fixed-dim/20 pl-6">
              <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                {patient.avatarUrl ? (
                  <img src={patient.avatarUrl} alt={patient.name} className="w-10 h-10 rounded-full object-cover ring-1 ring-surface-bright/30 shadow-sm" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/20 text-surface-bright flex items-center justify-center font-bold text-sm ring-1 ring-surface-bright/30 uppercase">
                    {patient.name.substring(0, 2)}
                  </div>
                )}
                <div className="hidden md:block text-left">
                  <p className="text-sm font-bold text-surface-bright leading-tight">{patient.name}</p>
                  <p className="text-xs text-surface-variant/70 leading-tight">Minha Conta</p>
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="cursor-pointer ml-4 p-2 text-surface-container-lowest/80 hover:text-surface-lowest hover:bg-error/20 transition-colors duration-200 rounded-full"
                title="Sair"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full p-4 sm:p-8 grid grid-cols-1 xl:grid-cols-3 gap-8 flex-1">

        <div className="xl:col-span-2 space-y-6">
          <div className="bg-[#FAF9F6] dark:bg-surface-container-lowest rounded-[32px] p-6 sm:p-8 shadow-sm border border-outline-variant/20 flex flex-col gap-8">

            <div className="flex-1">
              <h2 className="mb-6 text-2xl font-headline font-bold text-on-surface leading-tight text-[#1E3A34] dark:text-on-surface">
                Meus Agendamentos
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2 md:mb-0">
                {upcomingAppointments.length === 0 ? (
                  <div className="col-span-1 sm:col-span-2 flex flex-col items-center justify-center p-8 bg-surface-container-lowest/50 border border-outline-variant/30 border-dashed rounded-[20px] text-center">
                    <div className="w-12 h-12 rounded-full bg-primary-container/30 flex items-center justify-center mb-4 text-primary ring-4 ring-primary-container/10">
                      <CalendarOff size={24} />
                    </div>
                    <h3 className="font-headline font-bold text-lg text-on-surface mb-2">Nenhuma consulta agendada</h3>
                    <p className="text-sm text-on-surface-variant max-w-sm">Você não possui consultas programadas para os próximos dias. Agende uma nova consulta para manter sua saúde em dia.</p>
                  </div>
                ) : upcomingAppointments.map((apt: any, index: number) => {
                  const isFirst = index === 0;
                  const dateObj = new Date(apt.dateTime);

                  if (isFirst) {
                    const isPending = apt.status === "PENDING";
                    const accentClass = isPending ? "bg-tertiary" : "bg-primary";
                    return (
                      <div key={apt.id} className="relative bg-[#F3EFE9] dark:bg-surface-container-low rounded-[20px] p-5 overflow-hidden shadow-sm">
                        <div className={`absolute left-0 top-0 bottom-0 w-2 ${accentClass}`}></div>
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-bold font-headline text-xl text-[#1E3A34] dark:text-on-surface">{apt.medic.specialty}</h3>
                          <span className={`inline-block font-bold text-xs px-2.5 py-1 rounded-md ${isPending ? 'bg-tertiary-container/30 text-tertiary' : 'bg-[#E5E9E4] text-[#4F6C65]'}`}>{apt.status === "PENDING" ? "Pendente" : "Confirmada"}</span>
                        </div>
                        <p className="text-on-surface-variant text-sm mb-4">{apt.medic.name}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-[#4F6C65] dark:text-on-surface-variant font-medium">
                          <span className="flex items-center gap-1.5"><CalendarDays size={16} /> {format(dateObj, "dd MMM", { locale: ptBR })}</span>
                          <span className="flex items-center gap-1.5"><Clock size={16} /> {format(dateObj, "HH:mm")}</span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={apt.id} className="bg-transparent border border-outline-variant/40 rounded-[20px] p-5 hover:bg-surface-container-lowest transition-colors cursor-pointer">
                      <h3 className="font-bold font-headline text-xl text-[#1E3A34] dark:text-on-surface mt-1">{apt.medic.specialty}</h3>
                      <p className="text-on-surface-variant text-sm mb-4">{apt.medic.name}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-[#4F6C65] dark:text-on-surface-variant font-medium">
                        <span className="flex items-center gap-1.5"><CalendarDays size={16} /> {format(dateObj, "dd MMM", { locale: ptBR })}</span>
                        <span className="flex items-center gap-1.5"><Clock size={16} /> {format(dateObj, "HH:mm")}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="w-full border-t border-outline-variant/20 pt-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-[#1E3A34] dark:text-on-surface text-base capitalize">
                  {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
                </h3>
                <div className="flex gap-2">
                  <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="w-8 h-8 flex items-center justify-center rounded-full bg-transparent hover:bg-outline-variant/10 text-on-surface-variant hover:text-on-surface transition-colors"><ChevronLeft size={18} /></button>
                  <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="w-8 h-8 flex items-center justify-center rounded-full bg-transparent hover:bg-outline-variant/10 text-on-surface-variant hover:text-on-surface transition-colors"><ChevronRight size={18} /></button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-y-4 text-center text-sm">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                  <div key={`header-${i}`} className="font-bold text-[#4F6C65] text-xs">{d}</div>
                ))}

                {calendarDays.map((day, i) => {
                  const isCurrentMonth = isSameMonth(day, monthStart);
                  const isToday = isSameDay(day, new Date());
                  const dayApts = upcomingAppointments.filter((a: any) => isSameDay(new Date(a.dateTime), day));
                  const hasApt = dayApts.length > 0;

                  if (!isCurrentMonth) {
                    return (
                      <div key={`day-${i}`} className="text-outline-variant/50 py-1">
                        {format(day, "d")}
                      </div>
                    );
                  }

                  if (hasApt) {
                    const isPending = dayApts.some((a: any) => a.status === "PENDING");
                    const dotColor = isPending ? "bg-tertiary" : "bg-primary";
                    return (
                      <div key={`day-${i}`} className="relative bg-transparent text-[#4F6C65] dark:text-on-surface rounded-full py-1 font-bold mx-auto w-8 h-8 flex items-center justify-center">
                        {format(day, "d")}
                        <div className={`absolute -bottom-1 w-1.5 h-1.5 rounded-full ${dotColor}`}></div>
                      </div>
                    );
                  }

                  if (isToday) {
                    return (
                      <div key={`day-${i}`} className="bg-[#4F6C65] text-white rounded-full py-1 font-bold mx-auto w-8 h-8 flex items-center justify-center relative shadow-md">
                        {format(day, "d")}
                      </div>
                    );
                  }

                  return (
                    <div key={`day-${i}`} className="text-[#4F6C65] dark:text-on-surface py-1 font-medium hover:bg-outline-variant/10 rounded-full cursor-pointer transition-colors">
                      {format(day, "d")}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          <div className="pt-6">
            <h2 className="text-xl font-headline font-bold text-on-surface flex items-center gap-2 mb-4">
              <Activity className="text-primary" size={24} />
              Resumo de Saúde
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="bg-surface-container-lowest border border-outline-variant/20 shadow-sm">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <Heart size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">Tipo Sanguíneo</p>
                    <p className="text-lg font-headline font-bold text-primary">Não Informado</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-surface-container-lowest border border-outline-variant/20 shadow-sm">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center">
                    <Activity size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">Alergias</p>
                    <p className="text-sm text-on-surface-variant">Nenhuma registrada</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-surface-container-lowest border border-outline-variant/20 shadow-sm">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
                    <Pill size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">Uso Contínuo</p>
                    <p className="text-sm text-on-surface-variant">Nenhum registrado</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-surface-container-lowest border border-outline-variant/20 shadow-sm">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
                    <Weight size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">Peso / Altura</p>
                    <p className="text-sm text-on-surface-variant">-- / --</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="space-y-8">

          <div className="space-y-4">
            <h2 className="text-lg font-headline font-bold text-on-surface flex items-center gap-2">
              <Clock className="text-primary" size={20} />
              Consultas Anteriores
            </h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-outline-variant/20">
                  {historyAppointments.length === 0 ? (
                    <p className="p-4 text-sm text-on-surface-variant">Nenhum histórico encontrado.</p>
                  ) : historyAppointments.map((hist: any) => (
                    <div key={hist.id} className="p-4 hover:bg-surface-container-lowest/50 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-on-surface text-sm">{hist.medic.specialty}</span>
                        <span className="text-xs font-bold text-primary bg-primary-container/20 px-2 py-0.5 rounded border border-primary-container/30">{hist.status}</span>
                      </div>
                      <p className="text-sm text-on-surface-variant">{hist.medic.name}</p>
                      <p className="text-xs text-on-surface-variant/70 mt-1">{new Date(hist.dateTime).toLocaleDateString('pt-BR')}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-headline font-bold text-on-surface flex items-center gap-2">
              <Receipt className="text-primary" size={20} />
              Pagamentos
            </h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-outline-variant/20">
                  {payments.length === 0 ? (
                    <p className="p-4 text-sm text-on-surface-variant">Nenhum pagamento encontrado.</p>
                  ) : payments.map((pay: any) => (
                    <div key={pay.id} className="p-4 hover:bg-surface-container-lowest/50 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-on-surface text-sm">R$ {Number(pay.amount).toFixed(2)}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded border ${pay.status === 'PAID' ? 'text-primary bg-primary/10 border-primary/20' : 'text-tertiary bg-tertiary/10 border-tertiary/20'}`}>
                          {pay.status}
                        </span>
                      </div>
                      <p className="text-sm text-on-surface-variant flex items-center gap-1.5 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
                        {pay.method}
                      </p>
                      <p className="text-xs text-on-surface-variant/70 mt-1">{pay.paidAt ? new Date(pay.paidAt).toLocaleDateString('pt-BR') : '-'}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-headline font-bold text-on-surface flex items-center gap-2">
              <Paperclip className="text-primary" size={20} />
              Anexos e Exames
            </h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-outline-variant/20">
                  {attachments.length === 0 ? (
                    <p className="p-4 text-sm text-on-surface-variant">Nenhum anexo encontrado.</p>
                  ) : attachments.map((att: any) => (
                    <div key={att.id} className="p-4 hover:bg-surface-container-lowest/50 transition-colors group cursor-pointer flex justify-between items-center">
                      <div>
                        <span className="font-bold text-on-surface text-sm block group-hover:text-primary transition-colors">{att.title}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-on-surface-variant/70">{new Date(att.createdAt).toLocaleDateString('pt-BR')}</p>
                          <span className="text-xs text-on-surface-variant/40">•</span>
                          <p className="text-xs text-on-surface-variant/70">{att.type}</p>
                        </div>
                      </div>
                      <Button variant="ghost" className="w-8 h-8 p-0 rounded-full text-on-surface-variant group-hover:text-primary group-hover:bg-primary/10">
                        <Download size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

        </div>

      </main>

      <PortalBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        medics={medics}
        onProceedToPayment={handleProceedToPayment}
      />

      <PortalPaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        bookingData={pendingBookingData}
        onSuccess={handlePaymentSuccess}
      />

    </div>
  );
}
