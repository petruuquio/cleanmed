"use client";

import * as React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Stethoscope, User, CalendarClock, ArrowRight } from "lucide-react";

interface BookingData {
  specialty: string;
  medicId: string;
  dateTime: string;
}

interface PortalBookingModalProps {
  isOpen: boolean;
  medics: any[];
  onClose: () => void;
  onProceedToPayment: (data: BookingData) => void;
}

export function PortalBookingModal({ isOpen, medics, onClose, onProceedToPayment }: PortalBookingModalProps) {
  const [specialty, setSpecialty] = React.useState("");
  const [medicId, setMedicId] = React.useState("");
  const [dateTime, setDateTime] = React.useState("");

  // Reset state when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setSpecialty("");
      setMedicId("");
      setDateTime("");
    }
  }, [isOpen]);

  // When specialty changes, reset medic
  React.useEffect(() => {
    setMedicId("");
  }, [specialty]);

  const availableSpecialties = Array.from(new Set(medics.map(m => m.specialty)));
  const availableMedics = specialty ? medics.filter(m => m.specialty === specialty) : [];

  const handleProceed = () => {
    if (specialty && medicId && dateTime) {
      onProceedToPayment({ specialty, medicId, dateTime });
    }
  };

  const isFormValid = specialty !== "" && medicId !== "" && dateTime !== "";

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Nova Consulta"
      description="Siga os passos abaixo para agendar seu atendimento."
    >
      <div className="flex flex-col gap-6">
        
        {/* Step 1: Specialty */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-on-surface ml-1">1. Qual a especialidade desejada?</label>
          <Select 
            icon={<Stethoscope size={18} />} 
            value={specialty} 
            onChange={(e) => setSpecialty(e.target.value)}
          >
            <option value="">Selecione a especialidade...</option>
            {availableSpecialties.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </Select>
        </div>

        {/* Step 2: Medic */}
        <div className="flex flex-col gap-1.5">
          <label className={`text-sm font-bold ml-1 ${!specialty ? 'text-on-surface-variant/50' : 'text-on-surface'}`}>
            2. Escolha o Médico
          </label>
          <Select 
            icon={<User size={18} />} 
            value={medicId} 
            onChange={(e) => setMedicId(e.target.value)}
            disabled={!specialty}
          >
            <option value="">
              {!specialty ? "Selecione uma especialidade primeiro..." : "Selecione o médico..."}
            </option>
            {availableMedics?.map(medic => (
              <option key={medic.id} value={medic.id}>{medic.name}</option>
            ))}
          </Select>
        </div>

        {/* Step 3: Date and Time */}
        <div className="flex flex-col gap-1.5">
          <label className={`text-sm font-bold ml-1 ${!medicId ? 'text-on-surface-variant/50' : 'text-on-surface'}`}>
            3. Data e Horário
          </label>
          <Input 
            type="datetime-local" 
            icon={<CalendarClock size={18} />} 
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            disabled={!medicId}
          />
        </div>

        <div className="mt-4 flex justify-end">
          <Button 
            disabled={!isFormValid} 
            onClick={handleProceed} 
            className="w-full sm:w-auto px-8 group"
          >
            Avançar para Pagamento
            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

      </div>
    </Modal>
  );
}
