import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  confirmButtonText: string;
  cancelButtonText?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText,
  cancelButtonText,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      {/* Fondo oscuro */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Contenido del modal */}
      <div className="relative bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl space-y-6">
        {/* Botón de cierre */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          data-testid="close-button"
        >
          <X className="h-6 w-6 text-text-secondary" />
        </button>

        {/* Título */}
        <h2 className="text-2xl font-bold text-primary">{title}</h2>

        {/* Mensaje */}
        <p className="text-text-secondary">{message}</p>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-2">
          {cancelButtonText && (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-text-secondary hover:bg-gray-100 transition-colors"
            >
              {cancelButtonText}
            </button>
          )}
          <button
            onClick={onConfirm ? onConfirm : onClose}
            className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;