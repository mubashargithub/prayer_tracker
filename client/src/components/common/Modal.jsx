import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, className = '' }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/45 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4">
        <div className={`relative w-full max-w-md transform overflow-hidden rounded-t-3xl sm:rounded-xl bg-white dark:bg-charcoal-surface p-6 shadow-xl border-t sm:border border-gray-100 dark:border-charcoal-border transition-all duration-300 max-h-[90vh] sm:max-h-auto overflow-y-auto pb-safe ${className}`}>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-charcoal-border pb-3 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
            <button onClick={onClose} className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-charcoal-border text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all">
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="text-gray-600 dark:text-gray-300">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
