import React from 'react';
import { Input } from '../../shared/Input';
import { FileText } from 'lucide-react';

interface ServiceNotesInputProps {
  notes: string;
  setNotes: (v: string) => void;
}

export const ServiceNotesInput: React.FC<ServiceNotesInputProps> = ({
  notes,
  setNotes,
}) => (
  <div className="space-y-1">
    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
      <FileText className="w-3.5 h-3.5 text-indigo-400" />
      <span>Notas del Servicio (Opcional)</span>
    </div>
    <Input
      placeholder="Ej: Código de vestimenta, reunión previa..."
      value={notes}
      onChange={(e) => setNotes(e.target.value)}
    />
  </div>
);
