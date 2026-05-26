import * as React from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  onConfirm: () => void;
  isLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmModal({
  isOpen,
  onClose,
  title,
  description,
  onConfirm,
  isLoading = false,
  confirmText = "Excluir",
  cancelText = "Cancelar",
}: ConfirmModalProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className={cn(
          "relative bg-surface-container-lowest rounded-3xl shadow-2xl w-full max-w-md flex flex-col p-6 sm:p-8",
          "animate-in fade-in zoom-in-95 duration-200"
        )}
      >
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mb-6">
            <AlertTriangle className="text-error" size={32} strokeWidth={2} />
          </div>
          
          <h2 className="text-2xl font-headline font-bold text-on-surface mb-2">{title}</h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            {description}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8 w-full">
          <Button 
            variant="ghost" 
            onClick={onClose} 
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-2.5 font-bold text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
          >
            {cancelText}
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-2.5 shadow-md shadow-error/20"
          >
            {isLoading ? "Aguarde..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
