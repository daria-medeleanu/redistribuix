import { useState } from 'react';
import { createPortal } from 'react-dom';

export default function ConfirmationModal({ isOpen, title, message, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel, isDangerous = false, children }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl">
        
        <div className="border-b border-slate-100 p-6">
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        </div>

        <div className="px-6 py-4">
          {children ? (
            children
          ) : (
            <p className="text-sm text-slate-600 leading-relaxed">{message}</p>
          )}
        </div>

        <div className="border-t border-slate-100 flex gap-3 p-6">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 rounded-lg border border-slate-300 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isDangerous 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-[#4d4dff] hover:bg-[#3d3dff]'
            }`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
