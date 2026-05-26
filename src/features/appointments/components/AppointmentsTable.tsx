import * as React from "react";

interface AppointmentsTableProps {
  appointments: any[];
  onEdit?: (appointment: any) => void;
  onDelete?: (appointment: any) => void;
  onAccept?: (appointment: any) => void;
  onReject?: (appointment: any) => void;
}

import { Filter, ArrowUpDown, Edit2, Trash2, Search, CheckCircle2, XCircle } from "lucide-react";

export function AppointmentsTable({ appointments, onEdit, onDelete, onAccept, onReject }: AppointmentsTableProps) {

  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("Todos");
  const [patientFilter, setPatientFilter] = React.useState("Todos");
  const [medicFilter, setMedicFilter] = React.useState("Todos");

  const uniquePatients = Array.from(new Set(appointments.map(a => a.patient?.name).filter(Boolean))) as string[];
  const uniqueMedics = Array.from(new Set(appointments.map(a => a.medic?.name).filter(Boolean))) as string[];

  const filteredAppointments = appointments.filter((apt) => {
    const patientName = apt.patient?.name || "";
    const doctorName = apt.medic?.name || "";

    const matchesSearch =
      patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "Todos" || apt.status === statusFilter;

    const matchesPatient =
      patientFilter === "Todos" || patientName === patientFilter;

    const matchesMedic =
      medicFilter === "Todos" || doctorName === medicFilter;

    return matchesSearch && matchesStatus && matchesPatient && matchesMedic;
  });

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-[0_4px_20px_rgba(46,50,48,0.06)] border border-outline-variant/10 overflow-hidden mt-8">
      <div className="p-6 border-b border-outline-variant/10 flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-container-lowest/50">
        <h3 className="font-headline font-bold text-xl text-on-surface">
          Lista de Agendamentos
        </h3>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <select
            value={patientFilter}
            onChange={(e) => setPatientFilter(e.target.value)}
            className="bg-surface border border-outline-variant/30 py-2 px-3 rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary"
          >
            <option value="Todos">Todos os Pacientes</option>
            {uniquePatients.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <select
            value={medicFilter}
            onChange={(e) => setMedicFilter(e.target.value)}
            className="bg-surface border border-outline-variant/30 py-2 px-3 rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary"
          >
            <option value="Todos">Todos os Médicos</option>
            {uniqueMedics.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-surface border border-outline-variant/30 py-2 px-3 rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary"
          >
            <option value="Todos">Todos os Status</option>
            <option value="PENDING">Pendente</option>
            <option value="CONFIRMED">Confirmado</option>
            <option value="CANCELLED">Cancelado</option>
            <option value="COMPLETED">Concluído</option>
          </select>
          <div className="relative w-full sm:w-64">
            <Search size={18} className="absolute left-3 top-2.5 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface border border-outline-variant/30 py-2 pl-10 pr-4 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none"
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low/50 text-on-surface-variant text-sm border-b border-outline-variant/10">
              <th className="py-4 px-6 font-normal">Nome do Paciente</th>
              <th className="py-4 px-6 font-normal">Médico</th>
              <th className="py-4 px-6 font-normal">Data</th>
              <th className="py-4 px-6 font-normal">Horário</th>
              <th className="py-4 px-6 font-normal">Status</th>
              <th className="py-4 px-6 font-normal text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-outline-variant/10">
            {filteredAppointments.map((apt) => (
              <tr
                key={apt.id}
                className="hover:bg-surface-container-lowest/50 transition-colors"
              >
                <td className="py-4 px-6 flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold bg-primary-container text-primary-fixed`}
                  >
                    {apt.patient?.name ? apt.patient.name.charAt(0) : "?"}
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">{apt.patient?.name}</p>
                    <p className="text-xs text-on-surface-variant">
                      ID: {apt.id.split('-')[0]}...
                    </p>
                  </div>
                </td>
                <td className="py-4 px-6 text-on-surface">{apt.medic?.name}</td>
                <td className="py-4 px-6 text-on-surface">{new Date(apt.dateTime).toLocaleDateString()}</td>
                <td className="py-4 px-6 text-on-surface font-medium">
                  {new Date(apt.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${apt.status === "PENDING" ? "bg-secondary-container/30 text-secondary" :
                      apt.status === "PENDING" ? "bg-tertiary-container/20 text-tertiary" :
                        apt.status === "CONFIRMED" ? "bg-primary-container/20 text-primary" :
                          apt.status === "CANCELLED" ? "bg-error-container/20 text-error" :
                            "bg-secondary-container/20 text-secondary"
                      }`}
                  >
                    {apt.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right whitespace-nowrap">
                  {apt.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => onAccept && onAccept(apt)}
                        className="text-primary hover:text-primary/80 transition-colors p-1"
                        title="Aceitar"
                      >
                        <CheckCircle2 size={20} />
                      </button>
                      <button
                        onClick={() => onReject && onReject(apt)}
                        className="text-error hover:text-error/80 transition-colors p-1 ml-1"
                        title="Recusar"
                      >
                        <XCircle size={20} />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => onEdit && onEdit(apt)}
                    className="text-on-surface-variant hover:text-primary transition-colors p-1 ml-2"
                    title="Editar"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => onDelete && onDelete(apt)}
                    className="text-on-surface-variant hover:text-error transition-colors p-1 ml-1"
                    title="Excluir"
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-outline-variant/10 flex items-center justify-between text-sm text-on-surface-variant bg-surface-container-lowest"></div>
    </div>
  );
}
