import * as React from "react";
import { Edit2, Trash2, Search } from "lucide-react";

interface PaymentsTableProps {
  payments: any[];
  onEdit?: (payment: any) => void;
  onDelete?: (payment: any) => void;
}

export function PaymentsTable({ payments, onEdit, onDelete }: PaymentsTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("Todos");
  const [patientFilter, setPatientFilter] = React.useState("Todos");
  const [methodFilter, setMethodFilter] = React.useState("Todos");

  const uniquePatients = Array.from(new Set(payments.map(p => p.patient?.name).filter(Boolean))) as string[];
  const uniqueMethods = Array.from(new Set(payments.map(p => p.method).filter(Boolean))) as string[];

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.patient?.name && payment.patient.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus =
      statusFilter === "Todos" || payment.status === statusFilter;
      
    const matchesPatient =
      patientFilter === "Todos" || payment.patient?.name === patientFilter;
      
    const matchesMethod =
      methodFilter === "Todos" || payment.method === methodFilter;
      
    return matchesSearch && matchesStatus && matchesPatient && matchesMethod;
  });

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-[0_4px_20px_rgba(46,50,48,0.06)] border border-outline-variant/10 overflow-hidden mt-8">
      <div className="p-6 border-b border-outline-variant/10 flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-container-lowest/50">
        <h3 className="font-headline font-bold text-xl text-on-surface">
          Transações Recentes
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
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="bg-surface border border-outline-variant/30 py-2 px-3 rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary"
          >
            <option value="Todos">Todos os Métodos</option>
            {uniqueMethods.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-surface border border-outline-variant/30 py-2 px-3 rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary"
          >
            <option value="Todos">Todos os Status</option>
            <option value="PAID">Pago</option>
            <option value="PENDING">Pendente</option>
            <option value="REFUNDED">Estornado</option>
            <option value="FAILED">Falhou</option>
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
              <th className="py-4 px-6 font-normal">Paciente</th>
              <th className="py-4 px-6 font-normal">Valor</th>
              <th className="py-4 px-6 font-normal">Método</th>
              <th className="py-4 px-6 font-normal">Status</th>
              <th className="py-4 px-6 font-normal text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-outline-variant/10">
            {filteredPayments.map((payment) => (
              <tr
                key={payment.id}
                className="hover:bg-surface-container-lowest/50 transition-colors"
              >
                <td className="py-4 px-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold bg-primary-container text-primary-fixed">
                    {payment.patient?.name ? payment.patient.name.charAt(0).toUpperCase() : "-"}
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">{payment.patient?.name || "-"}</p>
                    <p className="text-xs text-on-surface-variant">
                      ID: {payment.id.split('-')[0]}...
                    </p>
                  </div>
                </td>
                <td className="py-4 px-6 text-on-surface">R$ {Number(payment.amount).toFixed(2)}</td>
                <td className="py-4 px-6 text-on-surface">{payment.method}</td>
                <td className="py-4 px-6">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${payment.status === "PAID"
                      ? "bg-primary-container/20 text-primary"
                      : "bg-tertiary-container/20 text-tertiary"
                      }`}
                  >
                    {payment.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button
                    onClick={() => onEdit && onEdit(payment)}
                    className="text-on-surface-variant hover:text-primary transition-colors p-1"
                    title="Editar"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => onDelete && onDelete(payment)}
                    className="text-on-surface-variant hover:text-error transition-colors p-1 ml-2"
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
