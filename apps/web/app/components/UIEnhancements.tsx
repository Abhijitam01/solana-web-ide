'use client';

import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { notificationSlideIn, fadeInUp, scaleIn, buttonHover, buttonTap } from '../../lib/animations';

interface UIEnhancementsProps {
  children: React.ReactNode;
}

// Loading Spinner Component
export function LoadingSpinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <motion.div 
      className={`rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]} ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
}

// Skeleton Loader Component
export function SkeletonLoader({ className = '', lines = 1 }: { className?: string; lines?: number }) {
  return (
    <motion.div 
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div 
          key={i} 
          className="h-4 bg-gray-200 rounded mb-2 last:mb-0"
          animate={{ 
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.02, 1]
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            delay: i * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </motion.div>
  );
}

// Toast Notification Component
interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

export function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, id, onClose]);

  const typeStyles = {
    success: 'border-green-500 bg-green-50 text-green-800',
    error: 'border-red-500 bg-red-50 text-red-800',
    warning: 'border-yellow-500 bg-yellow-50 text-yellow-800',
    info: 'border-blue-500 bg-blue-50 text-blue-800'
  };

  const typeIcons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  return (
    <motion.div
      className={`
        fixed top-4 right-4 z-50 max-w-sm w-full
        border rounded-lg p-4 shadow-lg
        ${typeStyles[type]}
      `}
      variants={notificationSlideIn}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
    >
      <div className="flex items-start">
        <motion.div 
          className="flex-shrink-0"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
        >
          <span className="text-lg">{typeIcons[type]}</span>
        </motion.div>
        <div className="ml-3 flex-1">
          <motion.h4 
            className="text-sm font-medium"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.1 }}
          >
            {title}
          </motion.h4>
          {message && (
            <motion.p 
              className="text-sm mt-1"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.2 }}
            >
              {message}
            </motion.p>
          )}
        </div>
        <motion.button
          onClick={() => onClose(id)}
          className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ✕
        </motion.button>
      </div>
    </motion.div>
  );
}

// Toast Container
export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = (toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id, onClose: removeToast }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Expose addToast globally
  useEffect(() => {
    (window as any).addToast = addToast;
    return () => {
      delete (window as any).addToast;
    };
  }, []);

  return (
    <AnimatePresence>
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} />
      ))}
    </AnimatePresence>
  );
}

// Progress Bar Component
interface ProgressBarProps {
  progress: number;
  className?: string;
  showPercentage?: boolean;
  animated?: boolean;
}

export function ProgressBar({ progress, className = '', showPercentage = false, animated = true }: ProgressBarProps) {
  return (
    <motion.div 
      className={`w-full bg-gray-200 rounded-full h-2 ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="h-2 bg-blue-600 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileHover={animated ? { scaleY: 1.5 } : {}}
      />
      {showPercentage && (
        <motion.div 
          className="text-xs text-gray-600 mt-1 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {Math.round(progress)}%
        </motion.div>
      )}
    </motion.div>
  );
}

// Tooltip Component
interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export function Tooltip({ content, children, position = 'top', delay = 500 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-800',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-800',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-l-gray-800',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-r-gray-800'
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`
              absolute z-50 px-2 py-1 text-xs text-white bg-gray-800 rounded
              shadow-lg whitespace-nowrap
              ${positionClasses[position]}
            `}
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {content}
            <div
              className={`
                absolute w-0 h-0 border-4 border-transparent
                ${arrowClasses[position]}
              `}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Modal Component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closable?: boolean;
}

export function Modal({ isOpen, onClose, title, children, size = 'md', closable = true }: ModalProps) {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closable) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closable) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closable, onClose]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleOverlayClick}
          variants={modalOverlay}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <motion.div
            className="relative bg-white rounded-lg shadow-xl w-full"
            variants={modalContent}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`${sizeClasses[size]}`}
          >
            {title && (
              <motion.div 
                className="flex items-center justify-between p-6 border-b"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                {closable && (
                  <motion.button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ✕
                  </motion.button>
                )}
              </motion.div>
            )}
            <motion.div 
              className="p-6"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.2 }}
            >
              {children}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

// Confirmation Dialog Component
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info'
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const typeStyles = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-600 hover:bg-yellow-700',
    info: 'bg-blue-600 hover:bg-blue-700'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        <p className="text-gray-600">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 text-white rounded-md transition-colors ${typeStyles[type]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// Dropdown Component
interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  position?: 'left' | 'right';
  className?: string;
}

export function Dropdown({ trigger, children, position = 'left', className = '' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const positionClasses = {
    left: 'left-0',
    right: 'right-0'
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <motion.div 
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {trigger}
      </motion.div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`
              absolute top-full mt-1 z-50
              bg-white border border-gray-200 rounded-md shadow-lg
              min-w-48
              ${positionClasses[position]}
            `}
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Dropdown Item Component
interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export function DropdownItem({ children, onClick, className = '', disabled = false }: DropdownItemProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full text-left px-4 py-2 text-sm text-gray-700
        hover:bg-gray-100
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      whileHover={{ backgroundColor: '#f3f4f6' }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.button>
  );
}

// Main UI Enhancements Provider
export default function UIEnhancements({ children }: UIEnhancementsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Add smooth scrolling to all anchor links
    const handleAnchorClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const targetId = target.getAttribute('href')?.substring(1);
        const targetElement = document.getElementById(targetId || '');
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
}

// Utility functions for global use
export const showToast = (toast: Omit<ToastProps, 'id' | 'onClose'>) => {
  if (typeof window !== 'undefined' && (window as any).addToast) {
    (window as any).addToast(toast);
  }
};

export const showSuccess = (title: string, message?: string) => {
  showToast({ type: 'success', title, message });
};

export const showError = (title: string, message?: string) => {
  showToast({ type: 'error', title, message });
};

export const showWarning = (title: string, message?: string) => {
  showToast({ type: 'warning', title, message });
};

export const showInfo = (title: string, message?: string) => {
  showToast({ type: 'info', title, message });
};
