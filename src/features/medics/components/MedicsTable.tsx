import * as React from "react";
import { Edit2, Trash2, Search } from "lucide-react";

interface MedicsTableProps {
  medics: any[];
  onEdit?: (medic: any) => void;
  onDelete?: (medic: any) => void;
}

export function MedicsTable({ medics, onEdit, onDelete }: MedicsTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("Todos");
  const [specialtyFilter, setSpecialtyFilter] = React.useState("Todas");

  const uniqueSpecialties = Array.from(new Set(medics.map(m => m.specialty).filter(Boolean))) as string[];

  const filteredMedics = medics.filter((medic) => {
    const matchesSearch =
      medic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medic.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medic.crm.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "Todos" || medic.status === statusFilter;

    const matchesSpecialty =
      specialtyFilter === "Todas" || medic.specialty === specialtyFilter;

    return matchesSearch && matchesStatus && matchesSpecialty;
  });

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-[0_4px_20px_rgba(46,50,48,0.06)] border border-outline-variant/10 overflow-hidden mt-8">
      <div className="p-6 border-b border-outline-variant/10 flex flex-col sm:flex-row justify-between items-center gap-4 bg-surface-container-lowest/50">
        <h3 className="font-headline font-bold text-xl text-on-surface">
          Corpo Clínico
        </h3>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <select
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
            className="bg-surface border border-outline-variant/30 py-2 px-3 rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary"
          >
            <option value="Todas">Todas as Especialidades</option>
            {uniqueSpecialties.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-surface border border-outline-variant/30 py-2 px-3 rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary"
          >
            <option value="Todos">Todos os Status</option>
            <option value="ACTIVE">Ativo</option>
            <option value="INACTIVE">Inativo</option>
            <option value="VACATION">Férias</option>
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
              <th className="py-4 px-6 font-normal">Nome do Médico</th>
              <th className="py-4 px-6 font-normal">Especialidade</th>
              <th className="py-4 px-6 font-normal">CRM</th>
              <th className="py-4 px-6 font-normal">Sala</th>
              <th className="py-4 px-6 font-normal">Status</th>
              <th className="py-4 px-6 font-normal text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-outline-variant/10">
            {filteredMedics.map((medic) => (
              <tr
                key={medic.id}
                className="hover:bg-surface-container-lowest/50 transition-colors"
              >
                <td className="py-4 px-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold bg-primary-container text-primary-fixed">
                    {medic.name ? medic.name.replace('Dr. ', '').replace('Dra. ', '').charAt(0).toUpperCase() : "-"}
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">{medic.name}</p>
                    <p className="text-xs text-on-surface-variant">
                      ID: {medic.id.split('-')[0]}...
                    </p>
                  </div>
                </td>
                <td className="py-4 px-6 text-on-surface">{medic.specialty}</td>
                <td className="py-4 px-6 text-on-surface-variant">{medic.crm}</td>
                <td className="py-4 px-6 text-on-surface-variant">{medic.room}</td>
                <td className="py-4 px-6">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-container/20 text-primary`}
                  >
                    Ativo
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <button
                    onClick={() => onEdit && onEdit(medic)}
                    className="text-on-surface-variant hover:text-primary transition-colors p-1"
                    title="Editar"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => onDelete && onDelete(medic)}
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
