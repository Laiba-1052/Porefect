import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const types = {
    success: {
      bgColor: 'bg-success-50',
      textColor: 'text-success-700',
      icon: <CheckCircle className="h-5 w-5 text-success-500" />
    },
    error: {
      bgColor: 'bg-error-50',
      textColor: 'text-error-700',
      icon: <AlertCircle className="h-5 w-5 text-error-500" />
    }
  };

  const { bgColor, textColor, icon } = types[type] || types.success;

  return (
    <div className={`fixed top-4 right-4 z-50 animate-slide-down ${bgColor} p-4 rounded-lg shadow-lg flex items-start max-w-sm`}>
      <div className="flex-shrink-0 mr-3">
        {icon}
      </div>
      <div className={`flex-1 ${textColor}`}>
        {message}
      </div>
      <button
        onClick={onClose}
        className="ml-4 text-gray-400 hover:text-gray-600"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export default Toast;