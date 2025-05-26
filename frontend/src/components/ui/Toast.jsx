import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

function Toast({ type = 'success', message, onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-lavender-50 border-lavender-200',
          icon: 'text-lavender-500',
          text: 'text-lavender-800',
          closeButton: 'text-lavender-400 hover:text-lavender-500'
        };
      case 'error':
        return {
          container: 'bg-red-50 border-red-200',
          icon: 'text-red-500',
          text: 'text-red-800',
          closeButton: 'text-red-400 hover:text-red-500'
        };
      default:
        return {
          container: 'bg-lavender-50 border-lavender-200',
          icon: 'text-lavender-500',
          text: 'text-lavender-800',
          closeButton: 'text-lavender-400 hover:text-lavender-500'
        };
    }
  };

  const styles = getToastStyles();

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <div className={`flex items-center p-4 rounded-lg border shadow-lg ${styles.container}`}>
        <div className={`flex-shrink-0 ${styles.icon}`}>
          {type === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
        </div>
        <div className={`ml-3 ${styles.text} font-medium`}>
          {message}
        </div>
        <button
          onClick={onClose}
          className={`ml-6 flex-shrink-0 ${styles.closeButton} focus:outline-none`}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

export default Toast;