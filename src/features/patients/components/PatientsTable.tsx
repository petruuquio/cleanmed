import * as React from "react";
import { Search, Edit2, Trash2, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import Link from "next/link";

interface PatientsTableProps {
  patients: any[];
  onEdit?: (patient: any) => void;
  onDelete?: (patient: any) => void;
}

export function PatientsTable({ patients, onEdit, onDelete }: PatientsTableProps) {

  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("Todos");

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "Todos" || patient.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-[0_4px_20px_rgba(46,50,48,0.06)] border border-outline-variant/10 overflow-hidden">
      <div className="p-6 border-b border-outline-variant/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest/50">
        <h2 className="font-headline text-xl font-bold text-on-surface">
          Todos os Pacientes
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-surface border border-outline-variant/30 py-2 px-3 rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary"
          >
            <option value="Todos">Todos os Status</option>
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
            <option value="Em Análise">Em Análise</option>
          </select>
          <div className="relative w-full sm:w-64">
            <Search
              size={18}
              className="absolute left-3 top-2.5 text-on-surface-variant"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar na lista..."
              className="w-full bg-surface border border-outline-variant/30 py-2 pl-10 pr-4 rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-surface-container-low/50 text-on-surface-variant text-xs uppercase tracking-wider font-semibold border-b border-outline-variant/10">
              <th className="p-4 pl-6 font-body">PACIENTE</th>
              <th className="p-4 font-body">CPF</th>
              <th className="p-4 font-body">DATA DE NASCIMENTO</th>
              <th className="p-4 font-body">TELEFONE</th>
              <th className="p-4 font-body">EMAIL</th>
              <th className="p-4 font-body">STATUS</th>
              <th className="p-4 pr-6 text-right font-body">AÇÕES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10 text-sm font-body">
            {filteredPatients.map((patient) => (
              <tr
                key={patient.id}
                className="hover:bg-surface-container-low/30 transition-colors group"
              >
                <td className="p-4 pl-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-outline-variant/20 bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {patient.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-on-surface">
                        {patient.name}
                      </div>
                      <div className="text-xs text-on-surface-variant">
                        ID: {patient.id.split('-')[0]}...
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-on-surface-variant">{patient.document}</td>
                <td className="p-4 text-on-surface-variant">{patient.birthDate ? new Date(patient.birthDate).toLocaleDateString('pt-BR') : "-"}</td>
                <td className="p-4 text-on-surface-variant">{patient.phone}</td>
                <td className="p-4 text-on-surface-variant">{patient.email}</td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-primary-container/30 text-primary-fixed-dim border-primary-container/50`}
                  >
                    Ativo
                  </span>
                </td>
                <td className="p-4 pr-6 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      href={`/dashboard/pacientes/${encodeURIComponent(patient.id)}`}
                      className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title="Visualizar"
                    >
                      <Eye size={16} />
                    </Link>
                    <button
                      onClick={() => onEdit && onEdit(patient)}
                      className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete && onDelete(patient)}
                      className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
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
